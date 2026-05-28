# Oshica 技術スタック方針

このドキュメントは、Oshica プロジェクトで**採用する技術**と**採用しない技術**を定めます。  
実装・レビュー・AI 支援のいずれも、ここに従ってください。

---

## 採用（統一スタック）

| 技術 | 役割 |
|------|------|
| **Next.js 15**（App Router） | ルーティング・SSR・Server Actions |
| **Supabase** | DB（PostgreSQL）・認証・RLS・マイグレーションの**中心** |
| **Tailwind CSS v4** | スタイリング |
| **shadcn/ui** | UI コンポーネント（`components/ui/` に配置） |
| **Zod** | 入力バリデーション（`lib/validations/`） |
| **react-hook-form** | フォーム状態管理（`@hookform/resolvers` で Zod 連携） |

### DB 管理の原則（Supabase 中心）

- スキーマ変更は **`supabase/migrations/*.sql`** のみで行う
- 型は **`npm run db:types`** で `lib/supabase/database.types.ts` を再生成する
- データアクセスは **`server/repositories/`** 経由の Supabase クライアントを使う
- **Prisma は使用しない**（ORM レイヤーは持たない）

### データの流れ（初心者向け）

```
画面 (app/ + features/)
    ↓ フォーム送信
Server Actions (server/actions/)
    ↓ Zod で検証
Services (server/services/)  ※複数テーブルが必要なときだけ
    ↓
Repositories (server/repositories/)  ※Supabase への読み書き
    ↓
Supabase PostgreSQL（RLS でユーザーごとに分離）
```

---

## 非採用

| 技術 | 理由 |
|------|------|
| **Prisma** | Supabase と二重管理になり、初心者の学習コストが増える |
| **Redux** | Server Components + URL 状態で足りる |
| **独立バックエンド**（Express / NestJS 等） | Next.js + Supabase で MVP を完結できる |

---

## ディレクトリ責務（既存構成を維持）

| パス | 責務 |
|------|------|
| `app/` | ルーティングのみ。ロジックは薄く保つ |
| `features/` | ドメイン別の UI（推し・予約・イベント等） |
| `components/ui/` | shadcn/ui 由来の汎用部品 |
| `components/layout/` | AppShell 等のレイアウト |
| `lib/supabase/` | クライアント・サーバー・生成型 |
| `lib/validations/` | Zod スキーマ |
| `server/actions/` | Server Actions（フォームの入口） |
| `server/repositories/` | Supabase CRUD |
| `server/services/` | 複数リポジトリをまたぐ業務処理 |
| `supabase/migrations/` | DB スキーマの唯一の正 |

**既存のフォルダ名・役割を変えない。** 新機能は上記のどこに置くかを先に決めてから実装する。

---

## 実装ルール（全員・AI 共通）

1. **既存構成を壊さない** — ルートグループ `(marketing)` / `(auth)` / `(app)` を維持する
2. **初心者でも理解できる** — 1 ファイル 1 責務、短い関数、深いネストを避ける
3. **ファイル単位で出力** — 変更は必要なファイルだけ。無関係なリファクタをしない
4. **日本語コメント** — 非自明な業務ルール・Supabase の注意点に日本語コメントを付ける
5. **UI** — 新規部品は可能な限り `components/ui/` を使い、足りなければ shadcn 形式で追加する
6. **フォーム** — `react-hook-form` + `zodResolver` + `lib/validations/` のスキーマを共有する

---

## shadcn/ui の追加方法

既存の `components/ui/` に合わせて CLI で追加する場合:

```bash
npx shadcn@latest add <component-name>
```

設定はリポジトリ直下の `components.json` を参照してください。

---

## 関連ドキュメント

- [DATABASE.md](./DATABASE.md) — テーブル設計・RLS
- [README.md](../README.md) — セットアップ手順
