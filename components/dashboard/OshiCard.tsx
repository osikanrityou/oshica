import Link from "next/link";

type OshiCardProps = {
  id: string;
  name: string;
  memo?: string | null;
  imageUrl?: string | null;
  eventCount: number;
  goodsCount: number;
  monthlyExpense: number;
};

export function OshiCard({
  id,
  name,
  memo,
  imageUrl,
  eventCount,
  goodsCount,
  monthlyExpense,
}: OshiCardProps) {
  return (
    <Link
      href={`/oshis/${id}`}
      className="flex items-center gap-4 rounded-3xl border border-sky-100 bg-white p-4 shadow-sm"
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-50 text-2xl text-sky-300">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          "♡"
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-black text-zinc-900">{name}</p>

        <p className="mt-1 text-xs text-zinc-500">
          {memo ?? "アイドル・歌手"}
        </p>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
          <span>📅 予定 {eventCount}件</span>
          <span>📦 グッズ {goodsCount}件</span>
          <span>💧 ¥{monthlyExpense.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-sky-100 text-sky-400">
        ›
      </div>
    </Link>
  );
}