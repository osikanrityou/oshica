"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  // Server Action のエラーをフォームに反映
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
          autoComplete="current-password"
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
        {pending ? "ログイン中…" : "ログイン"}
      </Button>
    </form>
  );
}
