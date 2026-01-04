"use client";

import { Header } from "@/components/Header";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function GeneratePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(
    session?.user?.imageCredits ?? null
  );

  const handleStartGeneration = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/start-generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to start generation");
      }

      setCreditsRemaining(data.creditsRemaining);

      // Update session to reflect new credit count
      if (session?.user) {
        session.user.imageCredits = data.creditsRemaining;
      }

      // Redirect to HuggingFace Space
      window.open(data.redirectUrl, "_blank");

      // Show success message
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sign in to Generate Images
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You need to be signed in to generate images
            </p>
            <Link
              href="/auth/signin"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              AI Image Editor
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Each generation session costs 1 credit and gives you unlimited edits until you're done
            </p>
            <div className="mt-4">
              <span className="px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full font-semibold">
                {creditsRemaining !== null ? creditsRemaining : session.user?.imageCredits || 0} credits remaining
              </span>
            </div>
            {(creditsRemaining === 0 || session.user?.imageCredits === 0) && (
              <div className="mt-4">
                <Link
                  href="/pricing"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                  Buy more credits
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="space-y-6">
              {/* Info Box */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  How it works:
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-300">
                  <li>Click "Start Generation Session" to use 1 credit</li>
                  <li>You'll be redirected to our AI Image Editor</li>
                  <li>Upload images, create edits, and experiment freely</li>
                  <li>Generate as many images as you want in this session</li>
                  <li>When done, close the editor or navigate back here</li>
                </ol>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {error}
                  </p>
                </div>
              )}

              {/* Start Generation Button */}
              <button
                onClick={handleStartGeneration}
                disabled={loading || (session.user?.imageCredits === 0 && creditsRemaining === 0)}
                className="w-full py-4 px-6 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Starting Session..." : "Start Generation Session (1 credit)"}
              </button>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    7 Style Options
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Photo-to-Anime, Upscaler, Style Transfer, Manga Tone, and more
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Powered by Qwen
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    State-of-the-art AI image editing with 70GB VRAM
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Unlimited Edits
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    One credit per session - generate as many variations as you need
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Fast Processing
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    High-priority GPU access with PRO tier performance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
