import Link from "next/link";
import { CategoryBadge } from "./CategoryBadge";
import type { RecipeWithTags } from "@/lib/types";

export function RecipeCard({ recipe }: { recipe: RecipeWithTags }) {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="block rounded-2xl border border-black/5 bg-white/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-white/5"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CategoryBadge category={recipe.category} />
          {recipe.prep_minutes && (
            <span className="text-xs text-foreground/50">⏱️ {recipe.prep_minutes}分</span>
          )}
        </div>
        <span className="text-xs text-foreground/50">
          {new Date(recipe.created_at).toLocaleDateString("ja-JP")}
        </span>
      </div>
      {recipe.title && (
        <h2 className="mt-2 font-semibold text-foreground">{recipe.title}</h2>
      )}
      {recipe.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-tag-bg px-2 py-0.5 text-xs text-tag-fg"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
