"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { formatISODate, parseISODate, startOfWeek } from "@/lib/date";
import type { Category, MealType } from "@/lib/constants";
import type { MealPlanEntry } from "@/lib/types";

type MealPlanRow = {
  id: string;
  entry_date: string;
  meal_type: MealType;
  note: string | null;
  recipe: { id: string; title: string | null; category: Category } | null;
};

export async function getMealPlanEntries(
  startDate: string,
  endDate: string
): Promise<MealPlanEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meal_plan_entries")
    .select("id, entry_date, meal_type, note, recipe:recipes(id, title, category)")
    .gte("entry_date", startDate)
    .lte("entry_date", endDate)
    .is("removed_at", null)
    .order("entry_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as unknown as MealPlanRow[];
  return rows
    .filter((r) => r.recipe !== null)
    .map((r) => ({
      id: r.id,
      entry_date: r.entry_date,
      meal_type: r.meal_type,
      note: r.note,
      recipe: r.recipe!,
    }));
}

export async function addMealPlanEntry(formData: FormData) {
  const entryDate = String(formData.get("entry_date") ?? "").trim();
  const mealType = String(formData.get("meal_type") ?? "") as MealType;
  const recipeId = String(formData.get("recipe_id") ?? "").trim();

  if (!entryDate || !mealType || !recipeId) {
    throw new Error("必要な情報が不足しています。");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("meal_plan_entries").insert({
    entry_date: entryDate,
    meal_type: mealType,
    recipe_id: recipeId,
  });

  if (error) {
    throw new Error(error.message);
  }

  const weekStart = formatISODate(startOfWeek(parseISODate(entryDate)));
  redirect(`/meal-plan?week=${weekStart}`);
}

export async function removeMealPlanEntry(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("meal_plan_entries")
    .update({ removed_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/meal-plan");
}
