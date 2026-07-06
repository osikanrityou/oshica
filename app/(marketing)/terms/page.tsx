import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

import { MobilePage } from "@/components/layout/MobilePage";
import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";

export default function TermsPage() {
  return (
    <MobilePage className="bg-oshica-bg pb-36">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/settings"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-oshica-secondary shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <p className="text-sm font-black text-oshica-secondary">利用規約</p>

        <div className="h-10 w-10" />
      </div>

      <OshicaPageHeader
        label="Terms"
        title="利用規約"
        description="Oshicaをご利用いただく際のルールです"
        icon={<Shield className="h-5 w-5" />}
      />

      <OshicaCard className="mt-5 space-y-5 text-sm leading-7 text-oshica-primary">
        <section>
          <h2 className="font-black text-oshica-text">第1条（適用）</h2>
          <p className="mt-2">
            本規約は、Oshicaの利用条件を定めるものです。
            ユーザーは本サービスを利用した時点で、本規約に同意したものとみなします。
          </p>
        </section>

        <section>
          <h2 className="font-black text-oshica-text">第2条（サービス内容）</h2>
          <p className="mt-2">
            本サービスは、推し活に関するグッズ、イベント、当落、支出、締切などを管理するためのサービスです。
          </p>
        </section>

        <section>
          <h2 className="font-black text-oshica-text">第3条（禁止事項）</h2>
          <p className="mt-2">
            不正アクセス、迷惑行為、法令または公序良俗に反する行為、サービス運営を妨げる行為を禁止します。
          </p>
        </section>

        <section>
          <h2 className="font-black text-oshica-text">第4条（データ管理）</h2>
          <p className="mt-2">
            ユーザーが登録した情報は、ユーザー自身の責任で管理するものとします。
            本サービスは安全な運営に努めますが、データの完全な保存を保証するものではありません。
          </p>
        </section>

        <section>
          <h2 className="font-black text-oshica-text">第5条（免責事項）</h2>
          <p className="mt-2">
            本サービスの利用により発生した損害について、運営者は故意または重大な過失がある場合を除き責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="font-black text-oshica-text">制定日</h2>
          <p className="mt-2">2026年7月6日</p>
        </section>
      </OshicaCard>
    </MobilePage>
  );
}