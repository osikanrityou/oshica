import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

import { MobilePage } from "@/components/layout/MobilePage";
import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";

const CONTACT_EMAIL = "osikanrityou@gmail.com";

export default function PrivacyPage() {
  return (
    <MobilePage className="bg-oshica-bg pb-36">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/settings"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-oshica-secondary shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <p className="text-sm font-black text-oshica-secondary">
          プライバシー
        </p>

        <div className="h-10 w-10" />
      </div>

      <OshicaPageHeader
        label="Privacy"
        title="プライバシーポリシー"
        description="個人情報の取り扱いについて"
        icon={<Shield className="h-5 w-5" />}
      />

      <OshicaCard className="mt-5 space-y-5 text-sm leading-7 text-oshica-primary">
        <section>
          <h2 className="font-black text-oshica-text">1. 取得する情報</h2>
          <p className="mt-2">
            Oshicaでは、メールアドレス、登録した推し、グッズ、イベント、当落、支出、メモなどの情報を取得します。
          </p>
        </section>

        <section>
          <h2 className="font-black text-oshica-text">2. 利用目的</h2>
          <p className="mt-2">
            取得した情報は、サービス提供、本人確認、データ保存、締切通知、機能改善、不具合対応、お問い合わせ対応のために利用します。
          </p>
        </section>

        <section>
          <h2 className="font-black text-oshica-text">3. 第三者提供</h2>
          <p className="mt-2">
            法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
          </p>
        </section>
<section>
  <h2 className="font-black text-oshica-text">4. 外部サービス</h2>

  <p className="mt-2">
    本サービスでは、認証・データ保存のためにSupabase、決済のためにStripe、
    アクセス解析のためにGoogle Analyticsを利用しています。
    Google Analyticsでは、Cookie等を利用して利用状況を収集する場合があります。
    取得される情報はGoogle社のプライバシーポリシーに基づいて管理されます。
  </p>
</section>
        <section>
          <h2 className="font-black text-oshica-text">5. 情報の削除</h2>
          <p className="mt-2">
            ユーザーは、アプリ内で登録情報を編集・削除できます。
            その他のご相談はお問い合わせ先までご連絡ください。
          </p>
        </section>

        <section>
          <h2 className="font-black text-oshica-text">6. お問い合わせ</h2>
          <p className="mt-2">{CONTACT_EMAIL}</p>
        </section>

        <section>
          <h2 className="font-black text-oshica-text">制定日</h2>
          <p className="mt-2">2026年7月6日</p>
        </section>
      </OshicaCard>
    </MobilePage>
  );
}