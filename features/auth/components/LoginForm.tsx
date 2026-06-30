"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { Alert } from "@/components/ui/alert";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validations/auth";
import { signInWithPasswordAction } from "@/server/actions/auth-actions";

/**
 * ログインフォーム（クライアント検証 + Server Action 送信）
 */
export function LoginForm() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "";
  const callbackError = searchParams.get("error") === "auth_callback";

  const [state, formAction, pending] = useActionState(
    signInWithPasswordAction,
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (state && !state.success) {
      setError("root", { message: state.error });
    }
  }, [state, setError]);

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    formData.set("email", values.email);
    formData.set("password", values.password);

    if (nextPath) {
      formData.set("next", nextPath);
    }

    formAction(formData);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
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
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
          className="mt-2 w-full rounded-2xl border border-oshica-border bg-white px-4 py-3 text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
        />
        {errors.email ? (
          <p className="mt-1 text-xs font-bold text-red-500">
            {errors.email.message}
          </p>
        ) : null}
      </label>

      <label className="block">
        <span className="text-sm font-bold text-oshica-text">パスワード</span>
        <input
          type="password"
          autoComplete="current-password"
          placeholder="8文字以上"
          {...register("password")}
          className="mt-2 w-full rounded-2xl border border-oshica-border bg-white px-4 py-3 text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
        />
        {errors.password ? (
          <p className="mt-1 text-xs font-bold text-red-500">
            {errors.password.message}
          </p>
        ) : null}
      </label>

      {errors.root ? (
        <Alert variant="destructive">{errors.root.message}</Alert>
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