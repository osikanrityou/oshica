import type { PlanType } from "@/lib/constants/enums";

export type BillingPlan = {
  id: PlanType;
  name: string;
  description: string;
  stripePriceId: string | null;
};
