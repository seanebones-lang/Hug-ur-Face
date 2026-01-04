"use client";

import { Header } from "@/components/Header";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function GeneratePage() {
  const { data: session, status } = useSession();

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
              AI Image Editor
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Upload an image and describe your edits - our AI will transform it
            </p>
            <div className="mt-4">
              <span className="px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full font-semibold">
                {session.user?.imageCredits || 0} credits remaining
              </span>
            </div>
            {session.user?.imageCredits === 0 && (
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

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <iframe
              src="https://bizbots-qwen-image-editor.hf.space"
              frameBorder="0"
              width="100%"
              height="900"
              className="w-full"
              title="AI Image Editor"
            />
          </div>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Each image generation uses 1 credit. Need more? <Link href="/pricing" className="text-blue-600 hover:underline">View pricing</Link></p>
          </div>
        </div>
      </main>
    </div>
  );
}
