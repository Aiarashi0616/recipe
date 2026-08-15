import { addMealPlanEntry } from "@/app/actions/mealPlan";
import { MEAL_TYPES } from "@/lib/constants";
import { addDays, formatISODate, todayInJST } from "@/lib/date";

export function AddToMealPlanForm({
  recipeId,
  returnTo,
}: {
  recipeId: string;
  returnTo: string;
}) {
  const today = todayInJST();
  const min = formatISODate(addDays(today, -365));
  const max = formatISODate(addDays(today, 365));
  const defaultDate = formatISODate(today);

  return (
    <form
      action={addMealPlanEntry}
      className="mt-4 flex flex-wrap items-end gap-2 rounded-xl border border-black/5 bg-white/60 p-3 dark:bg-white/5"
    >
      <input type="hidden" name="recipe_id" value={recipeId} />
      <input type="hidden" name="return_to" value={returnTo} />

      <div className="flex flex-col gap-1">
        <label htmlFor="entry_date" className="text-xs font-semibold text-foreground/60">
          日付
        </label>
        <input
          id="entry_date"
          name="entry_date"
          type="date"
          required
          defaultValue={defaultDate}
          min={min}
          max={max}
          className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm outline-none focus:border-accent dark:bg-white/5"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="meal_type" className="text-xs font-semibold text-foreground/60">
          食事
        </label>
        <select
          id="meal_type"
          name="meal_type"
          defaultValue={MEAL_TYPES[2]}
          className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm outline-none focus:border-accent dark:bg-white/5"
        >
          {MEAL_TYPES.map((meal) => (
            <option key={meal} value={meal}>
              {meal}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover"
      >
        献立に追加
      </button>
    </form>
  );
}
