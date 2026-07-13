"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ImagePlus,
  LoaderCircle,
  PawPrint,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { deleteOshiCascade } from "./actions";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const IMAGE_EXTENSIONS: Record<string, "jpg" | "png" | "webp"> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function validateImageFile(file: File) {
  if (!(file.type in IMAGE_EXTENSIONS)) {
    return {
      valid: false as const,
      message: "JPEG・PNG・WebP形式の画像を選択してください",
    };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false as const,
      message: "画像サイズは5MB以下にしてください",
    };
  }

  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  const isJpeg =
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff;

  const isPng =
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a;

  const isWebp =
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50;

  const signatureMatches =
    (file.type === "image/jpeg" && isJpeg) ||
    (file.type === "image/png" && isPng) ||
    (file.type === "image/webp" && isWebp);

  if (!signatureMatches) {
    return {
      valid: false as const,
      message: "画像ファイルの形式を確認できませんでした",
    };
  }

  return {
    valid: true as const,
    extension: IMAGE_EXTENSIONS[file.type],
  };
}

export default function EditOshiPage() {
  const router = useRouter();
  const params = useParams();
  const [supabase] = useState(() => createClient() as any);

  const oshiId = String(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [memo, setMemo] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const processing = saving || deleting;

  useEffect(() => {
    const fetchOshi = async () => {
      const { data } = await supabase
        .from("oshis")
        .select("*")
        .eq("id", oshiId)
        .single();

      if (data) {
        setName(data.name || "");
        setCategory(data.category || data.genre || "");
        setMemo(data.memo || "");
        setImageUrl(data.image_url || null);
      }

      setLoading(false);
    };

    void fetchOshi();
  }, [oshiId, supabase]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = async (file: File | null) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!file) {
      setImageFile(null);
      setPreviewUrl(null);
      return;
    }

    const validation = await validateImageFile(file);

    if (!validation.valid) {
      setImageFile(null);
      setPreviewUrl(null);
      alert(validation.message);
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    if (processing || name.trim().length === 0) return;

    setSaving(true);

    try {
      let nextImageUrl = imageUrl;

      if (imageFile) {
        const validation = await validateImageFile(imageFile);

        if (!validation.valid) {
          alert(validation.message);
          return;
        }

        const filePath = `${oshiId}/${Date.now()}.${validation.extension}`;

        const { error: uploadError } = await supabase.storage
          .from("oshi-images")
          .upload(filePath, imageFile, {
            contentType: imageFile.type,
            upsert: true,
          });

        if (uploadError) {
          alert(uploadError.message);
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
          name: name.trim(),
          category: category.trim(),
          memo: memo.trim(),
          image_url: nextImageUrl,
        })
        .eq("id", oshiId);

      if (error) {
        alert(error.message);
        return;
      }

      router.push(`/oshis/${oshiId}`);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (processing) return;

    const ok = window.confirm(
      "この推しを削除すると、この推しに登録されているグッズ・イベント・支出・当落などのデータもすべて削除されます。\n\n本当に削除しますか？",
    );

    if (!ok) return;

    setDeleting(true);

    try {
      await deleteOshiCascade(oshiId);
      router.replace("/oshis");
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "推しの削除に失敗しました。",
      );
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-36 pt-8 text-oshica-text">
        <div className="rounded-[2rem] bg-white p-6 text-center shadow-sm">
          <div className="flex items-center justify-center gap-2 font-bold text-oshica-text">
            <LoaderCircle className="h-4 w-4 animate-spin text-oshica-primary" />
            読み込み中...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-36 pt-8 text-oshica-text">
      <header className="flex items-center justify-between">
        <Link
          href={`/oshis/${oshiId}`}
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-white text-oshica-secondary shadow-sm ${
            processing ? "pointer-events-none opacity-50" : ""
          }`}
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
          {previewUrl ? (
            <img
              src={previewUrl}
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

        <label
          className={`mt-4 inline-flex items-center gap-1 rounded-full bg-oshica-bg px-4 py-2 text-xs font-bold text-oshica-primary ${
            processing
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }`}
        >
          <ImagePlus className="h-4 w-4" />
          画像を選ぶ

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={processing}
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              event.currentTarget.value = "";
              void handleImageChange(file);
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
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={processing}
              className="mt-2 h-12 w-full rounded-2xl border border-oshica-border bg-white px-4 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border disabled:opacity-60"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-oshica-text">
              ジャンル
            </span>

            <input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              disabled={processing}
              className="mt-2 h-12 w-full rounded-2xl border border-oshica-border bg-white px-4 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border disabled:opacity-60"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-oshica-text">メモ</span>

            <textarea
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
              disabled={processing}
              className="mt-2 min-h-28 w-full resize-none rounded-2xl border border-oshica-border bg-white px-4 py-3 text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border disabled:opacity-60"
            />
          </label>
        </div>
      </section>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Link
          href={`/oshis/${oshiId}`}
          className={`rounded-full px-4 py-2 text-sm font-bold text-oshica-primary ${
            processing ? "pointer-events-none opacity-50" : ""
          }`}
        >
          キャンセル
        </Link>

        <button
          type="button"
          onClick={handleUpdate}
          disabled={processing || name.trim().length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-oshica-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            "保存する"
          )}
        </button>
      </div>

      <section className="mt-8">
        <button
          type="button"
          onClick={handleDelete}
          disabled={processing}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[2rem] border border-red-200 bg-white px-5 py-4 text-sm font-black text-red-500 shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              削除中...
            </>
          ) : (
            "この推しを削除する"
          )}
        </button>
      </section>
    </main>
  );
}