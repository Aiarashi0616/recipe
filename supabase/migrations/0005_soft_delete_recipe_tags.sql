-- 既にmigrations/0004を実行済みのプロジェクトに対する追加分。
-- Supabaseの SQL Editor でこのファイルの内容をそのまま実行してください。

-- レシピからタグを外す操作を論理削除（removed_atのUPDATE）で行うためのカラム
alter table recipe_tags add column removed_at timestamptz;

-- タグの付け外し（removed_atの更新）にはUPDATEが必要
create policy "public update recipe_tags" on recipe_tags for update using (true) with check (true);
