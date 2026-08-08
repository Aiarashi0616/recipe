import type { Category } from "./constants";

export type Recipe = {
  id: string;
  source_url: string;
  category: Category;
  note: string | null;
  created_at: string;
};

export type RecipeWithTags = Recipe & {
  tags: string[];
};
