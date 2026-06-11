import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "ホーム" };

function getDaysLeft(dateText: string) {
  const today = new Date();
  const target = new Date(dateText);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
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

  if (!user) {
    redirect("/login");
  }

  const { count: oshiCount } = await supabase
    .from("oshis")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: eventCount } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: goodsCount } = await supabase
    .from("goods")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const today = new Date().toISOString().slice(0, 10);

  
    const { data: upcomingEvents } = await supabase
  .from("events")
  .select("id, title, event_date, deadline, memo")
  .eq("user_id", user.id)
  .order("event_date", { ascending: true })
  .limit(3);

  return (
    <main className="mx-auto max-w-md px-5 py-8">
      <h1 className="text-2xl font-bold">ホーム</h1>
      <p className="mt-2 text-sm text-zinc-500">
        今日の推し活をチェック
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-3xl border bg-white p-4 text-center shadow-sm">
          <p className="text-xs text-zinc-500">推し</p>
          <p className="mt-1 text-2xl font-bold">{oshiCount ?? 0}</p>
        </div>

        <div className="rounded-3xl border bg-white p-4 text-center shadow-sm">
          <p className="text-xs text-zinc-500">応募</p>
          <p className="mt-1 text-2xl font-bold">{eventCount ?? 0}</p>
        </div>

        <div className="rounded-3xl border bg-white p-4 text-center shadow-sm">
          <p className="text-xs text-zinc-500">グッズ</p>
          <p className="mt-1 text-2xl font-bold">{goodsCount ?? 0}</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-bold">次の予定</h2>

        <div className="mt-4 space-y-3">
          {upcomingEvents && upcomingEvents.length > 0 ? (
            upcomingEvents.map((item: any) => (
              <div
                key={item.id}
                className="rounded-3xl border bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">{item.title}</p>

                    <p className="mt-1 text-sm text-zinc-500">
                    締切日：{item.deadline ?? item.event_date}
                    </p>

                    {item.memo && (
                      <p className="mt-2 text-sm">{item.memo}</p>
                    )}
                  </div>

                  <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-bold text-sky-600">
                    {deadlineText(item.deadline ?? item.event_date)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-500">
              予定はありません
            </p>
          )}
        </div>
      </section>

      <section className="mt-8 grid gap-3">
        <Link
          href="/events"
          className="rounded-2xl bg-sky-400 px-4 py-3 text-center font-bold text-white"
        >
          イベントを見る
        </Link>

        <Link
          href="/goods"
          className="rounded-2xl bg-zinc-900 px-4 py-3 text-center font-bold text-white"
        >
          グッズを見る
        </Link>
      </section>
    </main>
  );
}