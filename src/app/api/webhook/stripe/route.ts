import { NextRequest, NextResponse } from "next/server";
import { stripe, handleWebhook, getStripeClient } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Assinatura do Stripe nao encontrada" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const s = getStripeClient();
    event = s.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Assinatura invalida" },
      { status: 400 }
    );
  }

  try {
    await handleWebhook(event);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
