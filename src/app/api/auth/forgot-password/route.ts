import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { authRateLimit } from "@/lib/ratelimit";
import { getClientIp } from "@/lib/ip";
import { logAuth } from "@/lib/logger";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Rate limit forgot password attempts (5 per 10 minutes per IP)
    if (authRateLimit) {
      const ipAddress = await getClientIp();
      const { success } = await authRateLimit.limit(ipAddress);

      if (!success) {
        return NextResponse.json(
          { error: "Too many password reset requests. Please try again in 10 minutes." },
          { status: 429 }
        );
      }
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with that email, you will receive a password reset link.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token to database
    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send password reset email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pic.mothership-ai.com';
    const emailResult = await sendPasswordResetEmail(email, resetToken, baseUrl);

    if (!emailResult.success) {
      console.error("Failed to send password reset email:", emailResult.error);
      // Still return success to prevent email enumeration
    }

    logAuth.passwordReset(email);

    return NextResponse.json({
      success: true,
      message: "If an account exists with that email, you will receive a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
