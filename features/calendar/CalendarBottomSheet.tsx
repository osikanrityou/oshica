"use client";

import Link from "next/link";
import { CalendarDays, Package, Ticket, X } from "lucide-react";

import { OshicaCard } from "@/components/oshica/OshicaCard";
import type { CalendarSchedule } from "./calendar-utils";
import { dateLabel } from "./calendar-utils";
import { OshicaEmptyState } from "@/components/oshica/OshicaEmptyState";

type Props = {
  open: boolean;
  schedules: CalendarSchedule[];
  selectedDate: string;
  onClose: () => void;
};

function getIcon(type: CalendarSchedule["type"]) {
  if (type === "event" || type === "event_deadline") return CalendarDays;
  if (type === "goods_deadline" || type === "goods_release") return Package;
  return Ticket;
}

export function CalendarBottomSheet({
  open,
  schedules,
  selectedDate,
  onClose,
}: Props) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/15 transition ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <div
        className={`fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-t-[32px] bg-white px-6 pt-5 shadow-2xl transition-all duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-zinc-200" />

        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-oshica-primary">選択日</p>
            <h2 className="mt-1 text-xl font-black text-oshica-text">
              {selectedDate}
            </h2>
          </div>

          <button onClick={onClose} className="rounded-full bg-oshica-bg p-2">
            <X className="h-5 w-5 text-oshica-secondary" />
          </button>
        </div>

        <div className="max-h-[45vh] overflow-y-auto pb-28">
          {schedules.length === 0 ? (
           <OshicaEmptyState
  icon={<CalendarDays className="h-6 w-6" />}
  title="この日の予定はありません"
  description="別の日を選択してください"
/>
          ) : (
            <div className="divide-y divide-oshica-border">
              {schedules.map((item) => {
                const Icon = getIcon(item.type);

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={onClose}
                    className="block py-4"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-oshica-primary">
                          {item.label}
                        </p>

                        <p className="mt-1 truncate font-black text-oshica-text">
                          {item.title}
                        </p>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <p className="text-xs text-oshica-primary">
                            {item.date}
                          </p>

                          <span className="shrink-0 rounded-full bg-oshica-bg px-3 py-1 text-xs font-bold text-oshica-secondary">
                            {dateLabel(item.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}