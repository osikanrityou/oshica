import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";

import { MobilePage } from "@/components/layout/MobilePage";
import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";

export const metadata = {
  title: "通知設定",
};

export default function NotificationSettingsPage() {
  return (
    <MobilePage className="bg-oshica-bg pb-36">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/settings"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-oshica-secondary shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <p className="text-sm font-black text-oshica-secondary">通知設定</p>

        <div className="h-10 w-10" />
      </div>

      <OshicaPageHeader
        label="Notification"
        title="通知設定"
        description="締切リマインダーの通知内容を管理できます"
        icon={<Bell className="h-5 w-5" />}
      />

      <section className="mt-5 space-y-5">
        <OshicaCard className="space-y-4">
          <div>
            <p className="font-black text-oshica-text">基本設定</p>
            <p className="mt-1 text-sm font-bold text-oshica-primary">
              通知画面に表示するリマインダーを設定します
            </p>
          </div>

          <label className="flex items-center justify-between gap-4 rounded-2xl bg-oshica-bg px-4 py-3">
            <div>
              <p className="text-sm font-black text-oshica-text">
                通知を有効にする
              </p>
              <p className="mt-1 text-xs font-bold text-oshica-primary">
                締切が近い予定を通知画面に表示します
              </p>
            </div>

            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5 accent-oshica-primary"
            />
          </label>
        </OshicaCard>

        <OshicaCard className="space-y-4">
          <div>
            <p className="font-black text-oshica-text">通知タイミング</p>
            <p className="mt-1 text-sm font-bold text-oshica-primary">
              表示したいリマインダーを選択できます
            </p>
          </div>

          <label className="flex items-center justify-between rounded-2xl bg-oshica-bg px-4 py-3">
            <span className="text-sm font-bold text-oshica-text">
              当日通知
            </span>
            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5 accent-oshica-primary"
            />
          </label>

          <label className="flex items-center justify-between rounded-2xl bg-oshica-bg px-4 py-3">
            <span className="text-sm font-bold text-oshica-text">
              前日通知
            </span>
            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5 accent-oshica-primary"
            />
          </label>

          <label className="flex items-center justify-between rounded-2xl bg-oshica-bg px-4 py-3">
            <span className="text-sm font-bold text-oshica-text">
              3日前通知
            </span>
            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5 accent-oshica-primary"
            />
          </label>
        </OshicaCard>

        <OshicaCard>
          <p className="text-xs font-black text-oshica-primary">Premium</p>
          <p className="mt-2 font-black text-oshica-text">今後追加予定</p>
          <p className="mt-2 text-sm font-bold leading-6 text-oshica-primary">
            通知時間の変更、メール通知、通知タイミングの細かいカスタムはPremium機能として追加予定です。
          </p>
        </OshicaCard>

        <button
          type="button"
          className="w-full rounded-full bg-oshica-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition active:scale-95"
        >
          保存する
        </button>
      </section>
    </MobilePage>
  );
}