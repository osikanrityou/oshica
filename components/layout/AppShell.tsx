"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarDays,
  Package,
  Plus,
  Ticket,
  Wallet,
} from "lucide-react";

import { BottomNav } from "@/components/layout/BottomNav";
import { FormSubmitGuard } from "@/components/shared/FormSubmitGuard";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      href: "/events/new",
      label: "イベント",
      icon: CalendarDays,
    },
    {
      href: "/goods/new",
      label: "グッズ",
      icon: Package,
    },
    {
      href: "/results/new",
      label: "当落",
      icon: Ticket,
    },
    {
      href: "/expenses/new",
      label: "支出",
      icon: Wallet,
    },
  ];

  return (
    <div className="flex min-h-full flex-col bg-oshica-bg">
      <FormSubmitGuard />

      <main className="flex-1 pb-32">{children}</main>

      {open && (
        <button
          type="button"
          aria-label="メニューを閉じる"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/20"
        />
      )}

      {open && (
        <div className="fixed inset-x-0 bottom-28 z-50 mx-auto flex max-w-md flex-col items-center gap-2 px-5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-3 rounded-full border border-oshica-border bg-white px-4 py-3 text-sm font-bold text-oshica-text shadow-lg"
              >
                <Icon className="h-5 w-5 text-oshica-primary" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="fixed bottom-8 left-1/2 z-[60] flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-oshica-primary text-white shadow-[0_8px_20px_rgba(96,121,158,0.28)] transition active:scale-95"
        aria-label={open ? "追加メニューを閉じる" : "追加メニューを開く"}
      >
        <Plus
          className={`h-6 w-6 transition-transform ${
            open ? "rotate-45" : ""
          }`}
        />
      </button>

      <BottomNav />
    </div>
  );
}