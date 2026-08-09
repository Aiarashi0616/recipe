# 分けっこみんなごはん

材料タグでレシピを検索できる、個人利用のレシピ管理アプリです。Next.js（App Router）+ Supabase で構築しています。

## セットアップ

1. 依存パッケージをインストール
   ```bash
   npm install
   ```
2. Supabaseプロジェクトを作成し、SQL Editorで `supabase/schema.sql` の内容を実行する
3. `.env.local.example` を `.env.local` にコピーし、SupabaseプロジェクトのURLとanonキーを設定する
   ```bash
   cp .env.local.example .env.local
   ```
4. 開発サーバーを起動
   ```bash
   npm run dev
   ```
   [http://localhost:3000](http://localhost:3000) で確認できます。

## 画面

- `/` : レシピ一覧・カテゴリ／材料タグでの検索
- `/recipes/new` : レシピ登録
- `/recipes/[id]` : レシピ詳細

## データ設計

`supabase/schema.sql` を参照してください。カテゴリは `CLAUDE.md` に定義された6種類（主菜・副菜・主食・汁物スープ・デザートおやつ・作り置き冷凍）に固定しています。
