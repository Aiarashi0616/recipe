export const CATEGORIES = [
  "主菜",
  "副菜",
  "主食",
  "汁物・スープ",
  "デザート・おやつ",
  "作り置き（冷凍）",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<Category, { bg: string; fg: string }> = {
  主菜: { bg: "#e6d6d1", fg: "#8c5c52" },
  副菜: { bg: "#dde1d0", fg: "#66754e" },
  主食: { bg: "#e8ddc4", fg: "#8a7240" },
  "汁物・スープ": { bg: "#d6dfe2", fg: "#536f79" },
  "デザート・おやつ": { bg: "#e3d5de", fg: "#7c5470" },
  "作り置き（冷凍）": { bg: "#d4e0dc", fg: "#4d7a70" },
};
