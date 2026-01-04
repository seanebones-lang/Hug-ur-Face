import { Header } from "@/components/Header";
import { PricingCard } from "@/components/PricingCard";
import { BUNDLES } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function PricingPage() {
  const session = await auth();

  let userCredits = 3; // Default free credits
  if (session?.user?.id) {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { imageCredits: true }
    });
    userCredits = user?.imageCredits ?? 3;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple Credit-Based Pricing
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Buy credits for AI image editing. Credits never expire.
              {session && (
                <span className="block mt-2 text-green-600 dark:text-green-400 font-semibold">
                  You have {userCredits} credits remaining
                </span>
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(BUNDLES).map(([key, bundle]) => (
              <PricingCard
                key={key}
                name={bundle.name}
                description={bundle.description}
                price={bundle.price}
                priceId={bundle.priceId ?? null}
                features={bundle.features}
                planKey={key}
                credits={bundle.credits}
                popular={bundle.popular}
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
                  Do credits expire?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No! All credits you purchase never expire. Use them whenever
                  you need them, with no time pressure.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  What happens when I run out of credits?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Simply purchase more credits when you need them. You can buy
                  any bundle at any time - there&apos;s no subscription or commitment.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  How do I get started for free?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Sign up and you&apos;ll get 3 free credits to try out the service.
                  No credit card required for the free credits.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Can I buy multiple bundles?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Absolutely! Credits from all purchases stack together. Buy
                  whichever bundle makes sense at the time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
