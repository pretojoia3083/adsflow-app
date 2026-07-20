import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeInstance) return stripeInstance;

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-27.basil",
  });

  return stripeInstance;
}

export const PLAN_PRICES = {
  basico: { amount: 3000, interval: "month" as const, intervalCount: 1, name: "AdsFlow Basico", plan: "BASICO" },
  pro: { amount: 5000, interval: "month" as const, intervalCount: 1, name: "AdsFlow Pro", plan: "PRO" },
} as const;

export function getPlanFromAmount(amount: number): string {
  if (amount === 5000) return "PRO";
  return "BASICO";
}
