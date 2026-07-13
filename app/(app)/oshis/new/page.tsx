"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Crown,
  LoaderCircle,
  PawPrint,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { PLAN_LIMITS, isLimitReached, normalizePlan } from "@/lib/plans";
import { createClient } from "@/lib/supabase/client";

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

export default function NewOshiPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient() as any);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [memo, setMemo] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<
    "free" | "plus" | "premium"
  >("free");
  const [oshiLimit, setOshiLimit] = useState<number | null>(3);

  useEffect(() => {
    const checkLimit = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("plan, status")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      const plan = normalizePlan(subscription?.plan);
      const limit = PLAN_LIMITS[plan].oshiLimit;

      setCurrentPlan(plan);
      setOshiLimit(limit);

      const { count } = await supabase
        .from("oshis")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      setLimitReached(isLimitReached(count ?? 0, limit));
    };

    void checkLimit();
  }, [supabase]);

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
      toast.error(validation.message);
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (loading || name.trim().length === 0) return;

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("ログインしてください");
        return;
      }

      if (limitReached) {
        toast.error(
          currentPlan === "premium"
            ? "Premiumプランでは無制限で登録できます"
            : `${
                currentPlan === "plus" ? "Plus" : "Free"
              }プランでは推しを${oshiLimit}人まで登録できます`,
        );
        return;
      }

      let imageUrl: string | null = null;

      if (imageFile) {
        const validation = await validateImageFile(imageFile);

        if (!validation.valid) {
          toast.error(validation.message);
          return;
        }

        const filePath = `${user.id}/${Date.now()}.${validation.extension}`;

        const { error: uploadError } = await supabase.storage
          .from("oshi-images")
          .upload(filePath, imageFile, {
            contentType: imageFile.type,
          });

        if (uploadError) {
          toast.error(uploadError.message);
          return;
        }

        const { data } = supabase.storage
          .from("oshi-images")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      const { error } = await supabase.from("oshis").insert({
        name: name.trim(),
        category: category.trim(),
        memo: memo.trim(),
        color: "#8ecae6",
        image_url: imageUrl,
        user_id: user.id,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("推しを登録しました");
      router.push("/oshis");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const limitText =
    oshiLimit === null
      ? "Premiumプランでは推しを無制限で登録できます"
      : `${
          currentPlan === "plus" ? "Plus" : "Free"
        }プランでは推しを${oshiLimit}人まで登録できます`;

  return (
    <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-36 pt-8 text-oshica-text">
      <div className="mb-4">
        <Link
          href="/oshis"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-oshica-primary shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>

      <OshicaPageHeader
        label="Oshi"
        title="推し登録"
        description={limitText}
        icon={<PawPrint className="h-5 w-5" />}
      />

      {limitReached ? (
        <OshicaCard className="mt-5 text-center">
          <div className="py-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
              <Crown className="h-6 w-6" />
            </div>

            <p className="mt-4 font-bold text-oshica-text">
              登録上限に達しました
            </p>

            <p className="mt-2 text-sm leading-7 text-oshica-muted">
              {limitText}
            </p>

            <div className="mt-5 rounded-2xl bg-oshica-bg p-4 text-left text-sm">
              <p className="font-bold text-oshica-text">Plus（月500円）</p>
              <p className="mt-1 text-oshica-muted">推し5人・各5件まで</p>

              <p className="mt-4 font-bold text-oshica-text">
                Premium（月1000円）
              </p>
              <p className="mt-1 text-oshica-muted">すべて無制限</p>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/settings/billing"
                className="rounded-full bg-oshica-primary px-5 py-3 text-sm font-bold text-white"
              >
                プランを見る
              </Link>

              <Link
                href="/oshis"
                className="rounded-full px-5 py-3 text-sm font-bold text-oshica-primary"
              >
                推し一覧へ戻る
              </Link>
            </div>
          </div>
        </OshicaCard>
      ) : (
        <section className="mt-5 space-y-5">
          <OshicaCard className="py-5 text-center">
            <label className="mx-auto flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-oshica-bg text-oshica-primary shadow-sm ring-4 ring-white">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="推し画像プレビュー"
                  className="h-full w-full object-cover"
                />
              ) : (
                <PawPrint className="h-9 w-9" />
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={loading}
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  event.currentTarget.value = "";
                  void handleImageChange(file);
                }}
              />
            </label>

            <p className="mt-3 text-sm font-black text-oshica-text">
              推し画像
            </p>

            <p className="mt-1 text-xs font-bold text-oshica-primary">
              タップして画像を選択できます
            </p>
          </OshicaCard>

          <OshicaCard className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-oshica-text">
                推しの名前
              </span>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="例：ギルガメッシュ"
                disabled={loading}
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
                placeholder="例：ゲーム・アニメ"
                disabled={loading}
                className="mt-2 h-12 w-full rounded-2xl border border-oshica-border bg-white px-4 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border disabled:opacity-60"
              />
            </label>
          </OshicaCard>

          <OshicaCard>
            <label className="block">
              <span className="text-sm font-bold text-oshica-text">メモ</span>

              <textarea
                value={memo}
                onChange={(event) => setMemo(event.target.value)}
                rows={4}
                placeholder="推しのメモを自由に記録"
                disabled={loading}
                className="mt-2 w-full resize-none rounded-2xl border border-oshica-border bg-white px-4 py-3 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border disabled:opacity-60"
              />
            </label>
          </OshicaCard>

          <div className="flex items-center justify-between gap-3 pt-2">
            <Link
              href="/oshis"
              className={`rounded-full px-4 py-2 text-sm font-bold text-oshica-primary ${
                loading ? "pointer-events-none opacity-50" : ""
              }`}
            >
              キャンセル
            </Link>

            <button
              type="button"
              onClick={handleSave}
              disabled={loading || name.trim().length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-oshica-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  登録中...
                </>
              ) : (
                "登録する"
              )}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}