import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleDashed,
  CircleX,
  PawPrint,
  Pencil,
  Trophy,
  Wallet,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { PLAN_LIMITS } from "@/lib/plans";
import { getCurrentPlan } from "@/lib/subscription";
import { OshiActivitySummary } from "./components/OshiActivitySummary";
import { OshiPreviewSection } from "./components/OshiPreviewSection";

type Props = {
  params: Promise<{ id: string }>;
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

function daysLabel(dateText: string) {
  const days = getDaysLeft(dateText);

  if (days === 0) return "今日";
  if (days > 0) return `あと${days}日`;
  return `${Math.abs(days)}日前`;
}

function resultLabel(result: string | null) {
  if (result === "won") return "当選";
  if (result === "lost") return "落選";
  if (result === "cancelled") return "キャンセル";
  return "未発表";
}

function resultClassName(result: string | null) {
  if (result === "won") return "bg-green-100 text-green-700";
  if (result === "lost") return "bg-red-100 text-red-700";
  return "bg-oshica-bg text-oshica-secondary";
}

function ResultIcon({ result }: { result: string | null }) {
  if (result === "won") return <CircleCheck className="h-3.5 w-3.5" />;
  if (result === "lost") return <CircleX className="h-3.5 w-3.5" />;
  return <CircleDashed className="h-3.5 w-3.5" />;
}

export default async function OshiDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const currentPlan = await getCurrentPlan();
  const planLimits = PLAN_LIMITS[currentPlan];

  const { data: oshi } = await supabase
    .from("oshis")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!oshi) redirect("/dashboard");

  const { data: goods } = await supabase
    .from("goods")
    .select("*")
    .eq("user_id", user.id)
    .eq("oshi_id", id)
    .order("created_at", { ascending: false });

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", user.id)
    .eq("oshi_id", id)
    .order("event_date", { ascending: true });

  const { data: lotteryResults } = await supabase
    .from("lottery_results")
    .select("*")
    .eq("user_id", user.id)
    .eq("oshi_id", id)
    .order("created_at", { ascending: false });

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .eq("oshi_id", id)
    .order("spent_at", { ascending: false });

  const now = new Date();

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);

  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);

  const monthlyExpenses =
    expenses?.filter((item: any) => {
      const spentAt = item.spent_at;
      return spentAt && spentAt >= monthStart && spentAt <= monthEnd;
    }) ?? [];

  const eventCount = events?.length ?? 0;
  const goodsCount = goods?.length ?? 0;
  const resultCount = lotteryResults?.length ?? 0;
  const expenseCount = expenses?.length ?? 0;

  const monthlyExpenseTotal = monthlyExpenses.reduce(
    (sum: number, item: any) => sum + item.amount,
    0,
  );

  const expenseTotal =
    expenses?.reduce((sum: number, item: any) => sum + item.amount, 0) ?? 0;

  const today = new Date().toISOString().slice(0, 10);

  const schedules = [
    ...(events?.map((item: any) => ({
      id: `event-${item.id}`,
      type: "イベント",
      title: item.title,
      date: item.deadline ?? item.event_date,
      href: `/events/${item.id}/edit`,
    })) ?? []),
    ...(goods
      ?.filter((item: any) => item.deadline)
      .map((item: any) => ({
        id: `goods-${item.id}`,
        type: "グッズ締切",
        title: item.name,
        date: item.deadline,
        href: `/goods/${item.id}/edit`,
      })) ?? []),
  ]
    .filter((item: any) => item.date >= today)
    .sort((a: any, b: any) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const nearestSchedule = schedules[0];

  const latestEvents = events?.slice(0, 2) ?? [];
  const latestGoods = goods?.slice(0, 2) ?? [];
  const latestResults = lotteryResults?.slice(0, 2) ?? [];
  const latestExpenses = expenses?.slice(0, 2) ?? [];

  return (
    <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-36 pt-8 text-oshica-text">
      <header className="flex items-center justify-between">
        <Link
          href="/oshis"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-oshica-secondary shadow-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>

        <p className="max-w-48 truncate text-sm font-black tracking-wide text-oshica-secondary">
          {oshi.name}
        </p>

        <Link
          href="/notifications"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-oshica-secondary shadow-sm"
        >
          <Bell className="h-5 w-5" />
        </Link>
      </header>

      <section className="mt-5 rounded-[2rem] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-oshica-bg shadow-sm ring-4 ring-white">
            {oshi.image_url ? (
              <img
                src={oshi.image_url}
                alt={oshi.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <PawPrint className="h-11 w-11 text-oshica-primary" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-black text-oshica-primary">Oshi</p>

            <h1 className="mt-1 truncate text-2xl font-black text-oshica-text">
              {oshi.name}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-oshica-bg px-3 py-1 text-xs font-bold text-oshica-primary">
                {oshi.category ?? "ジャンル未設定"}
              </span>

              <Link
                href={`/oshis/${oshi.id}/edit`}
                className="inline-flex items-center gap-1 rounded-full bg-oshica-bg px-3 py-1 text-xs font-bold text-oshica-primary"
              >
                <Pencil className="h-3.5 w-3.5" />
                編集
              </Link>
            </div>

            {oshi.memo && (
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-oshica-primary">
                {oshi.memo}
              </p>
            )}
          </div>
        </div>
      </section>

      <OshiActivitySummary
        oshiId={oshi.id}
        eventCount={eventCount}
        goodsCount={goodsCount}
        resultCount={resultCount}
        expenseCount={expenseCount}
        itemLimit={planLimits.itemLimit}
      />

      <section className="mt-4 rounded-[1.75rem] bg-white p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-black text-oshica-primary">
              今月の支出
            </p>
            <p className="mt-1 text-xl font-black text-oshica-text">
              ¥{monthlyExpenseTotal.toLocaleString()}
            </p>
          </div>

          <div className="border-l border-oshica-border pl-4">
            <p className="text-xs font-black text-oshica-primary">合計支出</p>
            <p className="mt-1 text-xl font-black text-oshica-text">
              ¥{expenseTotal.toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {nearestSchedule && (
        <section className="mt-6">
          <h2 className="mb-3 text-sm font-black text-oshica-text">
            次の予定
          </h2>

          <Link
            href={nearestSchedule.href}
            className="block rounded-[1.75rem] bg-oshica-secondary p-4 text-white shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-oshica-border">
                  {nearestSchedule.type}
                </p>
                <p className="mt-2 truncate text-base font-black">
                  {nearestSchedule.title}
                </p>
                <p className="mt-1 text-sm text-oshica-bg">
                  {nearestSchedule.date}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black text-oshica-secondary">
                {daysLabel(nearestSchedule.date)}
              </span>
            </div>
          </Link>
        </section>
      )}

      <section className="mt-6">
        <div className="mb-1">
          <h2 className="text-sm font-black text-oshica-text">活動履歴</h2>
        </div>
      </section>

      <OshiPreviewSection
        title="イベント"
        listHref="/events"
        emptyTitle="イベントを登録しましょう"
        emptyDescription="右下の＋から追加できます"
        hasItems={latestEvents.length > 0}
      >
        {latestEvents.map((item: any) => (
          <Link
            key={item.id}
            href={`/events/${item.id}/edit`}
            className="flex items-center justify-between rounded-3xl border border-oshica-border bg-white p-4 shadow-sm"
          >
            <div className="min-w-0">
              <p className="truncate font-bold text-oshica-text">
                {item.title}
              </p>
              <p className="mt-1 text-xs text-oshica-primary">
                開催日：{item.event_date ?? "未設定"}
              </p>
              {item.deadline && (
                <p className="mt-1 text-xs text-oshica-primary">
                  締切：{item.deadline}
                </p>
              )}
            </div>

            <ChevronRight className="h-5 w-5 shrink-0 text-oshica-primary" />
          </Link>
        ))}
      </OshiPreviewSection>

      <OshiPreviewSection
        title="グッズ"
        listHref="/goods"
        emptyTitle="グッズを登録しましょう"
        emptyDescription="右下の＋から追加できます"
        hasItems={latestGoods.length > 0}
      >
        {latestGoods.map((item: any) => (
          <Link
            key={item.id}
            href={`/goods/${item.id}/edit`}
            className="flex items-center justify-between rounded-3xl border border-oshica-border bg-white p-4 shadow-sm"
          >
            <div className="min-w-0">
              <p className="truncate font-bold text-oshica-text">
                {item.name}
              </p>
              <p className="mt-1 text-sm font-black text-oshica-secondary">
                {item.price
                  ? `¥${Number(item.price).toLocaleString("ja-JP")}`
                  : "金額未設定"}
              </p>

              {item.release_date && (
                <p className="mt-1 text-xs text-oshica-primary">
                  発売日：{item.release_date}
                </p>
              )}

              <span className="mt-2 inline-flex rounded-full bg-oshica-bg px-2 py-1 text-[10px] font-bold text-oshica-secondary">
                {item.status ?? "未予約"}
              </span>
            </div>

            <ChevronRight className="h-5 w-5 shrink-0 text-oshica-primary" />
          </Link>
        ))}
      </OshiPreviewSection>

      <OshiPreviewSection
        title="当落"
        listHref="/results"
        emptyTitle="当落を登録しましょう"
        emptyDescription="応募結果を登録するとここに表示されます"
        hasItems={latestResults.length > 0}
      >
        {latestResults.map((item: any) => (
          <Link
            key={item.id}
            href={`/results/${item.id}`}
            className="flex items-center justify-between rounded-3xl border border-oshica-border bg-white p-4 shadow-sm"
          >
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-oshica-bg">
                <Trophy className="h-5 w-5 text-oshica-primary" />
              </div>

              <div className="min-w-0">
                <p className="truncate font-bold text-oshica-text">
                  {item.source_type ?? "当落記録"}
                </p>

                {item.announced_at && (
                  <p className="mt-1 text-xs text-oshica-primary">
                    発表日：{item.announced_at}
                  </p>
                )}

                {item.notes && (
                  <p className="mt-1 line-clamp-1 text-xs text-oshica-primary">
                    {item.notes}
                  </p>
                )}
              </div>
            </div>

            <span
              className={`ml-3 flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${resultClassName(
                item.result,
              )}`}
            >
              <ResultIcon result={item.result} />
              {resultLabel(item.result)}
            </span>
          </Link>
        ))}
      </OshiPreviewSection>

      <OshiPreviewSection
        title="支出"
        listHref="/expenses"
        emptyTitle="支出を登録しましょう"
        emptyDescription="推し活の支出を記録できます"
        hasItems={latestExpenses.length > 0}
      >
        {latestExpenses.map((item: any) => (
          <Link
            key={item.id}
            href={`/expenses/${item.id}`}
            className="flex items-center justify-between rounded-3xl border border-oshica-border bg-white p-4 shadow-sm"
          >
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-oshica-bg">
                <Wallet className="h-5 w-5 text-oshica-primary" />
              </div>

              <div className="min-w-0">
                <p className="truncate font-bold text-oshica-text">
                  {item.title}
                </p>
                <p className="mt-1 text-sm font-black text-oshica-secondary">
                  ¥{Number(item.amount).toLocaleString("ja-JP")}
                </p>
                {item.spent_at && (
                  <p className="mt-1 text-xs text-oshica-primary">
                    日付：{item.spent_at}
                  </p>
                )}
              </div>
            </div>

            <ChevronRight className="h-5 w-5 shrink-0 text-oshica-primary" />
          </Link>
        ))}
      </OshiPreviewSection>
    </main>
  );
}