import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { ROUTES } from "@/lib/constants/routes";

import { createClient } from "./server";

/**
 * サーバー側で現在のユーザーを取得する（セッション維持の確認用）
 *
 * Supabase 公式推奨: サーバーでは getSession() ではなく getUser() を使う
 * （JWT を検証したうえでユーザー情報を返す）
 */
export async function getAuthUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/**
 * ログイン必須のページで呼ぶ。未ログインならログイン画面へ飛ばす
 */
export async function requireAuthUser(): Promise<User> {
  const user = await getAuthUser();

  if (!user) {
    redirect(ROUTES.login);
  }

  return user;
}
