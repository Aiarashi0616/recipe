"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { extractRecipeFromUrl, getDomain, isInstagramUrl } from "@/lib/recipeExtractor";
import { recordFetchFailure, recordFetchSuccess } from "@/lib/fetchFailures";
import { MEAL_COMPANION_CATEGORIES, type Category } from "@/lib/constants";
import type { RecipeWithTags } from "@/lib/types";

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
      const { data: existing } = await supabase
        .from("tags")
        .select("id")
        .eq("name", name)
        .maybeSingle();

      if (existing) {
        tagIds.push(existing.id);
      } else {
        const { data: inserted, error: tagError } = await supabase
          .from("tags")
          .insert({ name })
          .select("id")
          .single();
        if (tagError || !inserted) {
          throw new Error(tagError?.message ?? "タグの保存に失敗しました。");
        }
        tagIds.push(inserted.id);
      }
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
  "id, title, source_url, category, ingredients, steps, note, baby_food_note, created_at, recipe_tags(tags(name))";

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
  recipe_tags: { tags: { name: string } | null }[] | null;
};

function mapRecipeRow(r: RecipeRow): RecipeWithTags {
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
    tags: (r.recipe_tags ?? [])
      .map((rt) => rt.tags?.name)
      .filter((n): n is string => Boolean(n)),
  };
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
    return (data ?? []).map((r) => mapRecipeRow(r as unknown as RecipeRow));
  }

  // 料理名（部分一致）または材料タグ（部分一致）のどちらかにマッチするレシピを検索する
  const { data: tagRows } = await supabase
    .from("recipe_tags")
    .select("recipe_id, tags!inner(name)")
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

  return Array.from(merged.values())
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .map(mapRecipeRow);
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

  return mapRecipeRow(data as unknown as RecipeRow);
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

    suggestions.push({
      category: companionCategory,
      recipe: picked ? mapRecipeRow(picked) : null,
    });
  }

  return suggestions;
}
