import { createClient } from "@/lib/supabase/server";

export type SubscriptionPlan = "free" | "plus" | "premium";

export async function getCurrentPlan(): Promise<SubscriptionPlan> {
  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return "free";
  }

  const { data } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!data) {
    return "free";
  }

  if (data.plan === "plus") {
    return "plus";
  }

  if (data.plan === "premium") {
    return "premium";
  }

  return "free";
}