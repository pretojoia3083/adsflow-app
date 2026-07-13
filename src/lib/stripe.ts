import Stripe from "stripe";

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (_stripe) return _stripe;
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18.acacia",
    typescript: true,
  });
  return _stripe;
}

export const PLANS = {
  FREE: {
    name: "Gratuito",
    price: 0,
    features: [
      "3 campanhas por mes",
      "Analise de mercado basica",
      "Copy gerada por IA",
      "Presell basica",
    ],
  },
  PRO: {
    name: "Pro",
    price: 49,
    priceId: process.env.STRIPE_PRICE_ID,
    features: [
      "Campanhas ilimitadas",
      "Analise de mercado avancada",
      "Copy otimizada por IA",
      "Presell personalizada",
      "Integracao Meta Ads",
      "Suporte prioritario",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 199,
    features: [
      "Tudo do Pro",
      "API access",
      "White-label",
      "Gerente de conta dedicado",
      "SLA garantido",
    ],
  },
} as const;

export async function createCheckoutSession(userId: string, email: string) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    customer_email: email,
    line_items: [
      {
        price: PLANS.PRO.priceId!,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
    metadata: {
      userId,
    },
  });

  return session;
}

export async function createPortalSession(stripeCustomerId: string) {
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return session;
}

export async function handleWebhook(event: Stripe.Event) {
  const { prisma } = await import("./prisma");

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.metadata?.userId) {
        await prisma.user.update({
          where: { id: session.metadata.userId },
          data: {
            plan: "PRO",
            stripeCustomerId: session.customer as string,
          },
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: subscription.customer as string },
      });
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { plan: "FREE" },
        });
      }
      break;
    }
  }
}

export function getStripeClient(): Stripe {
  return getStripe();
}
