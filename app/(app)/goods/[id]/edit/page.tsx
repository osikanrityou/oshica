
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { updateGoods } from "../../actions";
import { OshicaCard } from "@/components/oshica/OshicaCard";


type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditGoodsPage({ params }: Props) {
  const { id } = await params;
  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: goods } = await supabase
  .from("goods")
  .select("id, name, price, deadline, release_date, status, memo")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!goods) {
    redirect("/goods");
  }

 return (
  <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-36 pt-8 text-oshica-text">
    <div className="mb-6 flex items-center justify-between">
      <Link
        href="/goods"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <h1 className="text-lg font-black">
        グッズを編集
      </h1>

      <div className="w-10" />
    </div>
<OshicaCard className="py-4 text-center">
  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
    <Package className="h-7 w-7" />
  </div>

  <p className="mt-3 text-base font-black text-oshica-text">
    {goods.name}
  </p>

  <p className="mt-1 text-[11px] font-medium text-oshica-primary">
    登録内容を編集
  </p>
</OshicaCard>
    <form action={updateGoods} className="mt-5 space-y-5">
      <input type="hidden" name="goodsId" value={goods.id} />

      <OshicaCard className="space-y-4">
        <div>
          <label className="text-sm font-bold">
            グッズ名
          </label>

          <input
            name="name"
            defaultValue={goods.name}
            required
            className="mt-2 w-full rounded-2xl border border-oshica-border bg-white px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm font-bold">
            値段
          </label>

          <input
            name="price"
            type="number"
            defaultValue={goods.price ?? ""}
            className="mt-2 w-full rounded-2xl border border-oshica-border bg-white px-4 py-3"
          />
        </div>
      </OshicaCard>

      <OshicaCard className="space-y-4">
        <div>
          <label className="text-sm font-bold">
            締切日
          </label>

          <input
            type="date"
            name="deadline"
            defaultValue={goods.deadline ?? ""}
            className="mt-2 w-full rounded-2xl border border-oshica-border bg-white px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm font-bold">
            発売日
          </label>

          <input
            type="date"
            name="releaseDate"
            defaultValue={goods.release_date ?? ""}
            className="mt-2 w-full rounded-2xl border border-oshica-border bg-white px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm font-bold">
            状態
          </label>

          <select
            name="status"
            defaultValue={goods.status ?? "未予約"}
            className="mt-2 w-full rounded-2xl border border-oshica-border bg-white px-4 py-3"
          >
            <option>未予約</option>
            <option>予約済み</option>
            <option>購入済み</option>
          </select>
        </div>
      </OshicaCard>

      <OshicaCard>
        <label className="text-sm font-bold">
          メモ
        </label>

        <textarea
          name="memo"
          defaultValue={goods.memo ?? ""}
          rows={5}
          className="mt-2 w-full resize-none rounded-2xl border border-oshica-border bg-white px-4 py-3"
        />
      </OshicaCard>

      <div className="flex items-center justify-between">
        <Link
          href="/goods"
          className="font-bold text-oshica-primary"
        >
          キャンセル
        </Link>

        <button
          type="submit"
          className="rounded-full bg-oshica-primary px-8 py-3 font-bold text-white"
        >
          保存する
        </button>
      </div>
    </form>
  </main>
);}