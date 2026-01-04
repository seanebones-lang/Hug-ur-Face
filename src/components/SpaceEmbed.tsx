"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface SpaceEmbedProps {
  spaceId: string;
  title?: string;
  requiredTier?: "FREE" | "BASIC" | "PRO" | "ENTERPRISE";
}

interface AccessState {
  loading: boolean;
  hasAccess: boolean;
  error: string | null;
  action: "signin" | "upgrade" | null;
  embedUrl: string | null;
  usage?: {
    count: number;
    limit: number;
    remaining: number;
  };
}

export function SpaceEmbed({
  spaceId,
  title,
  requiredTier = "FREE",
}: SpaceEmbedProps) {
  const { data: session, status } = useSession();
  const [accessState, setAccessState] = useState<AccessState>({
    loading: true,
    hasAccess: false,
    error: null,
    action: null,
    embedUrl: null,
  });

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch(`/api/spaces/${encodeURIComponent(spaceId)}`);
        const data = await response.json();

        if (response.ok && data.access) {
          setAccessState({
            loading: false,
            hasAccess: true,
            error: null,
            action: null,
            embedUrl: data.embedUrl,
            usage: data.usage,
          });
        } else {
          setAccessState({
            loading: false,
            hasAccess: false,
            error: data.error || "Access denied",
            action: data.action,
            embedUrl: null,
          });
        }
      } catch {
        setAccessState({
          loading: false,
          hasAccess: false,
          error: "Failed to check access",
          action: null,
          embedUrl: null,
        });
      }
    };

    if (status !== "loading") {
      checkAccess();
    }
  }, [spaceId, status]);

  const handleUseSpace = async () => {
    try {
      await fetch("/api/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature: "space_access", spaceId }),
      });
    } catch (error) {
      console.error("Failed to record usage:", error);
    }
  };

  if (status === "loading" || accessState.loading) {
    return (
      <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!accessState.hasAccess) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 mb-4 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title || "Premium Space"}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          {accessState.error === "Usage limit exceeded" ||
          accessState.error === "Daily usage limit reached"
            ? "You've reached your daily usage limit. Upgrade your plan for unlimited access."
            : accessState.action === "signin"
            ? "Sign in to access this HuggingFace Space."
            : `This space requires a ${requiredTier} subscription or higher.`}
        </p>

        {accessState.action === "signin" ? (
          <Link
            href="/auth/signin"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign In to Access
          </Link>
        ) : (
          <Link
            href="/pricing"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Pricing Plans
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {accessState.usage && accessState.usage.limit !== -1 && (
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Usage: {accessState.usage.count} / {accessState.usage.limit} calls
            today
          </span>
          <span className="text-gray-500">
            {accessState.usage.remaining} remaining
          </span>
        </div>
      )}

      <iframe
        src={accessState.embedUrl!}
        className="w-full aspect-video rounded-lg border border-gray-200 dark:border-gray-700"
        allow="accelerometer; camera; microphone; clipboard-write"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        onLoad={handleUseSpace}
      />
    </div>
  );
}
