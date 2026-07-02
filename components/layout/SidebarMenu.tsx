import Link from "next/link";
import {
  CalendarDays,
  Home,
  Package,
  Settings,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";

const menuItems = [
  { label: "ホーム", href: "/dashboard", icon: Home },
  { label: "推し一覧", href: "/oshis", icon: Users },
  { label: "イベント一覧", href: "/events", icon: CalendarDays },
  { label: "グッズ一覧", href: "/goods", icon: Package },
  { label: "当落一覧", href: "/results", icon: Trophy },
  { label: "支出一覧", href: "/expenses", icon: Wallet },
  { label: "設定", href: "/settings", icon: Settings },
];

export function SidebarMenuButton() {
  return (
    <details className="relative">
      <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full bg-white text-xl text-oshica-secondary shadow-sm">
        ≡
      </summary>

      <div className="absolute left-0 top-14 z-50 w-64 rounded-[2rem] bg-white p-3 shadow-lg ring-1 ring-oshica-border">
        <p className="px-3 pb-2 text-xs font-black text-oshica-primary">
          メニュー
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-oshica-text active:bg-oshica-bg"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
                  <Icon className="h-4 w-4" />
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-3 rounded-2xl bg-oshica-bg p-3">
          <p className="text-xs font-black text-oshica-secondary">Premium</p>
          <p className="mt-1 text-xs font-bold text-oshica-primary">
            Coming Soon
          </p>
        </div>
      </div>
    </details>
  );
}