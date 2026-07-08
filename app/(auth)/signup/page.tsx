import Link from "next/link";

import { AuthCard } from "@/features/auth/components/AuthCard";
import { SignupForm } from "@/features/auth/components/SignupForm";
import { ROUTES } from "@/lib/constants/routes";

export const metadata = { title: "新規登録" };

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <AuthCard title="新規登録" description="無料で Oshica をはじめましょう">
        <SignupForm />
      </AuthCard>

      <p className="text-center text-sm font-bold text-oshica-primary">
        すでにアカウントをお持ちの方は{" "}
        <Link
          href={ROUTES.login}
          className="font-black text-rose-500 hover:text-rose-600"
        >
          ログイン
        </Link>
      </p>
    </div>
  );
}