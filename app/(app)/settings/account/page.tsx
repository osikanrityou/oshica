import Link from "next/link";
import { ArrowLeft, Mail, UserRound } from "lucide-react";

import { MobilePage } from "@/components/layout/MobilePage";
import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { requireAuthUser } from "@/lib/supabase/session";

export const metadata = { title: "アカウント" };

export default async function AccountSettingsPage() {
  const user = await requireAuthUser();

  return (
    <MobilePage className="bg-oshica-bg pb-36">
      <div className="mb-4">
        <Link
          href="/settings"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-oshica-primary shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <OshicaPageHeader
        label="Account"
        title="アカウント"
        description="ログイン中のアカウント情報を確認できます"
        icon={<UserRound className="h-5 w-5" />}
      />

      <div className="mt-5 space-y-3">
        <OshicaCard>
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
              <Mail className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-oshica-primary">
                メールアドレス
              </p>
              <p className="mt-1 break-all text-sm font-black text-oshica-text">
                {user.email}
              </p>
            </div>
          </div>
        </OshicaCard>

        <OshicaCard>
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
              <UserRound className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-oshica-primary">
                ユーザーID
              </p>
              <p className="mt-1 break-all font-mono text-xs font-bold text-oshica-text">
                {user.id}
              </p>
            </div>
          </div>
        </OshicaCard>

        <OshicaCard>
          <p className="text-sm font-bold leading-7 text-oshica-primary">
            プロフィール編集・データエクスポートは Phase 2 で実装予定です。
          </p>
        </OshicaCard>
      </div>
    </MobilePage>
  );
}