"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  MealStage,
  PersonType,
  PortionSize,
  TastePreference,
} from "@/lib/constants";
import type { FamilyMember, HouseholdRule } from "@/lib/types";

export async function getFamilyMembers(): Promise<FamilyMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("family_members")
    .select(
      "id, display_name, age_label, person_type, meal_stage, portion_size, disliked_foods, liked_foods, allergies, taste_preference, dietary_restriction, created_at"
    )
    .is("removed_at", null)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []) as unknown as FamilyMember[];
}

export async function getHouseholdRules(): Promise<HouseholdRule[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("household_rules")
    .select("id, rule_text, created_at")
    .is("removed_at", null)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []) as unknown as HouseholdRule[];
}

export async function addFamilyMember(formData: FormData) {
  const displayName = String(formData.get("display_name") ?? "").trim();
  const ageLabel = String(formData.get("age_label") ?? "").trim();
  const personType = String(formData.get("person_type") ?? "") as PersonType;
  const mealStage = String(formData.get("meal_stage") ?? "大人") as MealStage;
  const portionSize = String(formData.get("portion_size") ?? "普通") as PortionSize;
  const dislikedFoods = String(formData.get("disliked_foods") ?? "").trim();
  const likedFoods = String(formData.get("liked_foods") ?? "").trim();
  const allergies = String(formData.get("allergies") ?? "").trim();
  const tastePreference = String(formData.get("taste_preference") ?? "普通") as TastePreference;
  const dietaryRestriction = String(formData.get("dietary_restriction") ?? "").trim();

  if (!displayName || !personType) {
    throw new Error("呼び名と区分は必須です。");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("family_members").insert({
    display_name: displayName,
    age_label: ageLabel || null,
    person_type: personType,
    meal_stage: mealStage,
    portion_size: portionSize,
    disliked_foods: dislikedFoods || null,
    liked_foods: likedFoods || null,
    allergies: allergies || null,
    taste_preference: tastePreference,
    dietary_restriction: dietaryRestriction || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/family");
}

export async function removeFamilyMember(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("family_members")
    .update({ removed_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/family");
}

export async function addHouseholdRule(formData: FormData) {
  const ruleText = String(formData.get("rule_text") ?? "").trim();
  if (!ruleText) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("household_rules").insert({ rule_text: ruleText });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/family");
}

export async function removeHouseholdRule(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("household_rules")
    .update({ removed_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/family");
}
