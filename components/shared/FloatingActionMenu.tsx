"use client";

import Link from "next/link";
import { useState } from "react";

export function FloatingActionMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-28 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="space-y-2 rounded-3xl border border-sky-100 bg-white p-3 shadow-lg">
          <Link
            href="/oshis/new"
            className="block rounded-2xl px-4 py-3 text-sm font-bold text-zinc-700 hover:bg-sky-50"
          >
            推しを追加
          </Link>

          <Link
            href="/events/new"
            className="block rounded-2xl px-4 py-3 text-sm font-bold text-zinc-700 hover:bg-sky-50"
          >
            イベントを追加
          </Link>

          <Link
            href="/goods/new"
            className="block rounded-2xl px-4 py-3 text-sm font-bold text-zinc-700 hover:bg-sky-50"
          >
            グッズを追加
          </Link>

          <Link
            href="/expenses/new"
            className="block rounded-2xl px-4 py-3 text-sm font-bold text-zinc-700 hover:bg-sky-50"
          >
            支出を追加
          </Link>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-400 text-3xl font-light text-white shadow-lg transition hover:bg-sky-500"
      >
        {open ? "×" : "+"}
      </button>
    </div>
  );
}