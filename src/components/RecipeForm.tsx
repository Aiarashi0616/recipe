import { createRecipe } from "@/app/actions/recipes";
import { CATEGORIES } from "@/lib/constants";

export function RecipeForm() {
  return (
    <form action={createRecipe} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-semibold">
          料理名
        </label>
        <input
          id="title"
          name="title"
          type="text"
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
          placeholder="https://cookpad.com/..."
          className="rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 outline-none focus:border-accent dark:bg-white/5"
        />
        <p className="text-xs text-foreground/50">
          Webサイトの場合は保存時に材料・作り方の自動取得を試みます（対応していないサイトは空欄のまま保存されるので、その場合は下に直接入力してください）。Instagramは自動取得非対応のため、材料・作り方は直接入力してください。
        </p>
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
          className="rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 outline-none focus:border-accent dark:bg-white/5"
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
          className="rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 outline-none focus:border-accent dark:bg-white/5"
        />
        <p className="text-xs text-foreground/50">カンマまたはスペース区切りで複数入力できます</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ingredients" className="text-sm font-semibold">
          材料
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          rows={4}
          placeholder={"鶏もも肉 300g\n玉ねぎ 1個\n..."}
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
          placeholder={"1. 鶏肉を一口大に切る\n2. 玉ねぎをスライスする\n..."}
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
          placeholder="大人の味付け前に子ども分を取り分ける、など"
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
          placeholder="離乳食後期はレシピ通りで大人と同じでOK、など"
          className="rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 outline-none focus:border-accent dark:bg-white/5"
        />
        <p className="text-xs text-foreground/50">
          空欄のまま保存して、後からClaude Codeに下書きをお願いすることもできます
        </p>
      </div>

      <button
        type="submit"
        className="mt-2 rounded-full bg-accent px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-accent-hover"
      >
        保存
      </button>
    </form>
  );
}
