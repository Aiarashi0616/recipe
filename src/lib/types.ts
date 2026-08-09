import type { Category } from "./constants";

export type Recipe = {
  id: string;
  source_url: string;
  category: Category;
  ingredients: string | null;
  steps: string | null;
  note: string | null;
  created_at: string;
};

export type RecipeWithTags = Recipe & {
  tags: string[];
};
