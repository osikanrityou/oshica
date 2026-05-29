import Link from "next/link";
import { Plus } from "lucide-react";

import { BottomNav } from "@/components/layout/BottomNav";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <main className="flex-1 pb-28">{children}</main>

      <Link
        href="/goods/new"
        className="fixed bottom-28 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sky-400 text-white shadow-[0_12px_30px_rgba(14,165,233,0.35)] transition hover:scale-105 active:scale-95"
        aria-label="推しを追加"
      >
        <Plus className="h-7 w-7" />
      </Link>

      <BottomNav />
    </div>
  );
}