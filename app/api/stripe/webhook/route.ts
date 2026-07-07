import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "署名がありません" }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET が未設定です" },
      { status: 500 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook署名の検証に失敗しました" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    const userId = session.metadata?.user_id;
    const plan = session.metadata?.plan;

    if (userId && (plan === "plus" || plan === "premium")) {
      await supabaseAdmin.from("subscriptions").upsert(
        {
          user_id: userId,
          plan,
          status: "active",
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as any;

    const userId = subscription.metadata?.user_id;
    const plan = subscription.metadata?.plan;

    if (userId && (plan === "plus" || plan === "premium")) {
      await supabaseAdmin.from("subscriptions").upsert(
        {
          user_id: userId,
          plan,
          status: subscription.status,
          stripe_customer_id: subscription.customer,
          stripe_subscription_id: subscription.id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as any;

    const userId = subscription.metadata?.user_id;

    if (userId) {
      await supabaseAdmin.from("subscriptions").upsert(
        {
          user_id: userId,
          plan: "free",
          status: "canceled",
          stripe_customer_id: subscription.customer,
          stripe_subscription_id: subscription.id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }
  }

  return NextResponse.json({ received: true });
}