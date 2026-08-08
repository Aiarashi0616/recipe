import type { Category } from "@/lib/constants";

const CATEGORY_STYLES: Record<Category, string> = {
  主菜: "bg-rose-100 text-rose-700",
  副菜: "bg-lime-100 text-lime-700",
  主食: "bg-amber-100 text-amber-700",
  "汁物・スープ": "bg-sky-100 text-sky-700",
  "デザート・おやつ": "bg-fuchsia-100 text-fuchsia-700",
  "作り置き（冷凍）": "bg-cyan-100 text-cyan-700",
};

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_STYLES[category]}`}
    >
      {category}
    </span>
  );
}
