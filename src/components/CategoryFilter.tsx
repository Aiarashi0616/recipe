import Link from "next/link";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";

export function CategoryFilter({
  activeCategory,
  activeQuery,
}: {
  activeCategory?: string;
  activeQuery?: string;
}) {
  const qQuery = activeQuery ? `&q=${encodeURIComponent(activeQuery)}` : "";

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/${activeQuery ? `?q=${encodeURIComponent(activeQuery)}` : ""}`}
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
            href={`/?category=${encodeURIComponent(category)}${qQuery}`}
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
