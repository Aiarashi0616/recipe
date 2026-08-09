-- ログイン機能の導入 1/2。
-- 先にこちらを実行し、次に一度アプリでサインアップ（新規登録）を完了させてから、
-- 0006b_backfill_and_rls.sql を実行してください。
--
-- ここでは「user_idカラムを追加するだけ」（NULL許容）に留める。
-- まだ誰もサインアップしていない状態でNOT NULL制約やRLSを先に入れてしまうと、
-- 既存レシピに紐づけるユーザーが存在せず詰んでしまうため。

alter table recipes add column user_id uuid references auth.users(id);
alter table tags add column user_id uuid references auth.users(id);
