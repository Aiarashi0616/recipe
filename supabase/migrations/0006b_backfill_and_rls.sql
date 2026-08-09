-- ログイン機能の導入 2/2。
-- 0006a を実行し、アプリで一度サインアップ（新規登録）を済ませてから実行してください。
-- （このアプリは自分だけの1アカウント運用のため、既存レシピは
--   「最初に登録された1人のユーザー」に自動的に紐づけます）

-- 1. 既存レシピ・タグを、サインアップ済みの唯一のユーザーに紐づける
update recipes set user_id = (select id from auth.users order by created_at asc limit 1)
where user_id is null;

update tags set user_id = (select id from auth.users order by created_at asc limit 1)
where user_id is null;

-- 2. 以後は必須項目にし、未指定時はログイン中ユーザーを自動セットする
alter table recipes alter column user_id set not null;
alter table recipes alter column user_id set default auth.uid();

alter table tags alter column user_id set not null;
alter table tags alter column user_id set default auth.uid();

-- 3. タグ名の一意制約を「ユーザーごとに一意」に変更
alter table tags drop constraint if exists tags_name_key;
alter table tags add constraint tags_user_id_name_key unique (user_id, name);

-- 4. 家族プロフィール・我が家のルール
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

alter table family_members enable row level security;
alter table household_rules enable row level security;

create policy "owner select family_members" on family_members for select using (auth.uid() = user_id);
create policy "owner insert family_members" on family_members for insert with check (auth.uid() = user_id);
create policy "owner update family_members" on family_members for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "owner select household_rules" on household_rules for select using (auth.uid() = user_id);
create policy "owner insert household_rules" on household_rules for insert with check (auth.uid() = user_id);
create policy "owner update household_rules" on household_rules for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 5. 既存テーブルのRLSを「匿名キーなら誰でも」から「本人のデータのみ」に全面的に書き換える

drop policy if exists "public read recipes" on recipes;
drop policy if exists "public insert recipes" on recipes;
drop policy if exists "public update recipes" on recipes;
create policy "owner select recipes" on recipes for select using (auth.uid() = user_id);
create policy "owner insert recipes" on recipes for insert with check (auth.uid() = user_id);
create policy "owner update recipes" on recipes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "public read tags" on tags;
drop policy if exists "public insert tags" on tags;
create policy "owner select tags" on tags for select using (auth.uid() = user_id);
create policy "owner insert tags" on tags for insert with check (auth.uid() = user_id);

drop policy if exists "public read recipe_tags" on recipe_tags;
drop policy if exists "public insert recipe_tags" on recipe_tags;
drop policy if exists "public update recipe_tags" on recipe_tags;
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
drop policy if exists "public read fetch_failures" on fetch_failures;
drop policy if exists "public insert fetch_failures" on fetch_failures;
drop policy if exists "public update fetch_failures" on fetch_failures;
create policy "authenticated select fetch_failures" on fetch_failures for select using (auth.role() = 'authenticated');
create policy "authenticated insert fetch_failures" on fetch_failures for insert with check (auth.role() = 'authenticated');
create policy "authenticated update fetch_failures" on fetch_failures for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
