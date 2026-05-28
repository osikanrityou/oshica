<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Oshica プロジェクトルール（エージェント向け）

## 技術スタック（厳守）

**採用**: Next.js / Supabase / Tailwind CSS / shadcn/ui / Zod / react-hook-form

**非採用**: Prisma / Redux / 独立バックエンド

DB は **Supabase を中心**とする。スキーマは `supabase/migrations/`、型は `npm run db:types`、アクセスは `server/repositories/`。

詳細: `docs/STACK.md`

## 実装時の必須事項

1. **既存構成を壊さない** — `app/(marketing)|(auth)|(app)`、`features/`、`server/actions|repositories|services` の役割を維持する
2. **初心者でも理解できる** — 1 ファイル 1 責務、過度な抽象化をしない
3. **ファイル単位で出力** — タスクに必要なファイルだけ変更する
4. **日本語コメント** — 業務ルール・Supabase/RLS の注意点など、非自明な箇所に付ける
5. **UI** — `components/ui/`（shadcn/ui）を優先して使う
6. **フォーム** — `lib/validations/` の Zod スキーマ + `react-hook-form` + Server Actions

## 応答言語

ユーザー向けの説明・ドキュメント・コメントは **日本語** で行う。
