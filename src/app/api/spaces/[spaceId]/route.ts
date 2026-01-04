import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PLANS } from "@/lib/stripe";

interface RouteParams {
  params: Promise<{ spaceId: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { spaceId } = await params;
    const session = await auth();

    // Basic access check - can be customized per space
    const requiresAuth = true; // Configure based on space settings
    const requiredTier = "FREE"; // Minimum tier required

    if (requiresAuth && !session?.user?.id) {
      return NextResponse.json(
        {
          error: "Authentication required",
          action: "signin",
        },
        { status: 401 }
      );
    }

    if (session?.user?.id) {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Check subscription tier
      const tierOrder = ["FREE", "BASIC", "PRO", "ENTERPRISE"];
      const userTierIndex = tierOrder.indexOf(user.subscriptionTier);
      const requiredTierIndex = tierOrder.indexOf(requiredTier);

      if (userTierIndex < requiredTierIndex) {
        return NextResponse.json(
          {
            error: "Subscription upgrade required",
            currentTier: user.subscriptionTier,
            requiredTier,
            action: "upgrade",
          },
          { status: 403 }
        );
      }

      // Check usage limits
      const plan = PLANS[user.subscriptionTier];
      const limit = plan.limits.dailyCalls;

      if (limit !== -1 && user.usageCount >= limit) {
        return NextResponse.json(
          {
            error: "Daily usage limit reached",
            limit,
            usage: user.usageCount,
            action: "upgrade",
          },
          { status: 429 }
        );
      }

      // Return space access info
      return NextResponse.json({
        access: true,
        spaceId,
        tier: user.subscriptionTier,
        usage: {
          count: user.usageCount,
          limit,
          remaining: limit === -1 ? -1 : limit - user.usageCount,
        },
        embedUrl: `https://huggingface.co/spaces/${spaceId}`,
      });
    }

    // Anonymous access for free spaces
    return NextResponse.json({
      access: !requiresAuth,
      spaceId,
      tier: "ANONYMOUS",
      embedUrl: `https://huggingface.co/spaces/${spaceId}`,
    });
  } catch (error) {
    console.error("Space access error:", error);
    return NextResponse.json(
      { error: "Failed to check space access" },
      { status: 500 }
    );
  }
}
