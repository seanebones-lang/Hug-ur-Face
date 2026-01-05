import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Find the verification token
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await db.verificationToken.delete({
        where: { token },
      });

      return NextResponse.json(
        { error: "Verification token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Find the user
    const user = await db.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      // Delete the token
      await db.verificationToken.delete({
        where: { token },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Email already verified! You can sign in now.",
          alreadyVerified: true,
        },
        { status: 200 }
      );
    }

    // Update user: mark as verified and give 3 free credits
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        imageCredits: 3, // Give 3 free credits
      },
    });

    // Delete the verification token
    await db.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully! You've received 3 free credits. You can now sign in.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to verify email",
      },
      { status: 500 }
    );
  }
}
