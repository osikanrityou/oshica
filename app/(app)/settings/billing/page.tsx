import Link from "next/link";

export const metadata = { title: "プレミアム" };

export default function BillingPage() {
  return (
    <main className="mx-auto max-w-md px-5 py-8">
      <Link href="/settings" className="text-sm text-sky-500">
        ← 設定へ戻る
      </Link>

      <section className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-sky-500">Oshica Premium</p>

        <h1 className="mt-3 text-2xl font-bold">
          推し活管理をもっと便利に
        </h1>

        <p className="mt-3 text-sm text-zinc-500">
          無料プランの登録上限を解除し、通知やバックアップ機能を使えるようにします。
        </p>

        <div className="mt-6 rounded-3xl bg-sky-50 p-5 text-center">
          <p className="text-sm text-zinc-500">月額</p>
          <p className="mt-1 text-3xl font-bold">¥300</p>
          <p className="mt-1 text-xs text-zinc-500">
            V1公開時は準備中
          </p>
        </div>

        <ul className="mt-6 space-y-3 text-sm">
          <li>✓ 推し登録 無制限</li>
          <li>✓ イベント登録 無制限</li>
          <li>✓ グッズ登録 無制限</li>
          <li>✓ 支出登録 無制限</li>
          <li>✓ 通知カスタマイズ</li>
          <li>✓ データバックアップ</li>
          <li>✓ 広告非表示</li>
        </ul>

        <button
          type="button"
          disabled
          className="mt-6 w-full rounded-2xl bg-zinc-300 py-3 font-bold text-white"
        >
          準備中
        </button>
      </section>
    </main>
  );
}