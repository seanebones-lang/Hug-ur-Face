import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  // Verify cron secret for Vercel Cron Jobs
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Reset usage counts for all users where reset is due
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await db.user.updateMany({
      where: {
        usageResetAt: {
          lt: oneDayAgo,
        },
      },
      data: {
        usageCount: 0,
        usageResetAt: new Date(),
      },
    });

    console.log(`Reset usage for ${result.count} users`);

    return NextResponse.json({
      success: true,
      usersReset: result.count,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Failed to reset usage" },
      { status: 500 }
    );
  }
}
