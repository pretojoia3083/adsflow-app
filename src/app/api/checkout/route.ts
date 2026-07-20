import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLAN_PRICES } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });

  if (user?.plan === "BASICO" || user?.plan === "PRO") {
    return NextResponse.json({ error: "Voce ja possui um plano ativo. Acesse o portal de gerenciamento para alterar." }, { status: 400 });
  }

  const { plan } = await req.json();

  if (!plan || !(plan in PLAN_PRICES)) {
    return NextResponse.json({ error: "Plano invalido" }, { status: 400 });
  }

  const stripe = getStripe();
  const selected = PLAN_PRICES[plan as keyof typeof PLAN_PRICES];
  const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const userEmail = session.user.email;
    const userId = session.user.id;

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: userEmail,
      metadata: { userId, plan: selected.plan },
      payment_method_types: ["card", "boleto", "pix"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: selected.name,
              description: `AdsFlow - ${selected.name}`,
            },
            unit_amount: selected.amount,
            recurring: {
              interval: selected.interval,
              interval_count: selected.intervalCount,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
      locale: "pt-BR",
      billing_address_collection: "auto",
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro ao criar sessao de pagamento";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
