import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});

// Credit bundle pricing for pay-per-image model
export const BUNDLES = {
  SINGLE: {
    id: "single",
    name: "Single Image",
    description: "Pay as you go",
    price: 0.50,
    priceId: process.env.STRIPE_SINGLE_IMAGE_PRICE_ID,
    credits: 1,
    pricePerImage: 0.50,
    features: [
      "1 high-res image generation",
      "Full quality output",
      "No commitment",
    ],
  },
  STARTER: {
    id: "starter",
    name: "Starter Bundle",
    description: "Best for trying out",
    price: 19.99,
    priceId: process.env.STRIPE_STARTER_BUNDLE_PRICE_ID,
    credits: 50,
    pricePerImage: 0.40,
    features: [
      "50 high-res image generations",
      "$0.40 per image (20% savings)",
      "Credits never expire",
      "Full quality output",
    ],
    popular: false,
  },
  CREATOR: {
    id: "creator",
    name: "Creator Bundle",
    description: "Most popular choice",
    price: 49.99,
    priceId: process.env.STRIPE_CREATOR_BUNDLE_PRICE_ID,
    credits: 150,
    pricePerImage: 0.33,
    features: [
      "150 high-res image generations",
      "$0.33 per image (34% savings)",
      "Credits never expire",
      "Full quality output",
      "Priority processing",
    ],
    popular: true,
  },
  PROFESSIONAL: {
    id: "professional",
    name: "Professional Bundle",
    description: "Best value for power users",
    price: 99.99,
    priceId: process.env.STRIPE_PROFESSIONAL_BUNDLE_PRICE_ID,
    credits: 350,
    pricePerImage: 0.29,
    features: [
      "350 high-res image generations",
      "$0.29 per image (42% savings)",
      "Credits never expire",
      "Full quality output",
      "Priority processing",
      "Bulk generation support",
    ],
    popular: false,
  },
} as const;

export type BundleKey = keyof typeof BUNDLES;

export function getBundleByPriceId(priceId: string): BundleKey | null {
  for (const [key, bundle] of Object.entries(BUNDLES)) {
    if (bundle.priceId === priceId) {
      return key as BundleKey;
    }
  }
  return null;
}

export function getCreditsByPriceId(priceId: string): number {
  const bundle = Object.values(BUNDLES).find(b => b.priceId === priceId);
  return bundle?.credits ?? 0;
}
