import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import { authRateLimit } from "@/lib/ratelimit";
import { getClientIp } from "@/lib/ip";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Rate limit resend attempts
    if (authRateLimit) {
      const ipAddress = await getClientIp();
      const { success } = await authRateLimit.limit(ipAddress);
      
      if (!success) {
        return NextResponse.json(
          { error: "Too many verification requests. Please try again later." },
          { status: 429 }
        );
      }
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email }
    });

    // Don't reveal if user exists (security)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with that email, a new verification email has been sent."
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: "Email is already verified. You can sign in now.",
        alreadyVerified: true
      });
    }

    // Check rate limit (max 3 resends per hour per email)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentTokens = await db.verificationToken.count({
      where: {
        identifier: email,
        expires: { gte: oneHourAgo }
      }
    });

    if (recentTokens >= 3) {
      return NextResponse.json(
        { error: "Too many verification emails sent. Please try again in an hour." },
        { status: 429 }
      );
    }

    // Delete old tokens for this email
    await db.verificationToken.deleteMany({
      where: { identifier: email }
    });

    // Generate new token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    await db.verificationToken.create({
      data: { identifier: email, token, expires }
    });

    // Send email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const emailResult = await sendVerificationEmail(email, token, baseUrl);

    if (!emailResult.success) {
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "A new verification email has been sent. Please check your inbox."
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification email" },
      { status: 500 }
    );
  }
}
