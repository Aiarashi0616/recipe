-- 既にmigrations/0006bを実行済みのプロジェクトに対する追加分。
-- Supabaseの SQL Editor でこのファイルの内容をそのまま実行してください。

-- レシピごとの調理時間（分、任意項目）
alter table recipes add column prep_minutes integer;

-- ユーザーごとの調理時間の目安（平日・土日）。将来ほかの「我が家のルール」の
-- 構造化設定を置く場所としても使う想定で、1ユーザー1行のテーブルにしている。
create table household_settings (
  user_id uuid primary key default auth.uid() references auth.users(id),
  weekday_time_limit_minutes integer,
  weekend_time_limit_minutes integer
);

alter table household_settings enable row level security;

create policy "owner select household_settings" on household_settings for select using (auth.uid() = user_id);
create policy "owner insert household_settings" on household_settings for insert with check (auth.uid() = user_id);
create policy "owner update household_settings" on household_settings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
