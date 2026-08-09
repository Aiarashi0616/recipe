-- レシピ検索アプリ v1 スキーマ
-- Supabaseプロジェクトの SQL Editor でこのファイルの内容をそのまま実行してください。

-- 1. カテゴリ enum（CLAUDE.md の6分類と一致させること）
create type recipe_category as enum (
  '主菜',
  '副菜',
  '主食',
  '汁物・スープ',
  'デザート・おやつ',
  '作り置き（冷凍）'
);

-- 2. レシピ本体
create table recipes (
  id uuid primary key default gen_random_uuid(),
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

-- 3. タグ（材料タグをはじめとする再利用可能なタグ）
create table tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

-- 4. レシピとタグの中間テーブル（多対多）
create table recipe_tags (
  recipe_id uuid not null references recipes(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (recipe_id, tag_id)
);

-- 5. Webサイトからの自動取得が、ドメインごとに何回連続で失敗しているかを記録する
create table fetch_failures (
  domain text primary key,
  consecutive_failures integer not null default 0,
  last_failed_at timestamptz,
  last_error text
);

-- 検索・絞り込み用インデックス
create index idx_recipes_category on recipes(category);
create index idx_recipe_tags_tag_id on recipe_tags(tag_id);
create index idx_recipe_tags_recipe_id on recipe_tags(recipe_id);
create index idx_tags_name on tags(name);

-- Row Level Security
-- 個人利用・認証なしのアプリのため anon キーで select / insert のみ許可する。
-- recipes は編集・論理削除（deleted_atの更新）のため update も許可する。
-- fetch_failures は失敗回数の更新のため update も許可する。
-- delete のポリシーはどのテーブルにも意図的に作成しない（論理削除で対応）。
alter table recipes enable row level security;
alter table tags enable row level security;
alter table recipe_tags enable row level security;
alter table fetch_failures enable row level security;

create policy "public read recipes" on recipes for select using (true);
create policy "public insert recipes" on recipes for insert with check (true);
create policy "public update recipes" on recipes for update using (true) with check (true);
create policy "public read tags" on tags for select using (true);
create policy "public insert tags" on tags for insert with check (true);
create policy "public read recipe_tags" on recipe_tags for select using (true);
create policy "public insert recipe_tags" on recipe_tags for insert with check (true);
create policy "public read fetch_failures" on fetch_failures for select using (true);
create policy "public insert fetch_failures" on fetch_failures for insert with check (true);
create policy "public update fetch_failures" on fetch_failures for update using (true) with check (true);
