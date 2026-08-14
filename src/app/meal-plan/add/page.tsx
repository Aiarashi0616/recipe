import Link from "next/link";
import { notFound } from "next/navigation";
import { listRecipes } from "@/app/actions/recipes";
import { addMealPlanEntry } from "@/app/actions/mealPlan";
import { CategoryBadge } from "@/components/CategoryBadge";
import { MEAL_TYPES, type MealType } from "@/lib/constants";
import { formatDayLabel, formatISODate, parseISODate, startOfWeek } from "@/lib/date";

export default async function AddMealPlanEntryPage(props: PageProps<"/meal-plan/add">) {
  const searchParams = await props.searchParams;
  const date = typeof searchParams.date === "string" ? searchParams.date : undefined;
  const meal = typeof searchParams.meal === "string" ? searchParams.meal : undefined;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;

  if (!date || !MEAL_TYPES.includes(meal as MealType)) {
    notFound();
  }

  const weekStart = formatISODate(startOfWeek(parseISODate(date)));
  const recipes = await listRecipes({ q });

  return (
    <div className="flex flex-col gap-5">
      <Link href={`/meal-plan?week=${weekStart}`} className="text-sm text-foreground/50 hover:underline">
        ← 献立カレンダーに戻る
      </Link>

      <h1 className="text-xl font-bold">
        {formatDayLabel(parseISODate(date))}の{meal}にレシピを追加
      </h1>

      <form method="get" className="flex gap-2">
        <input type="hidden" name="date" value={date} />
        <input type="hidden" name="meal" value={meal} />
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="料理名・材料タグで検索"
          className="w-full rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm outline-none placeholder:text-foreground/40 focus:border-accent dark:bg-white/5"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          検索
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {recipes.length === 0 && (
          <p className="mt-4 text-center text-sm text-foreground/50">
            レシピが見つかりませんでした。
          </p>
        )}
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-black/5 bg-white/70 p-3 shadow-sm dark:bg-white/5"
          >
            <div className="flex min-w-0 flex-col gap-1">
              <CategoryBadge category={recipe.category} />
              <span className="truncate text-sm font-medium text-foreground">
                {recipe.title ?? (recipe.tags.length > 0 ? recipe.tags.join("・") : "無題のレシピ")}
              </span>
            </div>
            <form action={addMealPlanEntry}>
              <input type="hidden" name="entry_date" value={date} />
              <input type="hidden" name="meal_type" value={meal} />
              <input type="hidden" name="recipe_id" value={recipe.id} />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-accent-hover"
              >
                この日に追加
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
