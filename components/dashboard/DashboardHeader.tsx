import Link from "next/link";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between">
      <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl text-zinc-600 shadow-sm">
        ≡
      </button>

      <p className="text-sm font-black tracking-wide text-sky-400">
        OshiCA
      </p>

      <Link
        href="/notifications"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm shadow-sm"
      >
        🔔
      </Link>
    </header>
  );
}