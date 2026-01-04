import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe, BUNDLES, BundleKey } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bundle } = body as { bundle: string };
    const bundleKey = bundle.toUpperCase() as BundleKey;

    if (!bundleKey || !BUNDLES[bundleKey] || !BUNDLES[bundleKey].priceId) {
      return NextResponse.json(
        { error: "Invalid bundle selected" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const selectedBundle = BUNDLES[bundleKey];

    // Create a one-time payment checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: selectedBundle.priceId!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&credits=${selectedBundle.credits}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      customer_email: user.email ?? undefined,
      metadata: {
        userId: user.id,
        bundleType: selectedBundle.id,
        credits: selectedBundle.credits.toString(),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
