import { updateRecipe } from "@/app/actions/recipes";
import { CATEGORIES } from "@/lib/constants";
import type { RecipeWithTags } from "@/lib/types";

export function EditRecipeForm({ recipe }: { recipe: RecipeWithTags }) {
  const action = updateRecipe.bind(null, recipe.id);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-semibold">
          料理名
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={recipe.title ?? ""}
          placeholder="鶏肉と玉ねぎの生姜焼き"
          className="rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 outline-none focus:border-accent dark:bg-white/5"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="source_url" className="text-sm font-semibold">
          レシピのURL
        </label>
        <input
          id="source_url"
          name="source_url"
          type="url"
          required
          defaultValue={recipe.source_url}
          className="rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 outline-none focus:border-accent dark:bg-white/5"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="category" className="text-sm font-semibold">
          カテゴリ
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue={recipe.category}
          className="rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 outline-none focus:border-accent dark:bg-white/5"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ingredients" className="text-sm font-semibold">
          材料
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          rows={4}
          defaultValue={recipe.ingredients ?? ""}
          className="rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 outline-none focus:border-accent dark:bg-white/5"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="steps" className="text-sm font-semibold">
          作り方
        </label>
        <textarea
          id="steps"
          name="steps"
          rows={5}
          defaultValue={recipe.steps ?? ""}
          className="rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 outline-none focus:border-accent dark:bg-white/5"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="note" className="text-sm font-semibold">
          memo
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          defaultValue={recipe.note ?? ""}
          className="rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 outline-none focus:border-accent dark:bg-white/5"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="baby_food_note" className="text-sm font-semibold">
          離乳食アレンジ
        </label>
        <textarea
          id="baby_food_note"
          name="baby_food_note"
          rows={3}
          defaultValue={recipe.baby_food_note ?? ""}
          placeholder="離乳食後期はレシピ通りで大人と同じでOK、など"
          className="rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 outline-none focus:border-accent dark:bg-white/5"
        />
      </div>

      <p className="text-xs text-foreground/50">
        メイン食材（タグ）はレシピ詳細画面で追加・削除できます。
      </p>

      <button
        type="submit"
        className="mt-2 rounded-full bg-accent px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-accent-hover"
      >
        更新する
      </button>
    </form>
  );
}
