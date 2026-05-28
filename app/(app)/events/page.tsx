"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";


export default function EventsPage() {
  
  const supabase = createClient() as any;
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      // ログインユーザー取得
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("ログインユーザー:", user);

      if (!user) {
        alert("ログインしてください");
        return;
      }

      // Supabaseへ保存
      const { error } = await supabase.from("events").insert({
        title,
        event_date: eventDate,
        memo,
        user_id: user.id,
      });

      if (error) {
        console.error(error);
        alert("保存失敗");
        return;
      }

      alert("イベントを保存しました");

      setTitle("");
      setEventDate("");
      setMemo("");
    } catch (err) {
      console.error(err);
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">イベント登録</h1>

      <input
        type="text"
        placeholder="イベント名"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded p-2"
      />

      <input
        type="date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
        className="w-full border rounded p-2"
      />

      <textarea
        placeholder="メモ"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        className="w-full border rounded p-2"
      />

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-pink-500 text-white rounded p-2"
      >
        {loading ? "保存中..." : "保存"}
      </button>
    </div>
  );
}