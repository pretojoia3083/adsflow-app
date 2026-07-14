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
  mensal: { amount: 5990, interval: "month" as const, intervalCount: 1, name: "AdsFlow Mensal" },
  semestral: { amount: 29990, interval: "month" as const, intervalCount: 6, name: "AdsFlow 6 Meses" },
  anual: { amount: 59990, interval: "year" as const, intervalCount: 1, name: "AdsFlow Anual" },
} as const;
