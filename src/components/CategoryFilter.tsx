import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

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
            ? "bg-rose-400 text-white"
            : "bg-white/70 text-foreground/70 hover:bg-rose-50 dark:bg-white/5"
        }`}
      >
        すべて
      </Link>
      {CATEGORIES.map((category) => (
        <Link
          key={category}
          href={`/?category=${encodeURIComponent(category)}${tagQuery}`}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
            activeCategory === category
              ? "bg-rose-400 text-white"
              : "bg-white/70 text-foreground/70 hover:bg-rose-50 dark:bg-white/5"
          }`}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}
