import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PLANS } from "@/lib/stripe";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        subscriptionTier: true,
        usageCount: true,
        usageResetAt: true,
        stripeCurrentPeriodEnd: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const plan = PLANS[user.subscriptionTier];
    const limit = plan.limits.dailyCalls;
    const remaining = limit === -1 ? -1 : Math.max(0, limit - user.usageCount);

    return NextResponse.json({
      tier: user.subscriptionTier,
      usageCount: user.usageCount,
      limit,
      remaining,
      resetAt: user.usageResetAt,
      subscriptionEnd: user.stripeCurrentPeriodEnd,
    });
  } catch (error) {
    console.error("Usage fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { feature, spaceId, metadata } = body;

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if usage reset is needed (daily reset)
    const now = new Date();
    const resetAt = new Date(user.usageResetAt);
    const shouldReset = now.getTime() - resetAt.getTime() > 24 * 60 * 60 * 1000;

    let currentUsage = shouldReset ? 0 : user.usageCount;

    // Check usage limits
    const plan = PLANS[user.subscriptionTier];
    const limit = plan.limits.dailyCalls;

    if (limit !== -1 && currentUsage >= limit) {
      return NextResponse.json(
        {
          error: "Usage limit exceeded",
          limit,
          usage: currentUsage,
          resetAt: shouldReset ? now : user.usageResetAt,
        },
        { status: 429 }
      );
    }

    // Increment usage and log access
    await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: {
          usageCount: currentUsage + 1,
          usageResetAt: shouldReset ? now : user.usageResetAt,
        },
      }),
      db.accessLog.create({
        data: {
          userId: user.id,
          feature: feature ?? "api_call",
          spaceId,
          metadata,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      usage: currentUsage + 1,
      limit,
      remaining: limit === -1 ? -1 : limit - (currentUsage + 1),
    });
  } catch (error) {
    console.error("Usage increment error:", error);
    return NextResponse.json(
      { error: "Failed to record usage" },
      { status: 500 }
    );
  }
}
