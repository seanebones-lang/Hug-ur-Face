import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { UsageStats } from "@/components/UsageStats";
import { BillingPortalButton } from "@/components/BillingPortalButton";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PLANS } from "@/lib/stripe";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      accessLogs: {
        orderBy: { timestamp: "desc" },
        take: 10,
      },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const plan = PLANS[user.subscriptionTier];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your subscription and view usage statistics.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Subscription Card */}
            <div className="lg:col-span-2 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Current Plan
                </h2>
                <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                  {plan.name}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {plan.description}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Daily API Limit
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {plan.limits.dailyCalls === -1
                      ? "Unlimited"
                      : plan.limits.dailyCalls}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Max Resolution
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {plan.limits.maxResolution}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/pricing"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {user.subscriptionTier === "FREE"
                    ? "Upgrade Plan"
                    : "Change Plan"}
                </Link>
                {user.stripeCustomerId && <BillingPortalButton />}
              </div>
            </div>

            {/* Usage Stats */}
            <div className="lg:col-span-1">
              <UsageStats />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Activity
            </h2>

            {user.accessLogs.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No recent activity. Start using spaces to see your history here.
              </p>
            ) : (
              <div className="space-y-4">
                {user.accessLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {log.feature}
                      </p>
                      {log.spaceId && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Space: {log.spaceId}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
