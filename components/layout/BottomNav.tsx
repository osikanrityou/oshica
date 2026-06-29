"use client";

import { Bell, CalendarDays, Home, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "ホーム",
    icon: Home,
  },
  {
    href: "/calendar",
    label: "カレンダー",
    icon: CalendarDays,
  },
  {
    href: "/notifications",
    label: "通知",
    icon: Bell,
  },
  {
    href: "/settings",
    label: "設定",
    icon: Settings,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto max-w-md rounded-[2rem] border border-oshica-border/70 bg-white/90 px-4 py-2 shadow-[0_10px_40px_rgba(44,56,85,0.14)] backdrop-blur-xl">
        <ul className="grid grid-cols-5 items-center">
          <li>
            <NavItem item={NAV_ITEMS[0]} pathname={pathname} />
          </li>

          <li>
            <NavItem item={NAV_ITEMS[1]} pathname={pathname} />
          </li>

          <li className="h-14" aria-hidden />

          <li>
            <NavItem item={NAV_ITEMS[2]} pathname={pathname} />
          </li>

          <li>
            <NavItem item={NAV_ITEMS[3]} pathname={pathname} />
          </li>
        </ul>
      </div>
    </nav>
  );
}

function NavItem({
  item,
  pathname,
}: {
  item: (typeof NAV_ITEMS)[number];
  pathname: string;
}) {
  const Icon = item.icon;
  const active =
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium transition",
        active
          ? "bg-oshica-bg text-oshica-primary"
          : "text-oshica-border hover:bg-oshica-bg hover:text-oshica-secondary"
      )}
    >
      <Icon className="h-5 w-5" aria-hidden />
      <span>{item.label}</span>
    </Link>
  );
}