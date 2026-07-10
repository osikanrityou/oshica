import Link from "next/link";
import { ArrowLeft, Check, Crown, Sparkles } from "lucide-react";

import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { getCurrentPlan } from "@/lib/subscription";
import {
  createBillingPortalSession,
  createCheckoutSession,
  syncCheckoutSession,
} from "./actions";

export const metadata = { title: "料金プラン" };

const plans = [
  {
    key: "plus",
    name: "Plus",
    price: "¥500",
    description: "推し活の予定が少し増えてきた方向け",
    features: ["推し5人まで", "各機能5件まで", "Freeより多く記録可能"],
    button: "Plusにアップグレード",
    highlight: true,
  },
  {
    key: "premium",
    name: "Premium",
    price: "¥1,000",
    description: "制限なく推し活をまとめて管理したい方向け",
    features: ["推し登録 無制限", "各機能 無制限", "今後の追加機能も優先対応予定"],
    button: "Premiumにアップグレード",
    highlight: false,
  },
  {
    key: "free",
    name: "Free",
    price: "¥0",
    description: "まずは無料で始めたい方向け",
    features: ["推し3人まで", "各機能3件まで", "基本機能の利用"],
    button: "現在のプラン",
    highlight: false,
  },
];

type Props = {
  searchParams?: Promise<{
    checkout?: string;
    session_id?: string;
  }>;
};

export default async function BillingPage({ searchParams }: Props) {
  const params = await searchParams;

  if (params?.checkout === "success" && params.session_id) {
    await syncCheckoutSession(params.session_id);
  }

  const currentPlan = await getCurrentPlan();

  const currentPlanLabel =
    currentPlan === "premium"
      ? "Premium"
      : currentPlan === "plus"
        ? "Plus"
        : "Free";

  const isPaidPlan = currentPlan === "plus" || currentPlan === "premium";

  return (
    <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-40 pt-6 text-oshica-text">
      <div className="mb-4">
        <Link
          href="/settings"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-oshica-primary shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>

      <OshicaPageHeader
        label="Plan"
        title="料金プラン"
        description={`現在のプラン：${currentPlanLabel}`}
        icon={<Crown className="h-5 w-5" />}
      />

      {isPaidPlan ? (
        <OshicaCard className="mt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-oshica-primary">
                サブスク管理
              </p>
              <p className="mt-1 text-sm leading-6 text-oshica-text">
                解約・支払い方法の変更・請求情報の確認はStripeの管理画面で行えます。
              </p>
            </div>

            <Crown className="h-5 w-5 shrink-0 text-oshica-primary" />
          </div>

          <form action={createBillingPortalSession}>
            <button
              type="submit"
              className="mt-4 w-full rounded-full bg-oshica-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95"
            >
              サブスクを管理
            </button>
          </form>
        </OshicaCard>
      ) : null}

      {params?.checkout === "success" ? (
        <div className="mt-4 rounded-3xl bg-white p-4 text-sm font-bold text-oshica-primary shadow-sm">
          決済が完了しました。プラン情報を更新しました。
        </div>
      ) : null}

      {params?.checkout === "cancel" ? (
        <div className="mt-4 rounded-3xl bg-white p-4 text-sm font-bold text-oshica-primary shadow-sm">
          決済をキャンセルしました。
        </div>
      ) : null}

      <section className="mt-4 space-y-3">
        {plans.map((plan) => {
          const isCurrentPlan = plan.key === currentPlan;
          const isFree = plan.key === "free";

          return (
            <OshicaCard
              key={plan.key}
              className={
                isCurrentPlan || plan.highlight
                  ? "border-2 border-oshica-primary p-4"
                  : "p-4"
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-black text-oshica-primary">
                      {plan.name}
                    </p>

                    {isCurrentPlan ? (
                      <span className="rounded-full bg-oshica-primary px-2.5 py-0.5 text-[10px] font-bold text-white">
                        加入中
                      </span>
                    ) : plan.highlight ? (
                      <span className="rounded-full bg-oshica-bg px-2.5 py-0.5 text-[10px] font-bold text-oshica-primary">
                        おすすめ
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1.5 text-2xl font-black text-oshica-text">
                    {plan.price}
                    <span className="ml-1 text-xs font-bold text-oshica-primary">
                      /月
                    </span>
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-oshica-primary">
                    {plan.description}
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
                  {plan.key === "premium" ? (
                    <Sparkles className="h-4 w-4" />
                  ) : (
                    <Crown className="h-4 w-4" />
                  )}
                </div>
              </div>

              <ul className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-xs font-bold text-oshica-text"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
                      <Check className="h-3 w-3" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {isCurrentPlan || isFree ? (
                <button
                  type="button"
                  disabled
                  className="mt-4 w-full rounded-full bg-oshica-bg px-4 py-2.5 text-xs font-bold text-oshica-primary"
                >
                  {isCurrentPlan ? "現在のプラン" : plan.button}
                </button>
              ) : (
                <form action={createCheckoutSession}>
                  <input type="hidden" name="plan" value={plan.key} />
                  <button
                    type="submit"
                    className="mt-4 w-full rounded-full bg-oshica-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95"
                  >
                    {plan.button}
                  </button>
                </form>
              )}
            </OshicaCard>
          );
        })}
      </section>

      <p className="mt-4 text-center text-[11px] leading-5 text-oshica-primary">
        決済はStripeの安全な決済画面で行われます。
        <br />
        いつでも解約できる月額プランです。
      </p>
    </main>
  );
}