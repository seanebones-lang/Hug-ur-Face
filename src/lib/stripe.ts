import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});

// Subscription tier pricing
export const PLANS = {
  FREE: {
    name: "Free",
    description: "Basic access with limited usage",
    price: 0,
    priceId: null,
    features: [
      "5 API calls per day",
      "Basic model access",
      "Community support",
    ],
    limits: {
      dailyCalls: 5,
      maxResolution: "512x512",
    },
  },
  BASIC: {
    name: "Basic",
    description: "For hobbyists and small projects",
    price: 9.99,
    priceId: process.env.STRIPE_BASIC_PRICE_ID,
    features: [
      "100 API calls per day",
      "Standard model access",
      "Email support",
      "Higher resolution outputs",
    ],
    limits: {
      dailyCalls: 100,
      maxResolution: "1024x1024",
    },
  },
  PRO: {
    name: "Pro",
    description: "For professionals and teams",
    price: 29.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      "Unlimited API calls",
      "Premium model access",
      "Priority support",
      "Maximum resolution outputs",
      "API access",
    ],
    limits: {
      dailyCalls: -1, // unlimited
      maxResolution: "2048x2048",
    },
  },
  ENTERPRISE: {
    name: "Enterprise",
    description: "Custom solutions for large organizations",
    price: null, // Contact sales
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      "Everything in Pro",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "On-premise options",
    ],
    limits: {
      dailyCalls: -1,
      maxResolution: "4096x4096",
    },
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlanByPriceId(priceId: string): PlanKey | null {
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.priceId === priceId) {
      return key as PlanKey;
    }
  }
  return null;
}
