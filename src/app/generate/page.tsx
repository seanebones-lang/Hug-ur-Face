"use client";

import { Header } from "@/components/Header";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function GeneratePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(
    session?.user?.imageCredits ?? null
  );
  const [canUseSpace, setCanUseSpace] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUnlockGenerator = async () => {
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
        throw new Error(data.error || data.message || "Failed to unlock generator");
      }

      setCreditsRemaining(data.creditsRemaining);
      setCanUseSpace(true);

      // Update session
      if (session?.user) {
        session.user.imageCredits = data.creditsRemaining;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Transform Any Image with the Most Advanced AI Image System in the World
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-4xl mx-auto mb-4">
              From photo-to-anime transformations to 4K upscaling, lighting migration to pose control - perform any visual adjustment imaginable. What once required teams of professional artists and expensive software now happens in seconds.
            </p>
            <div className="mt-4">
              <span className="px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full font-semibold">
                {creditsRemaining !== null ? creditsRemaining : session.user?.imageCredits || 0} credits remaining
              </span>
            </div>
          </div>

          {/* Generator Access Control */}
          {!canUseSpace ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Transform Your Images?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Click below to unlock the AI Image Editor. You'll be able to upload images, choose from 7 different styles (Photo-to-Anime, Upscaler, Style Transfer, and more), and generate unlimited edits during this session.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              <button
                onClick={handleUnlockGenerator}
                disabled={loading || (session.user?.imageCredits === 0 && creditsRemaining === 0)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {loading ? "Unlocking..." : "Unlock Generator (1 Credit)"}
              </button>

              {(creditsRemaining === 0 || session.user?.imageCredits === 0) && (
                <div className="mt-6">
                  <Link
                    href="/pricing"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                  >
                    Purchase Credits →
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
              <div className="mb-4 flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Powered by Qwen Image Editor • Credits remaining: {creditsRemaining}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-semibold">
                  ✓ Unlocked
                </span>
              </div>
              <iframe
                src="https://bizbots-qwen-image-editor.hf.space"
                frameBorder="0"
                width="100%"
                height="900"
                className="rounded-lg border-2 border-green-500"
              ></iframe>
              <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                You can generate multiple images during this session
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
