"use client";

import { useEffect, useState } from "react";

interface UsageData {
  tier: string;
  usageCount: number;
  limit: number;
  remaining: number;
  resetAt: string;
  subscriptionEnd: string | null;
}

export function UsageStats() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch("/api/usage");
        if (response.ok) {
          const data = await response.json();
          setUsage(data);
        }
      } catch (error) {
        console.error("Failed to fetch usage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    );
  }

  if (!usage) {
    return null;
  }

  const percentage =
    usage.limit === -1 ? 100 : (usage.usageCount / usage.limit) * 100;
  const resetDate = new Date(usage.resetAt);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Usage Statistics
        </h3>
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
          {usage.tier}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">
              API Calls Today
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {usage.limit === -1
                ? `${usage.usageCount} (Unlimited)`
                : `${usage.usageCount} / ${usage.limit}`}
            </span>
          </div>

          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                percentage >= 90
                  ? "bg-red-500"
                  : percentage >= 70
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Resets at: {resetDate.toLocaleString()}
        </div>

        {usage.subscriptionEnd && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Subscription renews:{" "}
            {new Date(usage.subscriptionEnd).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
