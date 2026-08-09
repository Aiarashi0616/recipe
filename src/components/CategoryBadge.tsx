import { CATEGORY_COLORS, type Category } from "@/lib/constants";

export function CategoryBadge({ category }: { category: Category }) {
  const { bg, fg } = CATEGORY_COLORS[category];
  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
      style={{ backgroundColor: bg, color: fg }}
    >
      {category}
    </span>
  );
}
