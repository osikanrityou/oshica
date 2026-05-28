"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { toAuthErrorMessage } from "@/lib/auth/errors";
import { getSafeRedirectPath } from "@/lib/auth/redirect";
import { ROUTES } from "@/lib/constants/routes";
import { loginSchema, signupSchema } from "@/lib/validations/auth";
import {
  signInWithPassword,
  signOutUser,
  signUpWithPassword,
} from "@/server/services/auth-service";
import type { ActionResult } from "@/types";

/**
 * ログイン（Server Action）
 * 成功時は middleware と同様にダッシュボード、または ?next= で指定されたパスへ遷移
 */
export async function signInWithPasswordAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "入力内容を確認してください",
    };
  }

  const { error } = await signInWithPassword(parsed.data);

  if (error) {
    return { success: false, error: toAuthErrorMessage(error.message) };
  }

  const next = getSafeRedirectPath(formData.get("next")?.toString());
  revalidatePath("/", "layout");
  redirect(next);
}

/**
 * 新規登録（Server Action）
 * メール確認が有効なプロジェクトではセッションが作られず、確認メッセージを返す
 */
export async function signUpWithPasswordAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "入力内容を確認してください",
    };
  }

  const { data, error } = await signUpWithPassword(parsed.data);

  if (error) {
    return { success: false, error: toAuthErrorMessage(error.message) };
  }

  revalidatePath("/", "layout");

  // メール確認待ち（セッション未発行）
  if (!data.session) {
    return {
      success: true,
      message:
        "確認メールを送信しました。メール内のリンクを開くとログインできます。",
    };
  }

  redirect(ROUTES.dashboard);
}

/**
 * ログアウト（Server Action）
 */
export async function signOutAction(): Promise<void> {
  await signOutUser();
  revalidatePath("/", "layout");
  redirect(ROUTES.login);
}
