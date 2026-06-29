"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function HomeMessagePage() {
  const router = useRouter();
  const supabase = createClient() as any;

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setTitle(data.home_title ?? "");
      setSubtitle(data.home_subtitle ?? "");
    }

    setLoading(false);
  }

  async function save() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const homeTitle = title
      .split("\n")
      .slice(0, 2)
      .join("\n");

    const homeSubtitle = subtitle
      .split("\n")
      .slice(0, 2)
      .join("\n");

    const { error } = await supabase
      .from("user_settings")
      .upsert({
        user_id: user.id,
        home_title: homeTitle,
        home_subtitle: homeSubtitle,
      });

    if (error) {
      alert(error.message);
      return;
    }

    alert("保存しました");

    router.push("/dashboard");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-md p-6">
        読み込み中...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md bg-oshica-bg px-5 py-8">
      <h1 className="text-2xl font-black text-oshica-text">
        ホームメッセージ
      </h1>

      <p className="mt-2 text-sm text-oshica-primary">
        ホーム画面に表示する文章を変更できます。
      </p>

      <div className="mt-8 space-y-5 rounded-[2rem] bg-white p-5 shadow-sm">

        <div>
          <label className="text-sm font-bold text-oshica-text">
            ホームタイトル
          </label>

          <textarea
            rows={2}
            maxLength={40}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-oshica-border px-4 py-3"
          />

          <p className="mt-1 text-xs text-zinc-500">
            最大2行・40文字
          </p>
        </div>

        <div>
          <label className="text-sm font-bold text-oshica-text">
            サブタイトル
          </label>

          <textarea
            rows={2}
            maxLength={60}
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-oshica-border px-4 py-3"
          />

          <p className="mt-1 text-xs text-zinc-500">
            最大2行・60文字
          </p>
        </div>

        <button
          onClick={save}
          className="w-full rounded-full bg-oshica-primary py-3 font-bold text-white"
        >
          保存する
        </button>

      </div>
    </main>
  );
}