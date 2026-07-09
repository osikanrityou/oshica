import Link from "next/link";
import {
  Bell,
  ChevronRight,
  Crown,
  FileText,
  Info,
  Mail,
  Shield,
  Type,
  User,
} from "lucide-react";

import { MobilePage } from "@/components/layout/MobilePage";
import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { ROUTES } from "@/lib/constants/routes";
import { PLAN_LIMITS } from "@/lib/plans";
import { getCurrentPlan } from "@/lib/subscription";
import { getAuthUser } from "@/lib/supabase/session";

export const metadata = {
  title: "設定",
};

const CONTACT_EMAIL = "osikanrityou@gmail.com";

const settingItems = [
  {
    href: ROUTES.settingsAccount,
    title: "アカウント",
    description: "メールアドレスなど",
    icon: User,
  },
  {
    href: "/settings/home-message",
    title: "ホームメッセージ",
    description: "ホーム画面の文章を変更",
    icon: Type,
  },
  {
    href: "/settings/notifications",
    title: "通知設定",
    description: "リマインダー通知を管理",
    icon: Bell,
  },
  {
    href: "/terms",
    title: "利用規約",
    description: "サービス利用時のルール",
    icon: Shield,
  },
  {
    href: "/privacy",
    title: "プライバシーポリシー",
    description: "個人情報の取り扱い",
    icon: Shield,
  },
  {
    href: "/licenses",
    title: "ライセンス",
    description: "利用しているライブラリ",
    icon: FileText,
  },
];

export default async function SettingsPage() {
  const user = await getAuthUser();
  const currentPlan = await getCurrentPlan();
  const planLimits = PLAN_LIMITS[currentPlan];

  const planLabel =
    currentPlan === "premium"
      ? "Premium"
      : currentPlan === "plus"
        ? "Plus"
        : "Free";

  const planDescription =
    currentPlan === "premium"
      ? "登録数を気にせず推し活を管理できます"
      : currentPlan === "plus"
        ? "Freeより多く推し活を管理できます"
        : "Premiumについて見る";

  const limitBadgeText =
    planLimits.oshiLimit === null ? "無制限" : "上限あり";

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    "【Oshica】お問い合わせ",
  )}&body=${encodeURIComponent(
    `■お問い合わせ内容

----------------------------------------

（こちらに内容をご記入ください）

----------------------------------------

アプリバージョン：1.0.0
端末：
`,
  )}`;

  return (
    <MobilePage className="bg-oshica-bg pb-36">
      <OshicaPageHeader
        label="Settings"
        title="設定"
        description="アカウントや通知などを管理できます"
      />

      <div className="mt-5 space-y-4">
        <OshicaCard>
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
              <Mail className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-oshica-primary">
                ログイン中
              </p>
              <p className="mt-1 truncate font-black text-oshica-text">
                {user?.email ?? "—"}
              </p>
            </div>
          </div>
        </OshicaCard>

        <Link href="/settings/billing" className="block">
          <OshicaCard>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-oshica-primary">
                  現在のプラン
                </p>
                <p className="mt-1 text-xl font-black text-oshica-text">
                  {planLabel}
                </p>
                <p className="mt-1 text-sm leading-6 text-oshica-primary">
                  {planDescription}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-oshica-bg px-3 py-1 text-xs font-bold text-oshica-secondary">
                  {limitBadgeText}
                </span>
                <ChevronRight className="h-5 w-5 text-oshica-primary" />
              </div>
            </div>
          </OshicaCard>
        </Link>

        <section className="space-y-2">
          {settingItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} className="block">
                <OshicaCard>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="font-bold text-oshica-text">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-sm text-oshica-primary">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 shrink-0 text-oshica-primary" />
                  </div>
                </OshicaCard>
              </Link>
            );
          })}

          <a href={mailto} className="block">
            <OshicaCard>
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
                    <Crown className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-oshica-text">お問い合わせ</p>
                    <p className="mt-0.5 text-sm text-oshica-primary">
                      ご意見・不具合報告
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 shrink-0 text-oshica-primary" />
              </div>
            </OshicaCard>
          </a>

          <OshicaCard>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
                <Info className="h-5 w-5" />
              </div>

              <div>
                <p className="font-bold text-oshica-text">Oshica</p>
                <p className="mt-0.5 text-sm text-oshica-primary">
                  Version 1.0.0
                </p>
              </div>
            </div>
          </OshicaCard>
        </section>

        <div className="pt-2">
          <LogoutButton className="w-full" />
        </div>
      </div>
    </MobilePage>
  );
}