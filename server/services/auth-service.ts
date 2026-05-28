import { createClient } from "@/lib/supabase/server";
import type { LoginFormValues, SignupFormValues } from "@/lib/validations/auth";

/**
 * 認証に関する Supabase 操作を集約するサービス層
 * Server Actions から呼び出し、DB クライアントの使い方を一箇所にまとめる
 */
export async function signInWithPassword(values: LoginFormValues) {
  const supabase = await createClient();
  return supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });
}

export async function signUpWithPassword(values: SignupFormValues) {
  const supabase = await createClient();

  return supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        display_name: values.displayName?.trim() || undefined,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
    },
  });
}

export async function signOutUser() {
  const supabase = await createClient();
  return supabase.auth.signOut();
}
