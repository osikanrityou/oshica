"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ImagePlus, PawPrint } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function EditOshiPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient() as any;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [memo, setMemo] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchOshi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOshi = async () => {
    const { data } = await supabase
      .from("oshis")
      .select("*")
      .eq("id", params.id)
      .single();

    if (data) {
      setName(data.name || "");
      setCategory(data.category || data.genre || "");
      setMemo(data.memo || "");
      setImageUrl(data.image_url || null);
    }

    setLoading(false);
  };

  const handleUpdate = async () => {
    setSaving(true);

    let nextImageUrl = imageUrl;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const filePath = `${params.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("oshi-images")
        .upload(filePath, imageFile, {
          upsert: true,
        });

      if (uploadError) {
        alert(uploadError.message);
        setSaving(false);
        return;
      }

      const { data } = supabase.storage
        .from("oshi-images")
        .getPublicUrl(filePath);

      nextImageUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from("oshis")
      .update({
        name,
        category,
        memo,
        image_url: nextImageUrl,
      })
      .eq("id", params.id);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    router.push(`/oshis/${params.id}`);
    router.refresh();
  };

  const handleDelete = async () => {
    const ok = window.confirm("この推しを削除しますか？");

    if (!ok) return;

    setDeleting(true);

    const { error } = await supabase
      .from("oshis")
      .delete()
      .eq("id", params.id);

    if (error) {
      alert(error.message);
      setDeleting(false);
      return;
    }

    router.push("/oshis");
    router.refresh();
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-36 pt-8 text-oshica-text">
        <div className="rounded-[2rem] bg-white p-6 text-center shadow-sm">
          <p className="font-bold text-oshica-text">読み込み中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-36 pt-8 text-oshica-text">
      <header className="flex items-center justify-between">
        <Link
          href={`/oshis/${params.id}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-oshica-secondary shadow-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>

        <p className="text-sm font-black tracking-wide text-oshica-secondary">
          推しを編集
        </p>

        <div className="h-10 w-10" />
      </header>

      <section className="mt-7 rounded-[2rem] bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-oshica-bg text-5xl shadow-sm ring-4 ring-white">
          {imageFile ? (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="選択した画像"
              className="h-full w-full object-cover"
            />
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt="推し画像"
              className="h-full w-full object-cover"
            />
          ) : (
            <PawPrint className="h-10 w-10 text-oshica-primary" />
          )}
        </div>

        <label className="mt-4 inline-flex cursor-pointer items-center gap-1 rounded-full bg-oshica-bg px-4 py-2 text-xs font-bold text-oshica-primary">
          <ImagePlus className="h-4 w-4" />
          画像を選ぶ
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImageFile(file);
              }
            }}
          />
        </label>
      </section>

      <section className="mt-5 rounded-[2rem] bg-white p-5 shadow-sm">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-oshica-text">
              推しの名前
            </span>
            <input
              className="mt-2 w-full rounded-2xl border border-oshica-border bg-white px-4 py-3 text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-oshica-text">
              ジャンル
            </span>
            <input
              className="mt-2 w-full rounded-2xl border border-oshica-border bg-white px-4 py-3 text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-oshica-text">メモ</span>
            <textarea
              className="mt-2 min-h-28 w-full resize-none rounded-2xl border border-oshica-border bg-white px-4 py-3 text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </label>
        </div>
      </section>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Link
          href={`/oshis/${params.id}`}
          className="rounded-full px-4 py-2 text-sm font-bold text-oshica-primary"
        >
          キャンセル
        </Link>

        <button
          onClick={handleUpdate}
          disabled={saving || deleting}
          className="rounded-full bg-oshica-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition active:scale-95 disabled:opacity-60"
        >
          {saving ? "保存中..." : "保存する"}
        </button>
      </div>

      <section className="mt-8">
        <button
          onClick={handleDelete}
          disabled={saving || deleting}
          className="w-full rounded-[2rem] border border-red-200 bg-white px-5 py-4 text-sm font-black text-red-500 shadow-sm transition active:scale-[0.98] disabled:opacity-60"
        >
          {deleting ? "削除中..." : "この推しを削除する"}
        </button>
      </section>
    </main>
  );
}