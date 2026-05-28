"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function NewOshiPage() {
  const router = useRouter();
  const supabase = createClient() as any;

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [memo, setMemo] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);

    if (!file) {
      setPreviewUrl(null);
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("ログインしてください");
      setLoading(false);
      return;
    }

    let imageUrl: string | null = null;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("oshi-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        alert(uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("oshi-images")
        .getPublicUrl(filePath);

      imageUrl = data.publicUrl;
    }

    const { error } = await supabase.from("oshis").insert({
      name,
      category,
      memo,
      color: "#8ecae6",
      image_url: imageUrl,
      user_id: user.id,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("推しを登録しました");
    router.push("/oshis");
    router.refresh();
  };

  return (
    <main className="mx-auto max-w-md px-5 py-8">
      <p className="text-sm font-semibold text-sky-500">OshiCA</p>
      <h1 className="mt-2 text-2xl font-bold">推しを登録</h1>
      <p className="mt-2 text-sm text-zinc-500">
        グッズ・イベント・当落を管理する推しを追加しましょう。
      </p>

      <div className="mt-8 space-y-5 rounded-3xl border border-sky-50 bg-white p-5 shadow-sm">
        <div className="flex flex-col items-center">
          <label className="flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-sky-50 text-sky-400 shadow-inner">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="推し画像プレビュー"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl">♡</span>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
            />
          </label>

          <p className="mt-3 text-xs text-zinc-400">
            画像をタップして選択
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">推しの名前</label>
          <input
            className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:border-sky-300"
            placeholder="例：Aくん"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">ジャンル</label>
          <input
            className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:border-sky-300"
            placeholder="例：VTuber、アイドル、アニメ"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">メモ</label>
          <textarea
            className="mt-2 min-h-28 w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:border-sky-300"
            placeholder="誕生日、所属、好きなところなど"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading || !name}
          className="w-full rounded-2xl bg-sky-400 py-3 font-bold text-white shadow-[0_10px_24px_rgba(14,165,233,0.25)] transition active:scale-95 disabled:opacity-50"
        >
          {loading ? "登録中..." : "登録する"}
        </button>
      </div>
    </main>
  );
}