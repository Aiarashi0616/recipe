import type { Category, MealStage, PersonType, PortionSize, TastePreference } from "./constants";

export type Recipe = {
  id: string;
  title: string | null;
  source_url: string;
  category: Category;
  ingredients: string | null;
  steps: string | null;
  note: string | null;
  baby_food_note: string | null;
  prep_minutes: number | null;
  created_at: string;
};

export type RecipeWithTags = Recipe & {
  tags: string[];
};

export type FamilyMember = {
  id: string;
  display_name: string;
  age_label: string | null;
  person_type: PersonType;
  meal_stage: MealStage;
  portion_size: PortionSize;
  disliked_foods: string | null;
  liked_foods: string | null;
  allergies: string | null;
  taste_preference: TastePreference;
  dietary_restriction: string | null;
  created_at: string;
};

export type HouseholdRule = {
  id: string;
  rule_text: string;
  created_at: string;
};

export type HouseholdSettings = {
  weekday_time_limit_minutes: number | null;
  weekend_time_limit_minutes: number | null;
};
