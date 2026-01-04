import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { db } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        // Fetch subscription info
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: {
            subscriptionTier: true,
            stripeCurrentPeriodEnd: true,
            usageCount: true,
            usageResetAt: true,
          },
        });

        if (dbUser) {
          session.user.subscriptionTier = dbUser.subscriptionTier;
          session.user.stripeCurrentPeriodEnd = dbUser.stripeCurrentPeriodEnd;
          session.user.usageCount = dbUser.usageCount;
          session.user.usageResetAt = dbUser.usageResetAt;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "database",
  },
});
