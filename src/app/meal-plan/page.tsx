import Link from "next/link";
import { getMealPlanEntries, removeMealPlanEntry } from "@/app/actions/mealPlan";
import { ConfirmActionButton } from "@/components/ConfirmActionButton";
import { MEAL_TYPES } from "@/lib/constants";
import {
  addDays,
  formatDayLabel,
  formatISODate,
  formatWeekRangeLabel,
  parseISODate,
  startOfWeek,
  todayInJST,
} from "@/lib/date";
import type { MealPlanEntry } from "@/lib/types";

export default async function MealPlanPage(props: PageProps<"/meal-plan">) {
  const searchParams = await props.searchParams;
  const weekParam = typeof searchParams.week === "string" ? searchParams.week : undefined;

  const weekStart = weekParam ? startOfWeek(parseISODate(weekParam)) : startOfWeek(todayInJST());
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const startDate = formatISODate(days[0]);
  const endDate = formatISODate(days[6]);
  const entries = await getMealPlanEntries(startDate, endDate);

  const grouped = new Map<string, MealPlanEntry[]>();
  for (const entry of entries) {
    const key = `${entry.entry_date}_${entry.meal_type}`;
    const list = grouped.get(key) ?? [];
    list.push(entry);
    grouped.set(key, list);
  }

  const prevWeek = formatISODate(addDays(weekStart, -7));
  const nextWeek = formatISODate(addDays(weekStart, 7));
  const todayISO = formatISODate(todayInJST());

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Link
          href={`/meal-plan?week=${prevWeek}`}
          className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-foreground/60 transition hover:border-accent hover:text-accent"
        >
          ← 前の週
        </Link>
        <h1 className="text-sm font-semibold text-foreground/70">
          {formatWeekRangeLabel(weekStart)}
        </h1>
        <Link
          href={`/meal-plan?week=${nextWeek}`}
          className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-foreground/60 transition hover:border-accent hover:text-accent"
        >
          次の週 →
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {days.map((day) => {
          const iso = formatISODate(day);
          const isToday = iso === todayISO;
          return (
            <div
              key={iso}
              className={`rounded-2xl border p-4 shadow-sm ${
                isToday
                  ? "border-accent bg-accent-soft/40"
                  : "border-black/5 bg-white/70 dark:bg-white/5"
              }`}
            >
              <h2 className="text-sm font-bold text-foreground">{formatDayLabel(day)}</h2>
              <div className="mt-2 flex flex-col gap-2">
                {MEAL_TYPES.map((meal) => {
                  const key = `${iso}_${meal}`;
                  const mealEntries = grouped.get(key) ?? [];
                  return (
                    <div key={meal} className="flex items-start gap-2">
                      <span className="mt-1.5 w-12 shrink-0 text-xs font-semibold text-foreground/50">
                        {meal}
                      </span>
                      <div className="flex flex-1 flex-wrap items-center gap-1.5">
                        {mealEntries.map((entry) => (
                          <span
                            key={entry.id}
                            className="flex items-center gap-1 rounded-full bg-tag-bg py-1 pl-2.5 pr-1 text-xs text-tag-fg"
                          >
                            <Link href={`/recipes/${entry.recipe.id}`} className="hover:underline">
                              {entry.recipe.title ?? "レシピを見る"}
                            </Link>
                            <ConfirmActionButton
                              action={removeMealPlanEntry.bind(null, entry.id)}
                              confirmMessage="この献立を削除しますか？"
                              label="×"
                            />
                          </span>
                        ))}
                        <Link
                          href={`/meal-plan/add?date=${iso}&meal=${encodeURIComponent(meal)}`}
                          className="rounded-full border border-dashed border-black/15 px-2.5 py-1 text-xs text-foreground/50 transition hover:border-accent hover:text-accent"
                        >
                          ＋ 追加
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
