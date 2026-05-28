"use client";

import {
  CalendarDays,
  Home,
  Settings,
  Ticket,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { APP_NAV_ITEMS } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

const ICONS = {
  home: Home,
  calendar: CalendarDays,
  ticket: Ticket,
  wallet: Wallet,
  settings: Settings,
} as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto max-w-md rounded-[2rem] border border-sky-100/80 bg-white/85 px-3 py-2 shadow-[0_10px_40px_rgba(14,165,233,0.18)] backdrop-blur-xl">
        <ul className="flex items-center justify-between">
          {APP_NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.icon];
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex min-w-14 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-medium transition",
                    active
                      ? "bg-sky-100 text-sky-500"
                      : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}