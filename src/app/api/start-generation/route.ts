import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's current credits
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { imageCredits: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has credits
    if (user.imageCredits < 1) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          creditsRemaining: 0,
          message: "Please purchase more credits to continue generating images."
        },
        { status: 402 }
      );
    }

    // Deduct 1 credit
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        imageCredits: {
          decrement: 1,
        },
      },
    });

    // Log the generation start
    await db.accessLog.create({
      data: {
        userId: session.user.id,
        feature: "image_generation",
        spaceId: process.env.HF_SPACE_ID || "bizbots/nexteleven-image-editor",
        creditsUsed: 1,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      creditsRemaining: updatedUser.imageCredits,
      redirectUrl: "https://bizbots-nexteleven-image-editor.hf.space",
    });
  } catch (error) {
    console.error("Start generation error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
