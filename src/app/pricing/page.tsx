import { Header } from "@/components/Header";
import { PricingCard } from "@/components/PricingCard";
import { PLANS } from "@/lib/stripe";
import { auth } from "@/lib/auth";

export default async function PricingPage() {
  const session = await auth();
  const currentTier = session?.user?.subscriptionTier ?? "FREE";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose the plan that best fits your needs. Upgrade or downgrade
              anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(PLANS).map(([key, plan]) => (
              <PricingCard
                key={key}
                name={plan.name}
                description={plan.description}
                price={plan.price}
                priceId={plan.priceId ?? null}
                features={plan.features}
                planKey={key}
                isCurrentPlan={currentTier === key}
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>

            <div className="max-w-3xl mx-auto space-y-6 text-left">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes! You can cancel your subscription at any time. Your access
                  will continue until the end of your current billing period.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  What happens when I reach my usage limit?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your usage resets daily. If you consistently need more, we
                  recommend upgrading to a higher tier for better limits or
                  unlimited access.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Do you offer refunds?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We offer a 7-day money-back guarantee for new subscribers. If
                  you&apos;re not satisfied, contact us for a full refund.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
