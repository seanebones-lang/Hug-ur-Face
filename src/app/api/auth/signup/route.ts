import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "@/lib/db";
import { getClientIp } from "@/lib/ip";
import { sendVerificationEmail } from "@/lib/email";
import { validatePassword } from "@/lib/password";
import { signupRateLimit } from "@/lib/ratelimit";
import { logAuth } from "@/lib/logger";

const MAX_ACCOUNTS_PER_IP = 3; // Maximum accounts allowed per IP
const LOOKBACK_DAYS = 30; // Check signups in the last 30 days

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
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

    // Get client IP
    const ipAddress = await getClientIp();

    // Rate limit signups per IP (3 per hour)
    if (signupRateLimit) {
      const { success, limit, remaining } = await signupRateLimit.limit(ipAddress);
      if (!success) {
        logAuth.signup(email, false, ipAddress);
        return NextResponse.json(
          {
            error: `Too many signup attempts from your network. Please try again later.`,
            limit,
            remaining
          },
          { status: 429 }
        );
      }
    }

    // Log signup attempt
    await db.signupAttempt.create({
      data: {
        ipAddress,
        email,
        success: false,
      },
    });

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Check how many successful signups from this IP in the last X days
    const lookbackDate = new Date();
    lookbackDate.setDate(lookbackDate.getDate() - LOOKBACK_DAYS);

    const recentSignupsFromIp = await db.signupAttempt.count({
      where: {
        ipAddress,
        success: true,
        createdAt: {
          gte: lookbackDate,
        },
      },
    });

    if (recentSignupsFromIp >= MAX_ACCOUNTS_PER_IP) {
      return NextResponse.json(
        {
          error: `Maximum number of accounts (${MAX_ACCOUNTS_PER_IP}) reached from your network. Please contact support if you need assistance.`,
        },
        { status: 429 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Token valid for 24 hours

    // Create user without credits (will be added after verification)
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split("@")[0],
        imageCredits: 0, // No credits until email verified
        signupIp: ipAddress,
      },
    });

    // Create verification token
    await db.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: tokenExpiry,
      },
    });

    // Send verification email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
    const emailResult = await sendVerificationEmail(
      email,
      verificationToken,
      baseUrl
    );

    if (!emailResult.success) {
      // If email fails, delete the user and token
      await db.user.delete({ where: { id: user.id } });
      await db.verificationToken.delete({
        where: { token: verificationToken },
      });

      return NextResponse.json(
        {
          error: "Failed to send verification email. Please try again or use a different email address.",
        },
        { status: 500 }
      );
    }

    // Mark signup as successful
    await db.signupAttempt.updateMany({
      where: {
        ipAddress,
        email,
        success: false,
      },
      data: {
        success: true,
      },
    });

    logAuth.signup(email, true, ipAddress);

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created! Please check your email to verify your account and receive 3 free credits.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create account",
      },
      { status: 500 }
    );
  }
}
