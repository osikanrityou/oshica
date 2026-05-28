/**
 * Stripe integration placeholder for future Pro billing.
 * Implement checkout, portal, and webhook handlers in Phase 3.
 */
export const STRIPE_PLANS = {
  free: { name: "Free", priceId: null },
  pro: { name: "Pro", priceId: process.env.STRIPE_PRO_PRICE_ID ?? null },
} as const;

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  );
}
