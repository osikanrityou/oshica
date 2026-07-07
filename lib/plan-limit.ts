import { getCurrentPlan } from "@/lib/subscription";

export type LimitTarget = "oshi" | "item";

export type PlanLimitResult = {
  plan: "free" | "plus" | "premium";
  limit: number | null;
  limitLabel: string;
};

export async function getPlanLimit(
  target: LimitTarget
): Promise<PlanLimitResult> {
  const plan = await getCurrentPlan();

  if (plan === "premium") {
    return {
      plan,
      limit: null,
      limitLabel: "Premiumプランでは無制限で登録できます",
    };
  }

  if (plan === "plus") {
    return {
      plan,
      limit: 5,
      limitLabel:
        target === "oshi"
          ? "Plusプランでは推しを5人まで登録できます"
          : "Plusプランでは1人の推しにつき5件まで登録できます",
    };
  }

  return {
    plan: "free",
    limit: 3,
    limitLabel:
      target === "oshi"
        ? "Freeプランでは推しを3人まで登録できます"
        : "Freeプランでは1人の推しにつき3件まで登録できます",
  };
}

export function isOverLimit(count: number, limit: number | null) {
  if (limit === null) return false;
  return count >= limit;
}