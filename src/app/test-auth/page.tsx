"use client";

import { useSession } from "next-auth/react";

export default function TestAuthPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen p-8 bg-white">
      <h1 className="text-2xl font-bold mb-4">Auth Test</h1>

      <div className="space-y-4">
        <div>
          <strong>Status:</strong> {status}
        </div>

        <div>
          <strong>Session:</strong> {session ? "YES" : "NO"}
        </div>

        {session && (
          <div>
            <strong>User Email:</strong> {session.user?.email}
            <br />
            <strong>User ID:</strong> {session.user?.id}
            <br />
            <strong>Credits:</strong> {session.user?.imageCredits}
          </div>
        )}

        {status === "unauthenticated" && (
          <div>
            <a href="/auth/signin" className="text-blue-600 underline">
              Sign In
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
