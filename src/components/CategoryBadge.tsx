import { CATEGORY_COLORS, type Category } from "@/lib/constants";

export function CategoryBadge({
  category,
  size = "md",
}: {
  category: Category;
  size?: "md" | "lg";
}) {
  const { bg, fg } = CATEGORY_COLORS[category];
  const sizeClass = size === "lg" ? "px-4 py-1.5 text-sm" : "px-3 py-1 text-xs";
  return (
    <span
      className={`inline-block rounded-full font-semibold ${sizeClass}`}
      style={{ backgroundColor: bg, color: fg }}
    >
      {category}
    </span>
  );
}
