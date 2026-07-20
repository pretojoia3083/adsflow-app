import { NextRequest, NextResponse } from "next/server";
import { getStripe, getPlanFromAmount } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (userId) {
          const stripe = getStripe();
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const amount = subscription.items.data[0]?.price?.unit_amount || 3000;
          const planName = getPlanFromAmount(amount);

          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeCustomerId: customerId,
              plan: planName,
            },
          });

          await prisma.subscription.upsert({
            where: { userId },
            create: {
              userId,
              stripeId: subscriptionId,
              status: subscription.status,
              priceId: subscription.items.data[0]?.price?.id || null,
              currentPeriod: new Date(subscription.current_period_end * 1000),
            },
            update: {
              stripeId: subscriptionId,
              status: subscription.status,
              priceId: subscription.items.data[0]?.price?.id || null,
              currentPeriod: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          const stripe = getStripe();
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const amount = subscription.items.data[0]?.price?.unit_amount || 3000;
          const planName = getPlanFromAmount(amount);

          const sub = await prisma.subscription.findFirst({ where: { stripeId: subscriptionId } });
          if (sub) {
            await prisma.user.update({
              where: { id: sub.userId },
              data: { plan: planName },
            });
          }

          await prisma.subscription.updateMany({
            where: { stripeId: subscriptionId },
            data: {
              status: subscription.status,
              currentPeriod: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          await prisma.subscription.updateMany({
            where: { stripeId: subscriptionId },
            data: { status: "past_due" },
          });

          const sub = await prisma.subscription.findFirst({ where: { stripeId: subscriptionId } });
          if (sub) {
            await prisma.user.update({
              where: { id: sub.userId },
              data: { plan: "FREE" },
            });
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.updateMany({
          where: { stripeId: subscription.id },
          data: {
            status: subscription.status,
            priceId: subscription.items.data[0]?.price?.id || null,
            currentPeriod: new Date(subscription.current_period_end * 1000),
            cancelAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
          },
        });

        if (subscription.status === "canceled" || subscription.status === "unpaid") {
          const sub = await prisma.subscription.findFirst({ where: { stripeId: subscription.id } });
          if (sub) {
            await prisma.user.update({
              where: { id: sub.userId },
              data: { plan: "FREE" },
            });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const sub = await prisma.subscription.findFirst({ where: { stripeId: subscription.id } });
        if (sub) {
          await prisma.user.update({
            where: { id: sub.userId },
            data: { plan: "FREE" },
          });

          await prisma.subscription.delete({ where: { id: sub.id } });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
