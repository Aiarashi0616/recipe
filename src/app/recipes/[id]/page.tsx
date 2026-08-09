import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipeById } from "@/app/actions/recipes";
import { CategoryBadge } from "@/components/CategoryBadge";
import { DeleteRecipeButton } from "@/components/DeleteRecipeButton";

export default async function RecipeDetailPage(props: PageProps<"/recipes/[id]">) {
  const { id } = await props.params;
  const recipe = await getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-2">
        <Link href="/" className="text-sm text-foreground/50 hover:underline">
          ← 一覧に戻る
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/recipes/${recipe.id}/edit`}
            className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-foreground/60 transition hover:border-accent hover:text-accent"
          >
            編集
          </Link>
          <DeleteRecipeButton id={recipe.id} />
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm dark:bg-white/5">
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge category={recipe.category} size="lg" />
          <span className="text-xs text-foreground/50">
            {new Date(recipe.created_at).toLocaleDateString("ja-JP")}
          </span>
        </div>

        {recipe.title && (
          <h1 className="mt-3 text-xl font-bold text-foreground">{recipe.title}</h1>
        )}

        {recipe.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {recipe.tags.map((tag) => (
              <Link
                key={tag}
                href={`/?tag=${encodeURIComponent(tag)}`}
                className="rounded-full bg-tag-bg px-2.5 py-1 text-xs text-tag-fg transition hover:opacity-80"
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
          className="mt-4 block truncate rounded-xl bg-accent-soft px-4 py-2.5 text-sm text-accent underline"
        >
          {recipe.source_url}
        </a>

        {recipe.ingredients && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-foreground/70">材料</h2>
            <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/80">
              {recipe.ingredients}
            </p>
          </div>
        )}

        {recipe.steps && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-foreground/70">作り方</h2>
            <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/80">{recipe.steps}</p>
          </div>
        )}

        {recipe.note && (
          <p className="mt-4 whitespace-pre-wrap text-sm text-foreground/80">{recipe.note}</p>
        )}
      </div>
    </div>
  );
}
