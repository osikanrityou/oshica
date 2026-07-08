import Link from "next/link";
import { Suspense } from "react";

import { AuthCard } from "@/features/auth/components/AuthCard";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { ROUTES } from "@/lib/constants/routes";

export const metadata = { title: "ログイン" };

function LoginFormFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-11 rounded-xl bg-oshica-bg" />
      <div className="h-11 rounded-xl bg-oshica-bg" />
      <div className="h-11 rounded-xl bg-oshica-border" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <AuthCard title="ログイン" description="登録したメールアドレスでサインイン">
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </AuthCard>

      <p className="text-center text-sm font-bold text-oshica-primary">
        アカウントをお持ちでない方は{" "}
        <Link
          href={ROUTES.signup}
          className="font-black text-rose-500 hover:text-rose-600"
        >
          新規登録
        </Link>
      </p>
    </div>
  );
}