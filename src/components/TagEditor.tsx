"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { addTagToRecipe, removeTagFromRecipe } from "@/app/actions/recipes";

export function TagEditor({ recipeId, tags }: { recipeId: string; tags: string[] }) {
  const [pending, startTransition] = useTransition();
  const [newTag, setNewTag] = useState("");

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-full bg-tag-bg pl-2.5 pr-1 py-1 text-xs text-tag-fg"
        >
          <Link href={`/?q=${encodeURIComponent(tag)}`} className="hover:underline">
            #{tag}
          </Link>
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => removeTagFromRecipe(recipeId, tag))}
            aria-label={`${tag}を削除`}
            className="rounded-full px-1 text-tag-fg/50 transition hover:text-red-500 disabled:opacity-50"
          >
            ×
          </button>
        </span>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const value = newTag.trim();
          if (!value) return;
          startTransition(() => addTagToRecipe(recipeId, value));
          setNewTag("");
        }}
        className="flex items-center"
      >
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="+ タグを追加"
          disabled={pending}
          className="w-28 rounded-full border border-black/10 bg-white/80 px-2.5 py-1 text-xs outline-none placeholder:text-foreground/40 focus:border-accent dark:bg-white/5"
        />
      </form>
    </div>
  );
}
