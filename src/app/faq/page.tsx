import Link from "next/link";
import { Header } from "@/components/Header";

export const metadata = {
  title: "FAQ - AI Image Editor by NextEleven",
  description: "Frequently Asked Questions about AI Image Editor",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Find answers to common questions about our AI Image Editor service.
          </p>

          <div className="space-y-8">
            {/* Getting Started */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                🚀 Getting Started
              </h2>

              <div className="space-y-4">
                <details className="group">
                  <summary className="cursor-pointer font-semibold text-lg text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    How do I create an account?
                  </summary>
                  <div className="p-4 text-gray-700 dark:text-gray-300">
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>Click "Get Started" or "Sign In" on the homepage</li>
                      <li>Enter your email and choose a password (minimum 6 characters)</li>
                      <li>Check your email for a verification link</li>
                      <li>Click the verification link to activate your account and receive 3 free credits</li>
                      <li>Sign in and start editing!</li>
                    </ol>
                  </div>
                </details>

                <details className="group">
                  <summary className="cursor-pointer font-semibold text-lg text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    I didn't receive my verification email. What should I do?
                  </summary>
                  <div className="p-4 text-gray-700 dark:text-gray-300">
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Check your spam/junk folder</li>
                      <li>Wait a few minutes - emails can take up to 5 minutes to arrive</li>
                      <li>Make sure you entered the correct email address</li>
                      <li>Try creating a new account with a different email provider (Gmail, Outlook, etc.)</li>
                      <li>Contact us at info@mothership-ai.com if the issue persists</li>
                    </ul>
                  </div>
                </details>
              </div>
            </section>

            {/* Credits & Pricing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                💳 Credits & Pricing
              </h2>

              <div className="space-y-4">
                <details className="group">
                  <summary className="cursor-pointer font-semibold text-lg text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    How do credits work?
                  </summary>
                  <div className="p-4 text-gray-700 dark:text-gray-300">
                    <p className="mb-2">Each image generation uses 1 credit. You can:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Get 3 free credits when you verify your email</li>
                      <li>Purchase credit bundles on the Pricing page</li>
                      <li>Credits never expire</li>
                      <li>Failed generations don't consume credits</li>
                    </ul>
                  </div>
                </details>

                <details className="group">
                  <summary className="cursor-pointer font-semibold text-lg text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    Can I get a refund?
                  </summary>
                  <div className="p-4 text-gray-700 dark:text-gray-300">
                    <p>Credits are generally non-refundable. However:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>If you experience technical issues that prevent you from using credits, contact us</li>
                      <li>Failed generations will not consume your credits</li>
                      <li>We handle refund requests on a case-by-case basis</li>
                    </ul>
                  </div>
                </details>

                <details className="group">
                  <summary className="cursor-pointer font-semibold text-lg text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    Why am I limited to 3 accounts per IP?
                  </summary>
                  <div className="p-4 text-gray-700 dark:text-gray-300">
                    This prevents abuse and ensures fair access to free credits for legitimate users.
                    If you legitimately need more accounts (e.g., family members, business), contact us at info@mothership-ai.com.
                  </div>
                </details>
              </div>
            </section>

            {/* Using the Service */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                🎨 Using the Service
              </h2>

              <div className="space-y-4">
                <details className="group">
                  <summary className="cursor-pointer font-semibold text-lg text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    What file formats are supported?
                  </summary>
                  <div className="p-4 text-gray-700 dark:text-gray-300">
                    We support: JPG, JPEG, PNG, and WebP. Maximum file size is typically 10MB.
                    For best results, use high-quality images with good lighting and resolution.
                  </div>
                </details>

                <details className="group">
                  <summary className="cursor-pointer font-semibold text-lg text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    How long does image generation take?
                  </summary>
                  <div className="p-4 text-gray-700 dark:text-gray-300">
                    <p className="mb-2">Generation times vary:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Normal conditions:</strong> 10-30 seconds</li>
                      <li><strong>High demand:</strong> 1-3 minutes (queue wait time)</li>
                      <li><strong>Complex images:</strong> May take longer</li>
                    </ul>
                    <p className="mt-2">During peak hours, you may experience longer wait times.</p>
                  </div>
                </details>

                <details className="group">
                  <summary className="cursor-pointer font-semibold text-lg text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    Do you store my images?
                  </summary>
                  <div className="p-4 text-gray-700 dark:text-gray-300">
                    No. Images are temporarily cached during processing (less than 1 hour) and then automatically deleted.
                    We do not permanently store uploaded images or generated outputs. See our <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</Link>.
                  </div>
                </details>

                <details className="group">
                  <summary className="cursor-pointer font-semibold text-lg text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    Who owns the generated images?
                  </summary>
                  <div className="p-4 text-gray-700 dark:text-gray-300">
                    You retain rights to images you upload. For AI-generated outputs, copyright law is complex and evolving.
                    We make no claims of ownership, but you are responsible for ensuring lawful use of generated content.
                  </div>
                </details>
              </div>
            </section>

            {/* Technical Issues */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                🔧 Technical Issues
              </h2>

              <div className="space-y-4">
                <details className="group">
                  <summary className="cursor-pointer font-semibold text-lg text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    My image generation failed. Will I get my credit back?
                  </summary>
                  <div className="p-4 text-gray-700 dark:text-gray-300">
                    Yes! If a generation fails due to technical issues, your credit will not be consumed.
                    If you notice credits were deducted for a failed generation, contact us at info@mothership-ai.com.
                  </div>
                </details>

                <details className="group">
                  <summary className="cursor-pointer font-semibold text-lg text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    The service says it's unavailable. When will it be back?
                  </summary>
                  <div className="p-4 text-gray-700 dark:text-gray-300">
                    Service interruptions are usually brief. During high demand or maintenance:
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Try again in a few minutes</li>
                      <li>Check during off-peak hours (early morning or late evening)</li>
                      <li>For extended outages, we'll post updates on our homepage</li>
                    </ul>
                  </div>
                </details>

                <details className="group">
                  <summary className="cursor-pointer font-semibold text-lg text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    The results aren't what I expected. What can I do?
                  </summary>
                  <div className="p-4 text-gray-700 dark:text-gray-300">
                    AI results vary based on input quality:
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Use high-resolution images with good lighting</li>
                      <li>Ensure faces are clearly visible (for character modes)</li>
                      <li>Try different AI modes for different effects</li>
                      <li>Some images work better than others with specific modes</li>
                      <li>See our <Link href="/troubleshooting" className="text-indigo-600 dark:text-indigo-400 hover:underline">Troubleshooting Guide</Link></li>
                    </ul>
                  </div>
                </details>
              </div>
            </section>

            {/* Account & Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                🔒 Account & Security
              </h2>

              <div className="space-y-4">
                <details className="group">
                  <summary className="cursor-pointer font-semibold text-lg text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    How do I reset my password?
                  </summary>
                  <div className="p-4 text-gray-700 dark:text-gray-300">
                    Click "Forgot password?" on the sign-in page, enter your email, and follow the instructions sent to your inbox.
                  </div>
                </details>

                <details className="group">
                  <summary className="cursor-pointer font-semibold text-lg text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    Can I delete my account?
                  </summary>
                  <div className="p-4 text-gray-700 dark:text-gray-300">
                    Yes. Email info@mothership-ai.com with your account deletion request.
                    Note that unused credits will be forfeited upon account deletion.
                  </div>
                </details>

                <details className="group">
                  <summary className="cursor-pointer font-semibold text-lg text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    Is my payment information secure?
                  </summary>
                  <div className="p-4 text-gray-700 dark:text-gray-300">
                    Yes. We use Stripe for payment processing. We never see or store your credit card information.
                    All transactions are encrypted and PCI-compliant.
                  </div>
                </details>
              </div>
            </section>

            {/* Contact */}
            <section className="mt-12 p-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
              <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">
                Still have questions?
              </h3>
              <p className="text-indigo-800 dark:text-indigo-200">
                Contact us at <strong>info@mothership-ai.com</strong> and we'll be happy to help!
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-4">
              <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                ← Back to Home
              </Link>
              <Link href="/guide" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Onboarding Guide →
              </Link>
              <Link href="/troubleshooting" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Troubleshooting →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
