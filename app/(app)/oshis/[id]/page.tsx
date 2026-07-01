import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Package,
  PawPrint,
  Pencil,
  Wallet,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
};

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

function daysLabel(dateText: string) {
  const days = getDaysLeft(dateText);

  if (days === 0) return "今日";
  if (days > 0) return `あと${days}日`;
  return `${Math.abs(days)}日前`;
}

export default async function OshiDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

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

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .eq("oshi_id", id)
    .gte("spent_at", monthStart)
    .lte("spent_at", monthEnd)
    .order("spent_at", { ascending: false });

  const goodsCount = goods?.length ?? 0;
  const eventCount = events?.length ?? 0;
  const expenseCount = expenses?.length ?? 0;

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

      <section className="mt-7 rounded-[2rem] bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-oshica-bg shadow-sm ring-4 ring-white">
          {oshi.image_url ? (
            <img
              src={oshi.image_url}
              alt={oshi.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <PawPrint className="h-12 w-12 text-oshica-primary" />
          )}
        </div>

        <h1 className="mt-5 text-2xl font-black text-oshica-text">
          {oshi.name}
        </h1>

        <div className="mt-3 flex justify-center">
          <span className="rounded-full bg-oshica-bg px-4 py-1 text-xs font-bold text-oshica-primary">
            {oshi.category ?? "ジャンル未設定"}
          </span>
        </div>

        {oshi.memo && (
          <p className="mt-4 text-sm leading-relaxed text-oshica-primary">
            {oshi.memo}
          </p>
        )}

        <Link
          href={`/oshis/${oshi.id}/edit`}
          className="mt-4 inline-flex items-center gap-1 rounded-full bg-oshica-bg px-3 py-1.5 text-xs font-bold text-oshica-primary"
        >
          <Pencil className="h-3.5 w-3.5" />
          編集
        </Link>
      </section>

      <section className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-3xl border border-oshica-border bg-white p-4 text-center shadow-sm">
          <CalendarDays className="mx-auto h-4 w-4 text-oshica-primary" />
          <p className="mt-1 text-xs font-bold text-oshica-primary">予定</p>
          <p className="mt-2 text-lg font-black text-oshica-text">
            {eventCount}/{FREE_PER_OSHI_LIMIT}
          </p>
        </div>

        <div className="rounded-3xl border border-oshica-border bg-white p-4 text-center shadow-sm">
          <Package className="mx-auto h-4 w-4 text-oshica-primary" />
          <p className="mt-1 text-xs font-bold text-oshica-primary">グッズ</p>
          <p className="mt-2 text-lg font-black text-oshica-text">
            {goodsCount}/{FREE_PER_OSHI_LIMIT}
          </p>
        </div>

        <div className="rounded-3xl border border-oshica-border bg-white p-4 text-center shadow-sm">
          <Wallet className="mx-auto h-4 w-4 text-oshica-primary" />
          <p className="mt-1 text-xs font-bold text-oshica-primary">支出</p>
          <p className="mt-2 text-lg font-black text-oshica-text">
            {expenseCount}/{FREE_PER_OSHI_LIMIT}
          </p>
        </div>
      </section>

      <section className="mt-5 rounded-[2rem] bg-white p-5 shadow-sm">
        <p className="text-xs font-black text-oshica-primary">今月の支出</p>
        <p className="mt-2 text-2xl font-black text-oshica-text">
          ¥{expenseTotal.toLocaleString()}
        </p>
      </section>

      {nearestSchedule && (
        <section className="mt-7">
          <h2 className="mb-3 text-sm font-black text-oshica-text">
            次の予定
          </h2>

          <Link
            href={nearestSchedule.href}
            className="block rounded-[2rem] bg-oshica-secondary p-5 text-white shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-oshica-border">
                  {nearestSchedule.type}
                </p>
                <p className="mt-2 text-lg font-black">
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

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black text-oshica-text">イベント</h2>
          <Link
            href="/events/new"
            className="text-xs font-bold text-oshica-primary"
          >
            追加する ›
          </Link>
        </div>

        <div className="space-y-3">
          {events && events.length > 0 ? (
            events.map((item: any) => (
              <Link
                key={item.id}
                href={`/events/${item.id}/edit`}
                className="flex items-center justify-between rounded-3xl border border-oshica-border bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="font-bold text-oshica-text">{item.title}</p>
                  <p className="mt-1 text-xs text-oshica-primary">
                    開催日：{item.event_date ?? "未設定"}
                  </p>
                  {item.deadline && (
                    <p className="mt-1 text-xs text-oshica-primary">
                      締切：{item.deadline}
                    </p>
                  )}
                </div>

                <ChevronRight className="h-5 w-5 text-oshica-primary" />
              </Link>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-oshica-border bg-white p-6 text-center">
              <p className="font-bold text-oshica-text">
                イベントを登録しましょう
              </p>
              <p className="mt-1 text-sm text-oshica-primary">
                右下の＋から追加できます
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black text-oshica-text">グッズ</h2>
          <Link
            href="/goods/new"
            className="text-xs font-bold text-oshica-primary"
          >
            追加する ›
          </Link>
        </div>

        <div className="space-y-3">
          {goods && goods.length > 0 ? (
            goods.map((item: any) => (
              <Link
                key={item.id}
                href={`/goods/${item.id}/edit`}
                className="flex items-center justify-between rounded-3xl border border-oshica-border bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="font-bold text-oshica-text">{item.name}</p>
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

                <ChevronRight className="h-5 w-5 text-oshica-primary" />
              </Link>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-oshica-border bg-white p-6 text-center">
              <p className="font-bold text-oshica-text">
                グッズを登録しましょう
              </p>
              <p className="mt-1 text-sm text-oshica-primary">
                右下の＋から追加できます
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}