"use server";

import { redirect } from "next/navigation";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

type Plan = "plus" | "premium";

const priceIds: Record<Plan, string | undefined> = {
  plus: process.env.STRIPE_PLUS_PRICE_ID,
  premium: process.env.STRIPE_PREMIUM_PRICE_ID,
};

const supabaseAdmin = createSupabaseAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function createCheckoutSession(formData: FormData) {
  const plan = formData.get("plan");

  if (plan !== "plus" && plan !== "premium") {
    redirect("/settings/billing");
  }

  const priceId = priceIds[plan];

  if (!priceId) {
    throw new Error("StripeのPrice IDが設定されていません");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/settings/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/settings/billing?checkout=cancel`,
    metadata: {
      user_id: user.id,
      plan,
    },
    subscription_data: {
      metadata: {
        user_id: user.id,
        plan,
      },
    },
  });

  if (!session.url) {
    throw new Error("Stripe CheckoutのURLを作成できませんでした");
  }

  redirect(session.url);
}

export async function syncCheckoutSession(sessionId: string) {
  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  const userId = session.metadata?.user_id;
  const plan = session.metadata?.plan;

  if (userId !== user.id) {
    return;
  }

  if (plan !== "plus" && plan !== "premium") {
    return;
  }

  const subscription =
    typeof session.subscription === "string" ? null : session.subscription;

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: userId,
      plan,
      status: subscription?.status ?? "active",
      stripe_customer_id:
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id,
      stripe_subscription_id: subscriptionId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
}

export async function createBillingPortalSession() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const customerId = subscription?.stripe_customer_id;

  if (!customerId) {
    redirect("/settings/billing");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/settings/billing`,
  });

  if (!session.url) {
    throw new Error("Stripe Customer Portalを作成できませんでした");
  }

  redirect(session.url);
}