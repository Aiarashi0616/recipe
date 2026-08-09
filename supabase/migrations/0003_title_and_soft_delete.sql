-- 既にmigrations/0002を実行済みのプロジェクトに対する追加分。
-- Supabaseの SQL Editor でこのファイルの内容をそのまま実行してください。

-- 料理名（任意項目）
alter table recipes add column title text;

-- 論理削除用（物理DELETEは使わない方針のため）
alter table recipes add column deleted_at timestamptz;

-- 編集・論理削除にはUPDATEが必要なため、recipesにupdateポリシーを追加
create policy "public update recipes" on recipes for update using (true) with check (true);
