-- 既にsupabase/schema.sqlを実行済みのプロジェクトに対する追加分。
-- Supabaseの SQL Editor でこのファイルの内容をそのまま実行してください。

-- レシピ本文（材料・作り方）を自由記述で保存できるようにする
alter table recipes add column ingredients text;
alter table recipes add column steps text;

-- Webサイトからの自動取得が、ドメインごとに何回連続で失敗しているかを記録する
create table fetch_failures (
  domain text primary key,
  consecutive_failures integer not null default 0,
  last_failed_at timestamptz,
  last_error text
);

alter table fetch_failures enable row level security;

create policy "public read fetch_failures" on fetch_failures for select using (true);
create policy "public insert fetch_failures" on fetch_failures for insert with check (true);
create policy "public update fetch_failures" on fetch_failures for update using (true) with check (true);
