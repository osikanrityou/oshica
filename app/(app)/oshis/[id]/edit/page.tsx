"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EditOshiPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient() as any;

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    fetchOshi();
  }, []);

  const fetchOshi = async () => {
    const { data } = await supabase
      .from("oshis")
      .select("*")
      .eq("id", params.id)
      .single();

    if (data) {
      setName(data.name || "");
      setCategory(data.category || "");
      setMemo(data.memo || "");
    }

    setLoading(false);
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("oshis")
      .update({
        name,
        category,
        memo,
      })
      .eq("id", params.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("更新しました");

    router.push(`/oshis/${params.id}`);
    router.refresh();
  };

  if (loading) {
    return <div className="p-6">読み込み中...</div>;
  }

  return (
    <main className="mx-auto max-w-md px-5 py-8">
      <h1 className="text-2xl font-bold">推しを編集</h1>

      <div className="mt-8 space-y-4 rounded-3xl border bg-white p-5">
        <div>
          <label className="text-sm font-medium">推しの名前</label>

          <input
            className="mt-2 w-full rounded-2xl border px-4 py-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">ジャンル</label>

          <input
            className="mt-2 w-full rounded-2xl border px-4 py-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">メモ</label>

          <textarea
            className="mt-2 min-h-28 w-full rounded-2xl border px-4 py-3"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full rounded-2xl bg-sky-400 py-3 font-medium text-white"
        >
          保存する
        </button>
      </div>
    </main>
  );
}