import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Only process payment mode (one-time purchases), not subscriptions
        if (session.mode === "payment") {
          await handlePaymentCompleted(session);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const bundleType = session.metadata?.bundleType;
  const creditsStr = session.metadata?.credits;

  if (!userId || !bundleType || !creditsStr) {
    console.error("Missing metadata in session", session.metadata);
    return;
  }

  const credits = parseInt(creditsStr);
  const amountPaid = (session.amount_total ?? 0) / 100; // Convert cents to dollars

  // Add credits to user
  const user = await db.user.update({
    where: { id: userId },
    data: {
      imageCredits: {
        increment: credits,
      },
      totalPurchased: {
        increment: credits,
      },
      stripeCustomerId: session.customer as string,
    },
  });

  // Record the purchase
  await db.purchase.create({
    data: {
      userId,
      stripePaymentId: session.payment_intent as string,
      bundleType,
      creditsAdded: credits,
      amountPaid,
    },
  });

  console.log(`User ${userId} purchased ${credits} credits (${bundleType} bundle). New balance: ${user.imageCredits}`);
}
