import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "Nenhuma assinatura encontrada" }, { status: 400 });
  }

  const stripe = getStripe();
  const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${origin}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro ao criar portal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
