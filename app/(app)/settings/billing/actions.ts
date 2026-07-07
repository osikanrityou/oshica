"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

type Plan = "plus" | "premium";

const priceIds: Record<Plan, string | undefined> = {
  plus: process.env.STRIPE_PLUS_PRICE_ID,
  premium: process.env.STRIPE_PREMIUM_PRICE_ID,
};

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
    success_url: `${appUrl}/settings/billing?checkout=success`,
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