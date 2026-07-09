import Link from "next/link";
import { CalendarDays, Package, Trophy, Wallet } from "lucide-react";

type OshiActivitySummaryProps = {
  oshiId: string;
  eventCount: number;
  goodsCount: number;
  resultCount: number;
  expenseCount: number;
  itemLimit: number | null;
};

function countText(count: number, limit: number | null) {
  if (limit === null) return `${count}件`;
  return `${count}/${limit}`;
}

export function OshiActivitySummary({
  oshiId,
  eventCount,
  goodsCount,
  resultCount,
  expenseCount,
  itemLimit,
}: OshiActivitySummaryProps) {
  const items = [
    {
      label: "イベント",
      count: eventCount,
      icon: CalendarDays,
      href: `/events?oshiId=${oshiId}`,
    },
    {
      label: "グッズ",
      count: goodsCount,
      icon: Package,
      href: `/goods?oshiId=${oshiId}`,
    },
    {
      label: "当落",
      count: resultCount,
      icon: Trophy,
      href: `/results?oshiId=${oshiId}`,
    },
    {
      label: "支出",
      count: expenseCount,
      icon: Wallet,
      href: `/expenses?oshiId=${oshiId}`,
    },
  ];

  return (
    <section className="mt-4 rounded-[1.75rem] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <p className="text-xs font-black text-oshica-primary">Activity</p>
          <h2 className="text-sm font-black text-oshica-text">活動まとめ</h2>
        </div>

        <span className="rounded-full bg-oshica-bg px-3 py-1 text-[11px] font-bold text-oshica-primary">
          {itemLimit === null ? "無制限" : `各${itemLimit}件まで`}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-2xl border border-oshica-border bg-oshica-bg px-2 py-3 text-center transition active:scale-[0.98]"
            >
              <Icon className="mx-auto h-4 w-4 text-oshica-primary" />

              <p className="mt-1 text-[10px] font-bold text-oshica-primary">
                {item.label}
              </p>

              <p className="mt-1 text-base font-black text-oshica-text">
                {countText(item.count, itemLimit)}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}