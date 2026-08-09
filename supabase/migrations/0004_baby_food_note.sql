-- 既にmigrations/0003を実行済みのプロジェクトに対する追加分。
-- Supabaseの SQL Editor でこのファイルの内容をそのまま実行してください。

-- 離乳食アレンジのメモ（任意項目、自由記述）
alter table recipes add column baby_food_note text;
