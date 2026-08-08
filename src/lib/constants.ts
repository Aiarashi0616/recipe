export const CATEGORIES = [
  "主菜",
  "副菜",
  "主食",
  "汁物・スープ",
  "デザート・おやつ",
  "作り置き（冷凍）",
] as const;

export type Category = (typeof CATEGORIES)[number];
