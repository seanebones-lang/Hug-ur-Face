import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import bcrypt from "bcryptjs";
import { logger, logAuth } from "./logger";

// Brute force protection: check failed login attempts
async function checkFailedAttempts(email: string): Promise<boolean> {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  const recentAttempts = await db.failedLoginAttempt.count({
    where: {
      email,
      timestamp: { gte: fifteenMinutesAgo }
    }
  });

  return recentAttempts < 5; // Allow up to 5 attempts in 15 minutes
}

// Log failed login attempt
async function logFailedAttempt(email: string, ipAddress: string = 'unknown') {
  await db.failedLoginAttempt.create({
    data: { email, ipAddress, timestamp: new Date() }
  });
}

// Clear failed attempts on successful login
async function clearFailedAttempts(email: string) {
  await db.failedLoginAttempt.deleteMany({
    where: { email }
  });
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;

        // Check for too many failed attempts
        const canAttempt = await checkFailedAttempts(email);
        if (!canAttempt) {
          logAuth.login(email, false);
          throw new Error("Too many failed login attempts. Please try again in 15 minutes.");
        }

        const user = await db.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            emailVerified: true,
            imageCredits: true,
            totalPurchased: true,
            sessionVersion: true,
          }
        });

        if (!user || !user.password) {
          await logFailedAttempt(email);
          logAuth.login(email, false);
          return null;
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in. Check your inbox for the verification link.");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) {
          await logFailedAttempt(email);
          logAuth.login(email, false);
          return null;
        }

        // Clear failed attempts on successful login
        await clearFailedAttempts(email);
        logAuth.login(email, true);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          imageCredits: user.imageCredits,
          totalPurchased: user.totalPurchased,
          sessionVersion: user.sessionVersion,
        };
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        // Initial login: set all data from user object
        token.id = user.id;
        token.imageCredits = (user as any).imageCredits;
        token.totalPurchased = (user as any).totalPurchased;
        token.sessionVersion = (user as any).sessionVersion;
        token.lastRefresh = Date.now();
      }

      // Refresh session data every 5 minutes
      const lastRefresh = (token.lastRefresh as number) || 0;
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (trigger === "update" || now - lastRefresh > fiveMinutes) {
        try {
          const dbUser = await db.user.findUnique({
            where: { id: token.id as string },
            select: {
              imageCredits: true,
              totalPurchased: true,
              sessionVersion: true,
            },
          });

          if (dbUser) {
            // Check if session was invalidated
            if (token.sessionVersion !== dbUser.sessionVersion) {
              logger.warn({ userId: token.id }, 'Session invalidated - forcing logout');
              return null; // Force logout
            }

            token.imageCredits = dbUser.imageCredits;
            token.totalPurchased = dbUser.totalPurchased;
            token.lastRefresh = now;
          }
        } catch (error) {
          logger.error({ error, userId: token.id }, 'Failed to refresh session data');
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Use cached values from token instead of DB query
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.imageCredits = token.imageCredits as number;
        session.user.totalPurchased = token.totalPurchased as number;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
  trustHost: true,
});

// Utility function to invalidate all user sessions
export async function invalidateUserSessions(userId: string) {
  await db.user.update({
    where: { id: userId },
    data: { sessionVersion: { increment: 1 } }
  });
  logger.info({ userId }, 'All user sessions invalidated');
}
