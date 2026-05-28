# Oshica

推し活向け予約管理 Web アプリ。グッズ予約・イベント応募・当落・支出を一元管理します。

## 技術スタック

**採用（この構成で統一）**

- Next.js 15（App Router）
- Supabase（Auth + PostgreSQL + RLS + マイグレーション）— **DB 管理の中心**
- Tailwind CSS v4
- shadcn/ui（`components/ui/`）
- Zod + react-hook-form
- TypeScript / モバイルファースト

**非採用**: Prisma / Redux / 独立バックエンド

詳細は [docs/STACK.md](docs/STACK.md) を参照してください。

## はじめ方

### 1. 依存関係のインストール

```bash
cd C:\Users\User\Projects\oshica
npm install
```

### 2. 環境変数

```bash
cp .env.example .env.local
```

`.env.local` に Supabase の URL と anon key を設定します。開発中は `SKIP_ENV_VALIDATION=true` でも起動できます。

### 3. Supabase

```bash
npx supabase start          # ローカル（Docker 要）
npx supabase db push        # マイグレーション適用
npm run db:types            # TypeScript 型を再生成
```

クラウドの場合は [Supabase Dashboard](https://supabase.com/dashboard) でプロジェクトを作成し、SQL Editor で `supabase/migrations/20240523000000_initial_schema.sql` を実行するか `supabase link` 後に `db push` してください。

### 4. 開発サーバー

```bash
npm run dev
```

http://localhost:3000

## プロジェクト構成

```
app/           # ルーティング（marketing / auth / app）
features/      # ドメイン別 UI
components/    # ui / layout / shared
lib/           # supabase, validations, constants
server/        # actions, repositories, services
supabase/      # migrations, seed
```

- [docs/STACK.md](docs/STACK.md) — 技術方針・実装ルール
- [docs/DATABASE.md](docs/DATABASE.md) — DB 設計

## スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー |
| `npm run build` | 本番ビルド |
| `npm run typecheck` | 型チェック |
| `npm run db:types` | Supabase 型生成 |

## ロードマップ

- **Phase 1**: CRUD フォーム、Server Actions 完成
- **Phase 2**: レポート、CSV エクスポート
- **Phase 3**: Stripe、PWA
- **Phase 4**: ネイティブアプリ（Expo）
