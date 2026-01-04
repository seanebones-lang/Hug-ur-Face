"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              HF Monetizer
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                Pricing
              </Link>
              <Link
                href="/spaces"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                Spaces
              </Link>
              {session && (
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {status === "loading" ? (
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {session.user?.email}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                  {session.user?.subscriptionTier}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
