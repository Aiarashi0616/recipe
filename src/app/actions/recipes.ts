"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/constants";
import type { RecipeWithTags } from "@/lib/types";

export async function createRecipe(formData: FormData) {
  const sourceUrl = String(formData.get("source_url") ?? "").trim();
  const category = String(formData.get("category") ?? "") as Category;
  const note = String(formData.get("note") ?? "").trim();
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

  const supabase = createClient();

  const { data: recipe, error: recipeError } = await supabase
    .from("recipes")
    .insert({ source_url: sourceUrl, category, note: note || null })
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

export async function listRecipes(filters: {
  category?: string;
  tag?: string;
}): Promise<RecipeWithTags[]> {
  const supabase = createClient();

  let recipeIdsFilter: string[] | null = null;
  if (filters.tag) {
    const { data: tagRows } = await supabase
      .from("recipe_tags")
      .select("recipe_id, tags!inner(name)")
      .eq("tags.name", filters.tag);
    recipeIdsFilter = (tagRows ?? []).map((r) => r.recipe_id);
    if (recipeIdsFilter.length === 0) {
      return [];
    }
  }

  let query = supabase
    .from("recipes")
    .select("id, source_url, category, note, created_at, recipe_tags(tags(name))")
    .order("created_at", { ascending: false });

  if (filters.category) {
    query = query.eq("category", filters.category);
  }
  if (recipeIdsFilter) {
    query = query.in("id", recipeIdsFilter);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((r) => ({
    id: r.id,
    source_url: r.source_url,
    category: r.category,
    note: r.note,
    created_at: r.created_at,
    tags: (r.recipe_tags ?? [])
      .map((rt) => (rt as unknown as { tags: { name: string } | null }).tags?.name)
      .filter((n): n is string => Boolean(n)),
  }));
}

export async function getRecipeById(id: string): Promise<RecipeWithTags | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("id, source_url, category, note, created_at, recipe_tags(tags(name))")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    return null;
  }

  return {
    id: data.id,
    source_url: data.source_url,
    category: data.category,
    note: data.note,
    created_at: data.created_at,
    tags: (data.recipe_tags ?? [])
      .map((rt) => (rt as unknown as { tags: { name: string } | null }).tags?.name)
      .filter((n): n is string => Boolean(n)),
  };
}
