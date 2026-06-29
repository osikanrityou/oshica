import Link from "next/link";
import { CalendarDays, Package, Ticket } from "lucide-react";

import { OshicaCard } from "@/components/oshica/OshicaCard";
import { cn } from "@/lib/utils";
import type { CalendarSchedule } from "./calendar-utils";
import { dateLabel } from "./calendar-utils";

type Props = {
  schedules: CalendarSchedule[];
};

function getIcon(type: CalendarSchedule["type"]) {
  if (type === "event" || type === "event_deadline") return CalendarDays;
  if (type === "goods_deadline" || type === "goods_release") return Package;
  return Ticket;
}

function getAccentClass(type: CalendarSchedule["type"]) {
  if (type === "event") return "border-l-oshica-primary";
  if (type === "event_deadline") return "border-l-oshica-secondary";
  if (type === "goods_deadline") return "border-l-oshica-secondary";
  if (type === "goods_release") return "border-l-oshica-border";
  return "border-l-oshica-secondary";
}

export function CalendarSchedule({ schedules }: Props) {
  if (schedules.length === 0) {
    return (
      <OshicaCard>
        <div className="py-6 text-center">
          <p className="font-bold text-oshica-text">
            この日の予定はありません
          </p>
          <p className="mt-1 text-sm text-oshica-primary">
            イベントやグッズを登録すると表示されます
          </p>
        </div>
      </OshicaCard>
    );
  }

  return (
    <div className="space-y-3">
      {schedules.map((item) => {
        const Icon = getIcon(item.type);

        return (
          <Link key={item.id} href={item.href} className="block">
            <OshicaCard
              className={cn(
                "border-l-4 transition hover:-translate-y-0.5",
                getAccentClass(item.type)
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-oshica-primary">
                      {item.label}
                    </p>
                    <p className="mt-1 truncate text-base font-black text-oshica-text">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs font-medium text-oshica-primary">
                      {item.date}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-full bg-oshica-bg px-3 py-1 text-xs font-bold text-oshica-secondary">
                  {dateLabel(item.date)}
                </span>
              </div>
            </OshicaCard>
          </Link>
        );
      })}
    </div>
  );
}