"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { extractRecipeFromUrl, getDomain, isInstagramUrl } from "@/lib/recipeExtractor";
import { recordFetchFailure, recordFetchSuccess } from "@/lib/fetchFailures";
import { MEAL_COMPANION_CATEGORIES, type Category } from "@/lib/constants";
import type { RecipeWithTags } from "@/lib/types";

type SupabaseClient = ReturnType<typeof createClient>;

async function findOrCreateTagId(supabase: SupabaseClient, name: string): Promise<string> {
  const { data: existing } = await supabase
    .from("tags")
    .select("id")
    .eq("name", name)
    .maybeSingle();

  if (existing) {
    return existing.id;
  }

  const { data: inserted, error } = await supabase
    .from("tags")
    .insert({ name })
    .select("id")
    .single();

  if (error || !inserted) {
    throw new Error(error?.message ?? "タグの保存に失敗しました。");
  }
  return inserted.id;
}

export async function createRecipe(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const sourceUrl = String(formData.get("source_url") ?? "").trim();
  const category = String(formData.get("category") ?? "") as Category;
  const note = String(formData.get("note") ?? "").trim();
  const babyFoodNote = String(formData.get("baby_food_note") ?? "").trim();
  let ingredients = String(formData.get("ingredients") ?? "").trim();
  let steps = String(formData.get("steps") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "");
  const tagNames = Array.from(
    new Set(
      tagsRaw
        .split(/[,、\s]+/)
        .map((t) => t.trim())
        .filter(Boolean)
    )
  );

  if (!sourceUrl || !category) {
    throw new Error("URLとカテゴリは必須です。");
  }

  if (!ingredients && !steps && !isInstagramUrl(sourceUrl)) {
    const domain = getDomain(sourceUrl);
    const extracted = await extractRecipeFromUrl(sourceUrl);
    if (extracted) {
      ingredients = extracted.ingredients;
      steps = extracted.steps;
      await recordFetchSuccess(domain);
    } else {
      await recordFetchFailure(domain, "構造化データ(JSON-LD Recipe)が見つかりませんでした");
    }
  }

  const supabase = createClient();

  const { data: recipe, error: recipeError } = await supabase
    .from("recipes")
    .insert({
      title: title || null,
      source_url: sourceUrl,
      category,
      ingredients: ingredients || null,
      steps: steps || null,
      note: note || null,
      baby_food_note: babyFoodNote || null,
    })
    .select("id")
    .single();

  if (recipeError || !recipe) {
    throw new Error(recipeError?.message ?? "レシピの保存に失敗しました。");
  }

  if (tagNames.length > 0) {
    const tagIds: string[] = [];
    for (const name of tagNames) {
      tagIds.push(await findOrCreateTagId(supabase, name));
    }

    const { error: linkError } = await supabase
      .from("recipe_tags")
      .insert(tagIds.map((tag_id) => ({ recipe_id: recipe.id, tag_id })));

    if (linkError) {
      throw new Error(linkError.message);
    }
  }

  redirect(`/recipes/${recipe.id}`);
}

const RECIPE_SELECT =
  "id, title, source_url, category, ingredients, steps, note, baby_food_note, created_at";

type RecipeRow = {
  id: string;
  title: string | null;
  source_url: string;
  category: Category;
  ingredients: string | null;
  steps: string | null;
  note: string | null;
  baby_food_note: string | null;
  created_at: string;
};

function mapRecipeRow(r: RecipeRow, tags: string[]): RecipeWithTags {
  return {
    id: r.id,
    title: r.title,
    source_url: r.source_url,
    category: r.category,
    ingredients: r.ingredients,
    steps: r.steps,
    note: r.note,
    baby_food_note: r.baby_food_note,
    created_at: r.created_at,
    tags,
  };
}

// 有効な（removed_atが無い）タグだけをレシピIDごとにまとめて取得する。
// !inner での埋め込みフィルタは「タグが1件も無いレシピ」を結果から除外してしまうため使わない。
async function getTagsByRecipeIds(
  supabase: SupabaseClient,
  recipeIds: string[]
): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  if (recipeIds.length === 0) {
    return map;
  }

  const { data, error } = await supabase
    .from("recipe_tags")
    .select("recipe_id, tags(name)")
    .in("recipe_id", recipeIds)
    .is("removed_at", null);

  if (error) {
    throw new Error(error.message);
  }

  for (const row of (data ?? []) as unknown as {
    recipe_id: string;
    tags: { name: string } | null;
  }[]) {
    const name = row.tags?.name;
    if (!name) continue;
    const list = map.get(row.recipe_id) ?? [];
    list.push(name);
    map.set(row.recipe_id, list);
  }

  return map;
}

export async function listRecipes(filters: {
  category?: string;
  q?: string;
}): Promise<RecipeWithTags[]> {
  const supabase = createClient();

  if (!filters.q) {
    let query = supabase
      .from("recipes")
      .select(RECIPE_SELECT)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (filters.category) {
      query = query.eq("category", filters.category);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }
    const rows = (data ?? []) as unknown as RecipeRow[];
    const tagsMap = await getTagsByRecipeIds(
      supabase,
      rows.map((r) => r.id)
    );
    return rows.map((r) => mapRecipeRow(r, tagsMap.get(r.id) ?? []));
  }

  // 料理名（部分一致）または材料タグ（部分一致）のどちらかにマッチするレシピを検索する
  const { data: tagRows } = await supabase
    .from("recipe_tags")
    .select("recipe_id, tags!inner(name)")
    .is("removed_at", null)
    .ilike("tags.name", `%${filters.q}%`);
  const tagMatchedIds = (tagRows ?? []).map((r) => r.recipe_id);

  let titleQuery = supabase
    .from("recipes")
    .select(RECIPE_SELECT)
    .is("deleted_at", null)
    .ilike("title", `%${filters.q}%`);
  if (filters.category) {
    titleQuery = titleQuery.eq("category", filters.category);
  }
  const { data: titleMatches, error: titleError } = await titleQuery;
  if (titleError) {
    throw new Error(titleError.message);
  }

  let tagMatches: RecipeRow[] = [];
  if (tagMatchedIds.length > 0) {
    let tagQuery = supabase
      .from("recipes")
      .select(RECIPE_SELECT)
      .is("deleted_at", null)
      .in("id", tagMatchedIds);
    if (filters.category) {
      tagQuery = tagQuery.eq("category", filters.category);
    }
    const { data, error: tagError } = await tagQuery;
    if (tagError) {
      throw new Error(tagError.message);
    }
    tagMatches = (data ?? []) as unknown as RecipeRow[];
  }

  const merged = new Map<string, RecipeRow>();
  for (const r of [...((titleMatches ?? []) as unknown as RecipeRow[]), ...tagMatches]) {
    merged.set(r.id, r);
  }

  const mergedRows = Array.from(merged.values()).sort((a, b) =>
    a.created_at < b.created_at ? 1 : -1
  );
  const tagsMap = await getTagsByRecipeIds(
    supabase,
    mergedRows.map((r) => r.id)
  );
  return mergedRows.map((r) => mapRecipeRow(r, tagsMap.get(r.id) ?? []));
}

export async function getRecipeById(id: string): Promise<RecipeWithTags | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(RECIPE_SELECT)
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    return null;
  }

  const tagsMap = await getTagsByRecipeIds(supabase, [id]);
  return mapRecipeRow(data as unknown as RecipeRow, tagsMap.get(id) ?? []);
}

export async function updateRecipe(id: string, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const sourceUrl = String(formData.get("source_url") ?? "").trim();
  const category = String(formData.get("category") ?? "") as Category;
  const ingredients = String(formData.get("ingredients") ?? "").trim();
  const steps = String(formData.get("steps") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const babyFoodNote = String(formData.get("baby_food_note") ?? "").trim();

  if (!sourceUrl || !category) {
    throw new Error("URLとカテゴリは必須です。");
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("recipes")
    .update({
      title: title || null,
      source_url: sourceUrl,
      category,
      ingredients: ingredients || null,
      steps: steps || null,
      note: note || null,
      baby_food_note: babyFoodNote || null,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/recipes/${id}`);
}

export async function softDeleteRecipe(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("recipes")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/");
}

export async function addTagToRecipe(recipeId: string, tagName: string) {
  const name = tagName.trim();
  if (!name) {
    return;
  }

  const supabase = createClient();
  const tagId = await findOrCreateTagId(supabase, name);

  const { data: existingLink } = await supabase
    .from("recipe_tags")
    .select("recipe_id")
    .eq("recipe_id", recipeId)
    .eq("tag_id", tagId)
    .maybeSingle();

  if (existingLink) {
    const { error } = await supabase
      .from("recipe_tags")
      .update({ removed_at: null })
      .eq("recipe_id", recipeId)
      .eq("tag_id", tagId);
    if (error) {
      throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from("recipe_tags")
      .insert({ recipe_id: recipeId, tag_id: tagId });
    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath(`/recipes/${recipeId}`);
}

export async function removeTagFromRecipe(recipeId: string, tagName: string) {
  const supabase = createClient();
  const { data: tag } = await supabase
    .from("tags")
    .select("id")
    .eq("name", tagName)
    .maybeSingle();

  if (!tag) {
    return;
  }

  const { error } = await supabase
    .from("recipe_tags")
    .update({ removed_at: new Date().toISOString() })
    .eq("recipe_id", recipeId)
    .eq("tag_id", tag.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/recipes/${recipeId}`);
}

export type MealSuggestion = {
  category: Category;
  recipe: RecipeWithTags | null;
};

export async function getMealSuggestions(
  recipeId: string,
  category: Category
): Promise<MealSuggestion[]> {
  const supabase = createClient();
  const companionCategories = MEAL_COMPANION_CATEGORIES.filter((c) => c !== category);

  const suggestions: MealSuggestion[] = [];
  for (const companionCategory of companionCategories) {
    const { data, error } = await supabase
      .from("recipes")
      .select(RECIPE_SELECT)
      .eq("category", companionCategory)
      .is("deleted_at", null)
      .neq("id", recipeId);

    if (error) {
      throw new Error(error.message);
    }

    const candidates = (data ?? []) as unknown as RecipeRow[];
    const picked =
      candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : null;

    if (picked) {
      const tagsMap = await getTagsByRecipeIds(supabase, [picked.id]);
      suggestions.push({
        category: companionCategory,
        recipe: mapRecipeRow(picked, tagsMap.get(picked.id) ?? []),
      });
    } else {
      suggestions.push({ category: companionCategory, recipe: null });
    }
  }

  return suggestions;
}
