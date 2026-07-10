import { ChevronRight, PawPrint, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SidebarMenuButton } from "@/components/layout/SidebarMenu";
import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaEmptyState } from "@/components/oshica/OshicaEmptyState";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { PLAN_LIMITS } from "@/lib/plans";
import { getCurrentPlan } from "@/lib/subscription";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "推し一覧",
};

function getDaysLeft(dateText: string) {
  const today = new Date();
  const target = new Date(dateText);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  return Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
}

function deadlineText(dateText: string) {
  const days = getDaysLeft(dateText);

  if (days === 0) return "今日";
  if (days > 0) return `あと${days}日`;

  return `${Math.abs(days)}日前`;
}

function limitText(count: number, limit: number | null) {
  if (limit === null) return `${count}件`;

  return `${count}/${limit}`;
}

export default async function OshiPage() {
  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const currentPlan = await getCurrentPlan();
  const planLimits = PLAN_LIMITS[currentPlan];

  const planLabel =
    currentPlan === "premium"
      ? "Premium"
      : currentPlan === "plus"
        ? "Plus"
        : "Free";

  const pageDescription =
    currentPlan === "premium"
      ? "Premiumプランでは推しを無制限で登録できます"
      : `${planLabel}プランでは推し${planLimits.oshiLimit}人まで登録できます`;

  const today = new Date().toISOString().slice(0, 10);

  const { data: oshis } = await supabase
    .from("oshis")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: events } = await supabase
    .from("events")
    .select("id, oshi_id")
    .eq("user_id", user.id);

  const { data: goods } = await supabase
    .from("goods")
    .select("id, oshi_id")
    .eq("user_id", user.id);

  const { data: lotteryResults } = await supabase
    .from("lottery_results")
    .select("id, oshi_id")
    .eq("user_id", user.id);

  const { data: expenses } = await supabase
    .from("expenses")
    .select("id, oshi_id")
    .eq("user_id", user.id);

  const { data: schedules } = await supabase
    .from("upcoming_deadlines")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", today)
    .order("date", { ascending: true });

  return (
    <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-36 pt-8 text-oshica-text">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarMenuButton />

          <p className="text-base font-black tracking-wide text-oshica-secondary">
            Oshica
          </p>
        </div>

        <div className="h-10 w-10" />
      </div>

      <OshicaPageHeader
        label="Oshi"
        title="推し一覧"
        description={pageDescription}
        icon={<PawPrint className="h-5 w-5" />}
      />

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-sm font-black text-oshica-text">登録中の推し</h2>

        <Link
          href="/oshis/new"
          className="flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-bold text-oshica-primary shadow-sm"
        >
          <Plus className="h-4 w-4" />
          追加
        </Link>
      </div>

      <div className="mt-3 space-y-3">
        {oshis && oshis.length > 0 ? (
          oshis.map((oshi: any) => {
            const eventCount =
              events?.filter((item: any) => item.oshi_id === oshi.id).length ??
              0;

            const goodsCount =
              goods?.filter((item: any) => item.oshi_id === oshi.id).length ??
              0;

            const lotteryResultCount =
              lotteryResults?.filter(
                (item: any) => item.oshi_id === oshi.id,
              ).length ?? 0;

            const expenseCount =
              expenses?.filter((item: any) => item.oshi_id === oshi.id)
                .length ?? 0;

            const nextOshiSchedule = schedules?.find(
              (item: any) => item.oshi_id === oshi.id,
            );

            return (
              <Link key={oshi.id} href={`/oshis/${oshi.id}`} className="block">
                <OshicaCard className="p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-[0.98]">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-oshica-bg shadow-sm ring-2 ring-white">
                      {oshi.image_url ? (
                        <Image
                          src={oshi.image_url}
                          alt={oshi.name ?? "推し"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <PawPrint className="h-7 w-7 text-oshica-primary" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black text-oshica-text">
                        {oshi.name ?? "推し"}
                      </p>

                      {oshi.memo && (
                        <p className="mt-1 truncate text-xs font-medium text-oshica-primary">
                          {oshi.memo}
                        </p>
                      )}

                      <div className="mt-2 flex flex-nowrap gap-2 whitespace-nowrap text-[11px] font-bold text-oshica-primary">
                        <span>
                          イベント{" "}
                          {limitText(eventCount, planLimits.itemLimit)}
                        </span>

                        <span>
                          グッズ {limitText(goodsCount, planLimits.itemLimit)}
                        </span>

                        <span>
                          当落{" "}
                          {limitText(
                            lotteryResultCount,
                            planLimits.itemLimit,
                          )}
                        </span>

                        <span>
                          支出 {limitText(expenseCount, planLimits.itemLimit)}
                        </span>
                      </div>
                    </div>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-oshica-bg">
                      <ChevronRight className="h-4 w-4 text-oshica-primary" />
                    </div>
                  </div>

                  {nextOshiSchedule && (
                    <div className="mt-4 rounded-2xl bg-oshica-bg px-4 py-3">
                      <p className="text-[11px] font-bold text-oshica-primary">
                        次の予定
                      </p>

                      <div className="mt-1 flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-black text-oshica-text">
                          {nextOshiSchedule.title}
                        </p>

                        <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-black text-oshica-secondary">
                          {deadlineText(nextOshiSchedule.date)}
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-medium text-oshica-primary">
                        {nextOshiSchedule.label}：{nextOshiSchedule.date}
                      </p>
                    </div>
                  )}
                </OshicaCard>
              </Link>
            );
          })
        ) : (
          <OshicaEmptyState
            icon={<PawPrint className="h-6 w-6" />}
            title="まだ推しが登録されていません"
            description="まずは推しを登録しましょう"
            href="/oshis/new"
            actionLabel="推しを登録"
          />
        )}
      </div>
    </main>
  );
}