"use client";

import { softDeleteRecipe } from "@/app/actions/recipes";

export function DeleteRecipeButton({ id }: { id: string }) {
  const action = softDeleteRecipe.bind(null, id);

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("このレシピを削除しますか？")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-foreground/60 transition hover:border-red-300 hover:text-red-500"
      >
        削除
      </button>
    </form>
  );
}
