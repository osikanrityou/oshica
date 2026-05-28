import { NextResponse } from "next/server";

/**
 * Stripe webhook handler (Phase 3).
 * Verify signature with STRIPE_WEBHOOK_SECRET and sync subscriptions table.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 501 },
    );
  }

  await request.text();
  return NextResponse.json({ received: true });
}
