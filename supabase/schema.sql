-- レシピ検索アプリ スキーマ（新規セットアップ用）
-- Supabaseプロジェクトの SQL Editor でこのファイルの内容をそのまま実行してください。
-- 既存プロジェクトを段階的に更新する場合は supabase/migrations/ 以下を順番に実行してください。

-- 1. カテゴリ enum（CLAUDE.md の6分類と一致させること）
create type recipe_category as enum (
  '主菜',
  '副菜',
  '主食',
  '汁物・スープ',
  'デザート・おやつ',
  '作り置き（冷凍）'
);

-- 2. レシピ本体（ログインユーザー1人につき自分のレシピのみ扱う）
create table recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id),
  title text,
  source_url text not null,
  category recipe_category not null,
  ingredients text,
  steps text,
  note text,
  baby_food_note text,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- 3. タグ（材料タグをはじめとする再利用可能なタグ、ユーザーごとに一意）
create table tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id),
  name text not null,
  unique (user_id, name)
);

-- 4. レシピとタグの中間テーブル（多対多）
create table recipe_tags (
  recipe_id uuid not null references recipes(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  removed_at timestamptz,
  primary key (recipe_id, tag_id)
);

-- 5. Webサイトからの自動取得が、ドメインごとに何回連続で失敗しているかを記録する
create table fetch_failures (
  domain text primary key,
  consecutive_failures integer not null default 0,
  last_failed_at timestamptz,
  last_error text
);

-- 6. 家族プロフィール・我が家のルール
create type family_person_type as enum ('大人', '子ども');
create type family_meal_stage as enum ('大人', '離乳初期', '離乳中期', '離乳後期', '離乳完了期', '幼児');
create type family_portion_size as enum ('普通', '少なめ', '多め');
create type family_taste_preference as enum ('薄味', '普通', '濃いめ');

create table family_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id),
  display_name text not null,
  age_label text,
  person_type family_person_type not null,
  meal_stage family_meal_stage not null default '大人',
  portion_size family_portion_size not null default '普通',
  disliked_foods text,
  liked_foods text,
  allergies text,
  taste_preference family_taste_preference not null default '普通',
  dietary_restriction text,
  created_at timestamptz not null default now(),
  removed_at timestamptz
);

create table household_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id),
  rule_text text not null,
  created_at timestamptz not null default now(),
  removed_at timestamptz
);

-- 検索・絞り込み用インデックス
create index idx_recipes_category on recipes(category);
create index idx_recipes_user_id on recipes(user_id);
create index idx_recipe_tags_tag_id on recipe_tags(tag_id);
create index idx_recipe_tags_recipe_id on recipe_tags(recipe_id);
create index idx_tags_name on tags(name);
create index idx_family_members_user_id on family_members(user_id);
create index idx_household_rules_user_id on household_rules(user_id);

-- Row Level Security
-- ログイン中の本人のデータのみ読み書きできる。delete のポリシーはどのテーブルにも
-- 意図的に作成しない（論理削除＝removed_at/deleted_atのUPDATEで対応）。
alter table recipes enable row level security;
alter table tags enable row level security;
alter table recipe_tags enable row level security;
alter table fetch_failures enable row level security;
alter table family_members enable row level security;
alter table household_rules enable row level security;

create policy "owner select recipes" on recipes for select using (auth.uid() = user_id);
create policy "owner insert recipes" on recipes for insert with check (auth.uid() = user_id);
create policy "owner update recipes" on recipes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "owner select tags" on tags for select using (auth.uid() = user_id);
create policy "owner insert tags" on tags for insert with check (auth.uid() = user_id);

create policy "owner select recipe_tags" on recipe_tags for select using (
  exists (select 1 from recipes r where r.id = recipe_tags.recipe_id and r.user_id = auth.uid())
);
create policy "owner insert recipe_tags" on recipe_tags for insert with check (
  exists (select 1 from recipes r where r.id = recipe_tags.recipe_id and r.user_id = auth.uid())
);
create policy "owner update recipe_tags" on recipe_tags for update using (
  exists (select 1 from recipes r where r.id = recipe_tags.recipe_id and r.user_id = auth.uid())
) with check (
  exists (select 1 from recipes r where r.id = recipe_tags.recipe_id and r.user_id = auth.uid())
);

-- fetch_failuresは個人情報ではないため、所有者スコープではなく「ログイン済みなら誰でも」に留める
create policy "authenticated select fetch_failures" on fetch_failures for select using (auth.role() = 'authenticated');
create policy "authenticated insert fetch_failures" on fetch_failures for insert with check (auth.role() = 'authenticated');
create policy "authenticated update fetch_failures" on fetch_failures for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "owner select family_members" on family_members for select using (auth.uid() = user_id);
create policy "owner insert family_members" on family_members for insert with check (auth.uid() = user_id);
create policy "owner update family_members" on family_members for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "owner select household_rules" on household_rules for select using (auth.uid() = user_id);
create policy "owner insert household_rules" on household_rules for insert with check (auth.uid() = user_id);
create policy "owner update household_rules" on household_rules for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
