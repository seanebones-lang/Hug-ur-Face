"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

interface PricingCardProps {
  name: string;
  description: string;
  price: number | null;
  priceId: string | null;
  features: string[];
  planKey: string;
  credits?: number;
  popular?: boolean;
}

export function PricingCard({
  name,
  description,
  price,
  features,
  planKey,
  credits,
  popular,
}: PricingCardProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!session) {
      window.location.href = "/auth/signin";
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundle: planKey }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg ${
        popular ? "ring-2 ring-blue-500" : ""
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {name}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">
          ${price}
        </span>
        {credits && (
          <div className="mt-2">
            <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {credits} {credits === 1 ? "credit" : "credits"}
            </span>
          </div>
        )}
      </div>

      <ul className="mb-8 space-y-3 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={handlePurchase}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          popular
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? "Loading..." : "Buy Credits"}
      </button>
    </div>
  );
}
