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
  isCurrentPlan?: boolean;
}

export function PricingCard({
  name,
  description,
  price,
  features,
  planKey,
  isCurrentPlan,
}: PricingCardProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!session) {
      window.location.href = "/auth/signin";
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
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

  const isPro = planKey === "PRO";
  const isEnterprise = price === null;

  return (
    <div
      className={`relative flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg ${
        isPro ? "ring-2 ring-blue-500" : ""
      }`}
    >
      {isPro && (
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
        {isEnterprise ? (
          <span className="text-4xl font-bold text-gray-900 dark:text-white">
            Custom
          </span>
        ) : (
          <>
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              ${price}
            </span>
            <span className="text-gray-500 dark:text-gray-400">/month</span>
          </>
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

      {isCurrentPlan ? (
        <button
          disabled
          className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg font-medium cursor-not-allowed"
        >
          Current Plan
        </button>
      ) : isEnterprise ? (
        <a
          href="mailto:sales@example.com"
          className="w-full py-3 px-4 text-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Contact Sales
        </a>
      ) : price === 0 ? (
        <button
          disabled
          className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg font-medium cursor-not-allowed"
        >
          Free Forever
        </button>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isPro
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? "Loading..." : "Subscribe"}
        </button>
      )}
    </div>
  );
}
