import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authRateLimit } from "@/lib/ratelimit";
import { getClientIp } from "@/lib/ip";
import { validatePassword } from "@/lib/password";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    // Rate limit password reset attempts (5 per 10 minutes per IP)
    if (authRateLimit) {
      const ipAddress = await getClientIp();
      const { success } = await authRateLimit.limit(ipAddress);

      if (!success) {
        return NextResponse.json(
          { error: "Too many password reset attempts. Please try again in 10 minutes." },
          { status: 429 }
        );
      }
    }

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Find user with valid token
    const user = await db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Token must not be expired
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully. You can now sign in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
