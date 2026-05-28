"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NewGoodsPage() {
  const supabase = createClient() as any;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name) {
      alert("グッズ名を入力してください");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("ログインしてください");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("goods").insert({
      user_id: user.id,
      name,
      price: price ? Number(price) : null,
      memo,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("グッズを登録しました");
    window.location.href = "/goods/new";
  };

  return (
    <main className="mx-auto max-w-md px-5 py-8">
      <h1 className="text-2xl font-bold">グッズ登録</h1>

      <div className="mt-6 space-y-4 rounded-3xl border bg-white p-5">
        <div>
          <p className="text-sm font-medium">グッズ名</p>
          <input
            className="mt-2 h-12 w-full rounded-2xl border px-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <p className="text-sm font-medium">値段</p>
          <input
            type="number"
            className="mt-2 h-12 w-full rounded-2xl border px-4"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <p className="text-sm font-medium">メモ</p>
          <textarea
            className="mt-2 min-h-28 w-full rounded-2xl border p-4"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full rounded-2xl bg-sky-400 py-3 font-medium text-white"
        >
          {loading ? "登録中..." : "登録する"}
        </button>
      </div>
    </main>
  );
}