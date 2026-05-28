"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        <Alert variant="success">
          {state.message}{" "}
          <Link href={ROUTES.login} className="font-medium underline">
            ログインへ
          </Link>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="displayName">表示名（任意）</Label>
        <Input
          id="displayName"
          type="text"
          autoComplete="name"
          placeholder="推し活太郎"
          {...register("displayName")}
        />
        {errors.displayName ? (
          <p className="text-xs text-red-500">{errors.displayName.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">メールアドレス</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">パスワード</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="8文字以上"
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        ) : null}
      </div>

      {errors.root ? (
        <Alert variant="destructive">{errors.root.message}</Alert>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "登録中…" : "アカウント作成"}
      </Button>
    </form>
  );
}
