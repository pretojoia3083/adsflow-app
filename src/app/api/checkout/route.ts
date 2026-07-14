import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

const PLANS: Record<string, { name: string; amount: number; interval: string; intervalCount: number }> = {
  mensal: { name: "AdsFlow Mensal", amount: 5990, interval: "month", intervalCount: 1 },
  semestral: { name: "AdsFlow 6 Meses", amount: 29990, interval: "month", intervalCount: 6 },
  anual: { name: "AdsFlow Anual", amount: 59990, interval: "year", intervalCount: 1 },
};

export async function POST(req: NextRequest) {
  const { plan } = await req.json();

  if (!plan || !PLANS[plan]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const stripe = getStripe();
  const selected = PLANS[plan];
  const origin = req.headers.get("origin") || "https://adsflow-app-git-master-rotaflex.vercel.app";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card", "boleto", "pix"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: { name: selected.name },
            unit_amount: selected.amount,
            recurring: { interval: selected.interval as "month" | "year", interval_count: selected.intervalCount },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
      locale: "pt-BR",
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro ao criar sessao";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
