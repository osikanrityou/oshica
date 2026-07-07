export type OshicaPlan = "free" | "plus" | "premium";

export type PlanLimits = {
  oshiLimit: number | null;
  itemLimit: number | null;
};

export const PLAN_LIMITS: Record<OshicaPlan, PlanLimits> = {
  free: {
    oshiLimit: 3,
    itemLimit: 3,
  },
  plus: {
    oshiLimit: 5,
    itemLimit: 5,
  },
  premium: {
    oshiLimit: null,
    itemLimit: null,
  },
};

export function normalizePlan(plan: unknown): OshicaPlan {
  if (plan === "plus" || plan === "premium") {
    return plan;
  }

  return "free";
}

export function isLimitReached(count: number, limit: number | null) {
  if (limit === null) return false;

  return count >= limit;
}