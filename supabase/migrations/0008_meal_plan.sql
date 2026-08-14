-- 既にmigrations/0007を実行済みのプロジェクトに対する追加分。
-- Supabaseの SQL Editor でこのファイルの内容をそのまま実行してください。

create type meal_type as enum ('朝食', '昼食', '夕食');

create table meal_plan_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id),
  entry_date date not null,
  meal_type meal_type not null,
  recipe_id uuid not null references recipes(id),
  note text,
  created_at timestamptz not null default now(),
  removed_at timestamptz
);

create index idx_meal_plan_entries_user_date on meal_plan_entries(user_id, entry_date);

alter table meal_plan_entries enable row level security;

create policy "owner select meal_plan_entries" on meal_plan_entries for select using (auth.uid() = user_id);
create policy "owner insert meal_plan_entries" on meal_plan_entries for insert with check (auth.uid() = user_id);
create policy "owner update meal_plan_entries" on meal_plan_entries for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
