import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  Package,
  PawPrint,
  Wallet,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "ホーム" };

const FREE_OSHI_LIMIT = 3;
const FREE_PER_OSHI_LIMIT = 3;

function getDaysLeft(dateText: string) {
  const today = new Date();
  const target = new Date(dateText);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  return Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
}

function deadlineText(dateText: string) {
  const days = getDaysLeft(dateText);

  if (days === 0) return "今日";
  if (days > 0) return `あと${days}日`;
  return `${Math.abs(days)}日前`;
}

export default async function DashboardPage() {
  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const today = new Date().toISOString().slice(0, 10);

  const { data: oshis } = await supabase
    .from("oshis")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: schedules } = await supabase
    .from("upcoming_deadlines")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", today)
    .order("date", { ascending: true });

  const { data: events } = await supabase
    .from("events")
    .select("id, oshi_id")
    .eq("user_id", user.id);

  const { data: goods } = await supabase
    .from("goods")
    .select("id, name, price, deadline, release_date, status, oshi_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);

  const { data: monthlyExpenses } = await supabase
    .from("expenses")
    .select("amount, oshi_id")
    .eq("user_id", user.id)
    .gte("spent_at", monthStart)
    .lte("spent_at", monthEnd);

  const monthlyExpenseTotal =
    monthlyExpenses?.reduce((sum: number, item: any) => sum + item.amount, 0) ??
    0;

  const nearestSchedule = schedules?.[0];
  const latestGoods = goods?.slice(0, 3) ?? [];

  return (
    <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-36 pt-8 text-oshica-text">
      <header className="flex items-center justify-between">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl text-oshica-secondary shadow-sm">
          ≡
        </button>

        <p className="text-base font-black tracking-wide text-oshica-secondary">
          Oshica
        </p>

        <Link
          href="/notifications"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-oshica-primary shadow-sm"
        >
          <Bell className="h-5 w-5" />
        </Link>
      </header>

      <section className="mt-7 overflow-hidden rounded-[2rem] bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-oshica-primary">
              推し活の締切、もう忘れない。
            </p>

            <h1 className="mt-2 text-2xl font-black leading-relaxed text-oshica-text">
              今日も推し活を
              <br />
              一緒に確認しよう
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-oshica-primary">
              Freeプランは推し{FREE_OSHI_LIMIT}人まで。
              <br />
              各推しごとに3件ずつ管理できます。
            </p>
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.75rem] bg-oshica-bg text-oshica-primary">
            <PawPrint className="h-10 w-10" />
          </div>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-3 gap-3">
        <Link href="/calendar" className="rounded-3xl bg-white p-4 shadow-sm">
          <CalendarDays className="h-5 w-5 text-oshica-primary" />
          <p className="mt-2 text-xs font-bold text-oshica-primary">予定</p>
          <p className="mt-1 text-xl font-black text-oshica-text">
            {schedules?.length ?? 0}件
          </p>
        </Link>

        <Link href="/expenses" className="rounded-3xl bg-white p-4 shadow-sm">
          <Wallet className="h-5 w-5 text-oshica-primary" />
          <p className="mt-2 text-xs font-bold text-oshica-primary">今月</p>
          <p className="mt-1 text-lg font-black text-oshica-text">
            ¥{monthlyExpenseTotal.toLocaleString()}
          </p>
        </Link>

        <Link href="/goods" className="rounded-3xl bg-white p-4 shadow-sm">
          <Package className="h-5 w-5 text-oshica-primary" />
          <p className="mt-2 text-xs font-bold text-oshica-primary">グッズ</p>
          <p className="mt-1 text-xl font-black text-oshica-text">
            {goods?.length ?? 0}件
          </p>
        </Link>
      </section>

      <section className="mt-5 rounded-[2rem] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-oshica-primary">Free</p>
            <p className="mt-1 text-sm font-black text-oshica-text">
              推し {oshis?.length ?? 0}/{FREE_OSHI_LIMIT}人
            </p>
          </div>

          <div className="rounded-full bg-oshica-bg px-3 py-1 text-xs font-bold text-oshica-primary">
            各3件まで
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-oshica-bg px-2 py-3">
            <p className="text-[10px] font-bold text-oshica-primary">
              イベント
            </p>
            <p className="mt-1 text-sm font-black text-oshica-text">
              {FREE_PER_OSHI_LIMIT}件
            </p>
          </div>

          <div className="rounded-2xl bg-oshica-bg px-2 py-3">
            <p className="text-[10px] font-bold text-oshica-primary">
              グッズ
            </p>
            <p className="mt-1 text-sm font-black text-oshica-text">
              {FREE_PER_OSHI_LIMIT}件
            </p>
          </div>

          <div className="rounded-2xl bg-oshica-bg px-2 py-3">
            <p className="text-[10px] font-bold text-oshica-primary">支出</p>
            <p className="mt-1 text-sm font-black text-oshica-text">
              {FREE_PER_OSHI_LIMIT}件
            </p>
          </div>
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black text-oshica-text">次の締切</h2>
          <Link
            href="/calendar"
            className="text-xs font-bold text-oshica-primary"
          >
            カレンダーで見る ›
          </Link>
        </div>

        {nearestSchedule ? (
          <Link
            href={nearestSchedule.href}
            className="block rounded-[2rem] bg-oshica-secondary p-5 text-white shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-oshica-border">
                  {nearestSchedule.label}
                </p>
                <p className="mt-2 text-lg font-black">
                  {nearestSchedule.title}
                </p>
                <p className="mt-1 text-sm text-oshica-bg">
                  {nearestSchedule.date}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black text-oshica-secondary">
                {deadlineText(nearestSchedule.date)}
              </span>
            </div>
          </Link>
        ) : (
          <div className="rounded-[2rem] bg-white p-5 text-center shadow-sm">
            <p className="font-bold text-oshica-text">
              近い予定はありません
            </p>
            <p className="mt-1 text-sm text-oshica-primary">
              予定を追加するとここに表示されます
            </p>
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black text-oshica-text">推し一覧</h2>
          <Link
            href="/oshis/new"
            className="text-xs font-bold text-oshica-primary"
          >
            追加する ›
          </Link>
        </div>

        <div className="space-y-3">
          {oshis && oshis.length > 0 ? (
            oshis.map((oshi: any) => {
              const oshiEvents =
                events?.filter((item: any) => item.oshi_id === oshi.id)
                  .length ?? 0;

              const oshiGoods =
                goods?.filter((item: any) => item.oshi_id === oshi.id)
                  .length ?? 0;

              const oshiExpense =
                monthlyExpenses
                  ?.filter((item: any) => item.oshi_id === oshi.id)
                  .reduce((sum: number, item: any) => sum + item.amount, 0) ??
                0;

              const nextOshiSchedule = schedules?.find(
                (item: any) => item.oshi_id === oshi.id
              );

              return (
                <Link key={oshi.id} href={`/oshis/${oshi.id}`} className="block">
                  <div className="rounded-[2rem] bg-white p-5 shadow-sm transition-all duration-200 active:scale-[0.98]">
                    <div className="flex items-center gap-4">
                      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-oshica-bg ring-2 ring-white shadow-sm">
                        {oshi.image_url ? (
                          <img
                            src={oshi.image_url}
                            alt={oshi.name ?? "推し"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <PawPrint className="h-7 w-7 text-oshica-primary" />
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

                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-bold text-oshica-primary">
                          <span>予定 {oshiEvents}/3</span>
                          <span>グッズ {oshiGoods}/3</span>
                          <span>¥{oshiExpense.toLocaleString()}</span>
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
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="rounded-3xl border border-dashed border-oshica-border bg-white p-6 text-center">
              <p className="font-bold text-oshica-text">
                まだ推しが登録されていません
              </p>
              <p className="mt-1 text-sm text-oshica-primary">
                最初の推しを追加しましょう
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black text-oshica-text">
            最近追加したグッズ
          </h2>
          <Link href="/goods" className="text-xs font-bold text-oshica-primary">
            すべて見る ›
          </Link>
        </div>

        <div className="space-y-3">
          {latestGoods.length > 0 ? (
            latestGoods.map((item: any) => (
              <Link
                key={item.id}
                href={`/goods/${item.id}/edit`}
                className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="font-bold text-oshica-text">{item.name}</p>
                  <p className="mt-1 text-xs text-oshica-primary">
                    {item.price
                      ? `¥${Number(item.price).toLocaleString("ja-JP")}`
                      : "金額未設定"}
                  </p>
                </div>

                <ChevronRight className="h-5 w-5 text-oshica-primary" />
              </Link>
            ))
          ) : (
            <div className="rounded-3xl bg-white p-5 text-center shadow-sm">
              <p className="text-sm text-oshica-primary">
                まだグッズはありません
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}