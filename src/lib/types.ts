import type { Category } from "./constants";

export type Recipe = {
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

export type RecipeWithTags = Recipe & {
  tags: string[];
};
