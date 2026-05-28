/**
 * リポジトリ共通の型・ヘルパー
 *
 * DB アクセスは Supabase クライアントのみを使う（Prisma は使わない）。
 * 各ドメインの CRUD はこのディレクトリ配下の *-repository.ts に集約する。
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

/** サーバー側 Supabase クライアント（database.types と連携） */
export type SupabaseServerClient = SupabaseClient<Database>;

/** 未ログイン時はエラーにする（RLS 前のガード） */
export function getUserIdOrThrow(userId: string | undefined): string {
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}
