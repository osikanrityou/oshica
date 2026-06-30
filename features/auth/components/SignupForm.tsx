"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { Alert } from "@/components/ui/alert";
import { ROUTES } from "@/lib/constants/routes";
import {
  signupSchema,
  type SignupFormValues,
} from "@/lib/validations/auth";
import { signUpWithPasswordAction } from "@/server/actions/auth-actions";

/**
 * 新規登録フォーム（クライアント検証 + Server Action 送信）
 */
export function SignupForm() {
  const [state, formAction, pending] = useActionState(
    signUpWithPasswordAction,
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", displayName: "" },
  });

  useEffect(() => {
    if (state && !state.success) {
      setError("root", { message: state.error });
    }

    if (state?.success && state.message) {
      reset();
    }
  }, [state, setError, reset]);

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    formData.set("email", values.email);
    formData.set("password", values.password);

    if (values.displayName) {
      formData.set("displayName", values.displayName);
    }

    formAction(formData);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {state?.success && state.message ? (
        <div className="rounded-2xl border border-oshica-border bg-oshica-bg px-4 py-3 text-sm font-bold text-oshica-text">
          {state.message}{" "}
          <Link href={ROUTES.login} className="text-oshica-secondary underline">
            ログインへ
          </Link>
        </div>
      ) : null}

      <label className="block">
        <span className="text-sm font-bold text-oshica-text">
          表示名（任意）
        </span>
        <input
          type="text"
          autoComplete="name"
          placeholder="推し活太郎"
          {...register("displayName")}
          className="mt-2 w-full rounded-2xl border border-oshica-border bg-white px-4 py-3 text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
        />
        {errors.displayName ? (
          <p className="mt-1 text-xs font-bold text-red-500">
            {errors.displayName.message}
          </p>
        ) : null}
      </label>

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
          autoComplete="new-password"
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
        {pending ? "登録中…" : "無料ではじめる"}
      </button>
    </form>
  );
}