import { listRecipes } from "@/app/actions/recipes";
import { RecipeCard } from "@/components/RecipeCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { TagFilter } from "@/components/TagFilter";

export default async function Home(props: PageProps<"/">) {
  const searchParams = await props.searchParams;
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;

  const recipes = await listRecipes({ category, q });

  return (
    <div className="flex flex-col gap-5">
      <TagFilter activeCategory={category} activeQuery={q} />
      <CategoryFilter activeCategory={category} activeQuery={q} />

      {recipes.length === 0 ? (
        <p className="mt-8 text-center text-sm text-foreground/50">
          レシピが見つかりませんでした。まずは1件登録してみましょう。
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
