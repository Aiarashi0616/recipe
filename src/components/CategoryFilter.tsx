import Link from "next/link";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";

export function CategoryFilter({
  activeCategory,
  activeTag,
}: {
  activeCategory?: string;
  activeTag?: string;
}) {
  const tagQuery = activeTag ? `&tag=${encodeURIComponent(activeTag)}` : "";

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/${activeTag ? `?tag=${encodeURIComponent(activeTag)}` : ""}`}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
          !activeCategory
            ? "bg-accent text-white"
            : "bg-white/70 text-foreground/70 hover:bg-accent-soft dark:bg-white/5"
        }`}
      >
        すべて
      </Link>
      {CATEGORIES.map((category) => {
        const { bg, fg } = CATEGORY_COLORS[category];
        const isActive = activeCategory === category;
        return (
          <Link
            key={category}
            href={`/?category=${encodeURIComponent(category)}${tagQuery}`}
            className="rounded-full px-3 py-1.5 text-sm font-medium transition hover:opacity-80"
            style={
              isActive
                ? { backgroundColor: fg, color: "#ffffff" }
                : { backgroundColor: bg, color: fg }
            }
          >
            {category}
          </Link>
        );
      })}
    </div>
  );
}
