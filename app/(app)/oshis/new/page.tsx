"use client";

import { useEffect, useState } from "react";
import { Crown, PawPrint } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { PLAN_LIMITS, isLimitReached, normalizePlan } from "@/lib/plans";
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
  const [limitReached, setLimitReached] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<"free" | "plus" | "premium">(
    "free"
  );
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

    checkLimit();
  }, [supabase]);

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
      toast.error("ログインしてください");
      setLoading(false);
      return;
    }

    if (limitReached) {
      toast.error(
        currentPlan === "premium"
          ? "Premiumプランでは無制限で登録できます"
          : `${currentPlan === "plus" ? "Plus" : "Free"}プランでは推しを${oshiLimit}人まで登録できます`
      );
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
        toast.error(uploadError.message);
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
      toast.error(error.message);
      return;
    }

    toast.success("推しを登録しました");
    router.push("/oshis");
    router.refresh();
  };

  const limitText =
    oshiLimit === null
      ? "Premiumプランでは推しを無制限で登録できます"
      : `${currentPlan === "plus" ? "Plus" : "Free"}プランでは推しを${oshiLimit}人まで登録できます`;

  return (
    <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-36 pt-8 text-oshica-text">
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
            <label className="mx-auto flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-oshica-bg text-oshica-primary shadow-sm">
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
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
              />
            </label>

            <p className="mt-3 inline-flex rounded-full bg-oshica-bg px-4 py-2 text-xs font-bold text-oshica-primary">
              画像を選ぶ
            </p>
          </OshicaCard>

          <OshicaCard className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-oshica-text">
                推しの名前
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例：ギルガメッシュ"
                className="mt-2 w-full rounded-2xl border border-oshica-border bg-white px-4 py-3 text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-oshica-text">
                ジャンル
              </span>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="例：ゲーム・アニメ"
                className="mt-2 w-full rounded-2xl border border-oshica-border bg-white px-4 py-3 text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              />
            </label>
          </OshicaCard>

          <OshicaCard>
            <label className="block">
              <span className="text-sm font-bold text-oshica-text">メモ</span>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                rows={4}
                placeholder="推しのメモを自由に記録"
                className="mt-2 w-full resize-none rounded-2xl border border-oshica-border bg-white px-4 py-3 text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
              />
            </label>
          </OshicaCard>

          <div className="flex items-center justify-between gap-3 pt-2">
            <Link
              href="/oshis"
              className="rounded-full px-4 py-2 text-sm font-bold text-oshica-primary"
            >
              キャンセル
            </Link>

            <button
              type="button"
              onClick={handleSave}
              disabled={loading || !name}
              className="rounded-full bg-oshica-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition active:scale-95 disabled:opacity-50"
            >
              {loading ? "登録中..." : "登録する"}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}