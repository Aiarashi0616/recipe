export function TagFilter({
  activeCategory,
  activeTag,
}: {
  activeCategory?: string;
  activeTag?: string;
}) {
  return (
    <form method="get" className="flex gap-2">
      {activeCategory && (
        <input type="hidden" name="category" value={activeCategory} />
      )}
      <input
        type="text"
        name="tag"
        defaultValue={activeTag ?? ""}
        placeholder="材料タグで検索（例：鶏肉）"
        className="w-full rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm outline-none placeholder:text-foreground/40 focus:border-accent dark:bg-white/5"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
      >
        検索
      </button>
    </form>
  );
}
