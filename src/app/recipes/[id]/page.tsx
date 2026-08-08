import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipeById } from "@/app/actions/recipes";
import { CategoryBadge } from "@/components/CategoryBadge";

export default async function RecipeDetailPage(props: PageProps<"/recipes/[id]">) {
  const { id } = await props.params;
  const recipe = await getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-5">
      <Link href="/" className="text-sm text-foreground/50 hover:underline">
        ← 一覧に戻る
      </Link>

      <div className="rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm dark:bg-white/5">
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge category={recipe.category} />
          <span className="text-xs text-foreground/50">
            {new Date(recipe.created_at).toLocaleDateString("ja-JP")}
          </span>
        </div>

        {recipe.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {recipe.tags.map((tag) => (
              <Link
                key={tag}
                href={`/?tag=${encodeURIComponent(tag)}`}
                className="rounded-full bg-orange-50 px-2.5 py-1 text-xs text-orange-600 transition hover:bg-orange-100 dark:bg-orange-950/40 dark:text-orange-300"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <a
          href={recipe.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block truncate rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600 underline dark:bg-rose-950/30 dark:text-rose-300"
        >
          {recipe.source_url}
        </a>

        {recipe.note && (
          <p className="mt-4 whitespace-pre-wrap text-sm text-foreground/80">{recipe.note}</p>
        )}
      </div>
    </div>
  );
}
