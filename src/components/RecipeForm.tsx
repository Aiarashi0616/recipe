import { createRecipe } from "@/app/actions/recipes";
import { CATEGORIES } from "@/lib/constants";

export function RecipeForm() {
  return (
    <form action={createRecipe} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="source_url" className="text-sm font-semibold">
          レシピのURL
        </label>
        <input
          id="source_url"
          name="source_url"
          type="url"
          required
          placeholder="https://cookpad.com/..."
          className="rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 outline-none focus:border-rose-300 dark:bg-white/5"
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
          defaultValue=""
          className="rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 outline-none focus:border-rose-300 dark:bg-white/5"
        >
          <option value="" disabled>
            選択してください
          </option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="tags" className="text-sm font-semibold">
          メイン食材（タグ）
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          placeholder="鶏肉, 玉ねぎ, にんじん"
          className="rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 outline-none focus:border-rose-300 dark:bg-white/5"
        />
        <p className="text-xs text-foreground/50">カンマまたはスペース区切りで複数入力できます</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="note" className="text-sm font-semibold">
          メモ
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          placeholder="大人の味付け前に子ども分を取り分ける、など"
          className="rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 outline-none focus:border-rose-300 dark:bg-white/5"
        />
      </div>

      <button
        type="submit"
        className="mt-2 rounded-full bg-rose-400 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-rose-500"
      >
        保存
      </button>
    </form>
  );
}
