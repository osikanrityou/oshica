# Oshica データベース設計

## 概要

- **DB 管理の中心**: Supabase（マイグレーション + CLI + 型生成）
- **ORM**: 使用しない（**Prisma は非採用**）。アプリからは `@supabase/supabase-js` と `server/repositories/` でアクセスする
- **DB**: PostgreSQL（Supabase ホスト）
- **認証**: Supabase Auth（`auth.users`）
- **マルチテナント**: 全業務テーブルに `user_id` + RLS

### スキーマ変更の手順

1. `supabase/migrations/` に SQL ファイルを追加する
2. `npx supabase db push`（または Dashboard）で適用する
3. `npm run db:types` で TypeScript 型を再生成する
4. `server/repositories/` と `lib/validations/` を必要に応じて更新する

## ER（主要）

```
auth.users ── profiles (1:1)
auth.users ── oshis (1:N)
auth.users ── reservations (1:N)
auth.users ── event_applications (1:N)
auth.users ── lottery_results (1:N)
auth.users ── expenses (1:N)
auth.users ── reminders (1:N)
auth.users ── subscriptions (1:1, Stripe用)

oshis ── reservations / event_applications / expenses (optional FK)
lottery_results ── expenses (optional FK via linked_lottery_result_id)
```

## テーブル一覧

| テーブル | 用途 |
|----------|------|
| `profiles` | 表示名・タイムゾーン・通貨・プラン |
| `oshis` | 推し・作品マスタ |
| `reservations` | グッズ・カフェ等の予約 |
| `event_applications` | イベント応募 |
| `lottery_results` | 当落（polymorphic: source_type + source_id） |
| `expenses` | 支出 |
| `reminders` | リマインダー |
| `subscriptions` | Stripe 課金（将来） |

## ビュー

- `upcoming_deadlines`: 7日以内の締切・発表予定（予約 + 応募）

## マイグレーション適用

```bash
# CLI インストール後
supabase login
supabase link --project-ref <your-ref>
supabase db push

# 型生成
npm run db:types
```

## 注意

- `lottery_results.source_id` は `source_type` に応じて `reservations` または `event_applications` を参照（アプリ層で整合性を担保）
- 本番前に `profiles` の insert ポリシーが不要か確認（signup トリガーのみで作成）
