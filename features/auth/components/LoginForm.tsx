"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import { Alert } from "@/components/ui/alert";
import { signInWithPasswordAction } from "@/server/actions/auth-actions";

/**
 * ログインフォーム
 */
export function LoginForm() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "";
  const callbackError = searchParams.get("error") === "auth_callback";

  const [state, formAction, pending] = useActionState(
    signInWithPasswordAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}

      {callbackError ? (
        <Alert variant="destructive">
          認証に失敗しました。もう一度ログインしてください。
        </Alert>
      ) : null}

      <label className="block">
        <span className="text-sm font-bold text-oshica-text">
          メールアドレス
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="mt-2 w-full rounded-2xl border border-oshica-border bg-white px-4 py-3 text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
        />
      </label>

      <label className="block">
        <span className="text-sm font-bold text-oshica-text">パスワード</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="8文字以上"
          className="mt-2 w-full rounded-2xl border border-oshica-border bg-white px-4 py-3 text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
        />
      </label>

      {state && !state.success ? (
        <Alert variant="destructive">{state.error}</Alert>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-full rounded-full bg-oshica-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition active:scale-95 disabled:opacity-50"
      >
        {pending ? "ログイン中…" : "ログイン"}
      </button>
    </form>
  );
}