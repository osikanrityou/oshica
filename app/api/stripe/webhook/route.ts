import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

type SubscriptionPlan = "free" | "plus" | "premium";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function normalizePlan(plan: unknown): SubscriptionPlan {
  if (plan === "plus" || plan === "premium") {
    return plan;
  }

  return "free";
}

async function upsertSubscription({
  userId,
  plan,
  status,
  customerId,
  subscriptionId,
}: {
  userId: string;
  plan: SubscriptionPlan;
  status: string;
  customerId: string | null;
  subscriptionId: string | null;
}) {
  await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: userId,
      plan,
      status,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "署名がありません" }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET が未設定です" },
      { status: 500 },
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json(
      { error: "Webhook署名の検証に失敗しました" },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    const userId = session.metadata?.user_id;
    const plan = normalizePlan(session.metadata?.plan);

    if (userId && plan !== "free") {
      await upsertSubscription({
        userId,
        plan,
        status: "active",
        customerId:
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id ?? null,
        subscriptionId:
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id ?? null,
      });
    }
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    const subscription = event.data.object as any;

    const userId = subscription.metadata?.user_id;
    const plan = normalizePlan(subscription.metadata?.plan);

    if (userId) {
      const activeStatuses = ["active", "trialing"];
      const safePlan = activeStatuses.includes(subscription.status)
        ? plan
        : "free";

      await upsertSubscription({
        userId,
        plan: safePlan,
        status: subscription.status,
        customerId:
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id ?? null,
        subscriptionId: subscription.id ?? null,
      });
    }
  }

  if (
    event.type === "customer.subscription.deleted" ||
    event.type === "customer.subscription.paused"
  ) {
    const subscription = event.data.object as any;

    const userId = subscription.metadata?.user_id;

    if (userId) {
      await upsertSubscription({
        userId,
        plan: "free",
        status: subscription.status ?? "canceled",
        customerId:
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id ?? null,
        subscriptionId: subscription.id ?? null,
      });
    }
  }

  if (
    event.type === "invoice.payment_failed" ||
    event.type === "customer.subscription.pending_update_expired"
  ) {
    const invoice = event.data.object as any;

    const subscriptionId =
      typeof invoice.subscription === "string"
        ? invoice.subscription
        : invoice.subscription?.id;

    if (subscriptionId) {
      await supabaseAdmin
        .from("subscriptions")
        .update({
          plan: "free",
          status: "payment_failed",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", subscriptionId);
    }
  }

  return NextResponse.json({ received: true });
}