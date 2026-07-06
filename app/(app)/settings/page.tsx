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
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { ROUTES } from "@/lib/constants/routes";
import { getAuthUser } from "@/lib/supabase/session";
import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";

export const metadata = {
  title: "設定",
};

const CONTACT_EMAIL = "osikanrityou@gmail.com";

export default async function SettingsPage() {
  const user = await getAuthUser();

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

      <div className="mt-5 space-y-3">
        <OshicaCard>
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-oshica-bg">
              <Mail className="h-5 w-5 text-oshica-primary" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-oshica-primary">
                ログイン中
              </p>
              <p className="mt-1 truncate font-bold text-oshica-text">
                {user?.email ?? "—"}
              </p>
            </div>
          </div>
        </OshicaCard>

        <Link href="/settings/billing" className="block">
          <OshicaCard>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-oshica-primary">
                  Premium
                </p>
                <p className="mt-1 text-xl font-black text-oshica-text">
                  Free
                </p>
                <p className="mt-1 text-sm text-oshica-primary">
                  Premiumについて見る
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-oshica-bg px-3 py-1 text-xs font-bold text-oshica-secondary">
                  上限あり
                </span>
                <ChevronRight className="h-5 w-5 text-oshica-primary" />
              </div>
            </div>
          </OshicaCard>
        </Link>

        <div className="space-y-2">
          <Link href={ROUTES.settingsAccount} className="block">
            <OshicaCard>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-oshica-primary" />
                  <div>
                    <p className="font-bold text-oshica-text">アカウント</p>
                    <p className="text-sm text-oshica-primary">
                      メールアドレスなど
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-oshica-primary" />
              </div>
            </OshicaCard>
          </Link>

          <Link href="/settings/home-message" className="block">
            <OshicaCard>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Type className="h-5 w-5 text-oshica-primary" />
                  <div>
                    <p className="font-bold text-oshica-text">
                      ホームメッセージ
                    </p>
                    <p className="text-sm text-oshica-primary">
                      ホーム画面の文章を変更
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-oshica-primary" />
              </div>
            </OshicaCard>
          </Link>

          <Link href="/settings/notifications" className="block">
            <OshicaCard>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-oshica-primary" />
                  <div>
                    <p className="font-bold text-oshica-text">通知設定</p>
                    <p className="text-sm text-oshica-primary">
                      リマインダー通知を管理
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 text-oshica-primary" />
              </div>
            </OshicaCard>
          </Link>

          <Link href="/terms" className="block">
            <OshicaCard>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-oshica-primary" />
                  <div>
                    <p className="font-bold text-oshica-text">利用規約</p>
                    <p className="text-sm text-oshica-primary">
                      サービス利用時のルール
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-oshica-primary" />
              </div>
            </OshicaCard>
          </Link>

          <Link href="/privacy" className="block">
            <OshicaCard>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-oshica-primary" />
                  <div>
                    <p className="font-bold text-oshica-text">
                      プライバシーポリシー
                    </p>
                    <p className="text-sm text-oshica-primary">
                      個人情報の取り扱い
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-oshica-primary" />
              </div>
            </OshicaCard>
          </Link>

          <Link href="/licenses" className="block">
            <OshicaCard>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-oshica-primary" />
                  <div>
                    <p className="font-bold text-oshica-text">ライセンス</p>
                    <p className="text-sm text-oshica-primary">
                      利用しているライブラリ
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-oshica-primary" />
              </div>
            </OshicaCard>
          </Link>

          <a href={mailto} className="block">
            <OshicaCard>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown className="h-5 w-5 text-oshica-primary" />
                  <div>
                    <p className="font-bold text-oshica-text">お問い合わせ</p>
                    <p className="text-sm text-oshica-primary">
                      ご意見・不具合報告
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 text-oshica-primary" />
              </div>
            </OshicaCard>
          </a>

          <OshicaCard>
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-oshica-primary" />
              <div>
                <p className="font-bold text-oshica-text">Oshica</p>
                <p className="text-sm text-oshica-primary">Version 1.0.0</p>
              </div>
            </div>
          </OshicaCard>
        </div>

        <div className="pt-3">
          <LogoutButton className="w-full" />
        </div>
      </div>
    </MobilePage>
  );
}