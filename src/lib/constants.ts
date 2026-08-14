export const CATEGORIES = [
  "主菜",
  "副菜",
  "主食",
  "汁物・スープ",
  "デザート・おやつ",
  "作り置き（冷凍）",
] as const;

export type Category = (typeof CATEGORIES)[number];

// 献立の組み合わせ提案で対象にするカテゴリ（一汁三菜の考え方に合わせ、
// 日々の主食の付け合わせとして必須ではないデザート・作り置きは除外）
export const MEAL_COMPANION_CATEGORIES: Category[] = ["主菜", "副菜", "汁物・スープ"];

export const CATEGORY_COLORS: Record<Category, { bg: string; fg: string }> = {
  主菜: { bg: "#e6d6d1", fg: "#8c5c52" },
  副菜: { bg: "#dde1d0", fg: "#66754e" },
  主食: { bg: "#e8ddc4", fg: "#8a7240" },
  "汁物・スープ": { bg: "#d6dfe2", fg: "#536f79" },
  "デザート・おやつ": { bg: "#e3d5de", fg: "#7c5470" },
  "作り置き（冷凍）": { bg: "#d4e0dc", fg: "#4d7a70" },
};

export const PERSON_TYPES = ["大人", "子ども"] as const;
export type PersonType = (typeof PERSON_TYPES)[number];

export const MEAL_STAGES = [
  "大人",
  "離乳初期",
  "離乳中期",
  "離乳後期",
  "離乳完了期",
  "幼児",
] as const;
export type MealStage = (typeof MEAL_STAGES)[number];

export const PORTION_SIZES = ["普通", "少なめ", "多め"] as const;
export type PortionSize = (typeof PORTION_SIZES)[number];

export const TASTE_PREFERENCES = ["薄味", "普通", "濃いめ"] as const;
export type TastePreference = (typeof TASTE_PREFERENCES)[number];

export const MEAL_TYPES = ["朝食", "昼食", "夕食"] as const;
export type MealType = (typeof MEAL_TYPES)[number];
