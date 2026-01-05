import Link from "next/link";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Privacy Policy - AI Image Editor by NextEleven",
  description: "Privacy Policy for AI Image Editor by NextEleven AI",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Last Updated: January 5, 2026
          </p>

          <div className="prose prose-indigo dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              NextEleven AI ("we," "our," or "us") operates the AI Image Editor platform at pic.mothership-ai.com (the "Service").
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              2.1 Personal Information
            </h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Email address (required for account creation)</li>
              <li>Name (optional)</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>IP address (for security and abuse prevention)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              2.2 Usage Information
            </h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Images you upload for processing</li>
              <li>Service usage statistics (features used, credits consumed)</li>
              <li>Browser type, device information, and operating system</li>
              <li>Access times and referring website addresses</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li><strong>Provide Services:</strong> Process your images using our AI technology</li>
              <li><strong>Account Management:</strong> Create and manage your user account</li>
              <li><strong>Payment Processing:</strong> Process transactions and maintain billing records</li>
              <li><strong>Communication:</strong> Send service updates, security alerts, and support messages</li>
              <li><strong>Abuse Prevention:</strong> Detect and prevent fraudulent activity and abuse</li>
              <li><strong>Service Improvement:</strong> Analyze usage patterns to improve our Service</li>
              <li><strong>Legal Compliance:</strong> Comply with applicable laws and regulations</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              4. Image Processing and Storage
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>Important:</strong> Images you upload are processed by our AI systems and third-party AI services (including HuggingFace).
              We do not permanently store your uploaded images or generated outputs on our servers. Images are:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Temporarily cached during processing (typically less than 1 hour)</li>
              <li>Automatically deleted after processing is complete</li>
              <li>Not used to train our AI models</li>
              <li>Not shared with third parties except as necessary for processing</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              5. Information Sharing and Disclosure
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li><strong>Service Providers:</strong> Third-party companies that help us operate our Service (e.g., HuggingFace for AI processing, Stripe for payments, Resend for emails)</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Protection of Rights:</strong> To protect our rights, privacy, safety, or property, and that of our users</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We do NOT sell your personal information to third parties.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              6. Data Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Secure password hashing (bcrypt)</li>
              <li>Regular security audits and updates</li>
              <li>Limited employee access to personal data</li>
              <li>IP-based abuse monitoring</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              7. Your Data Rights
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and personal data</li>
              <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Objection:</strong> Object to certain processing of your data</li>
              <li><strong>Withdrawal:</strong> Withdraw consent where we rely on it</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              To exercise these rights, contact us at <strong>info@mothership-ai.com</strong>
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              8. Cookies and Tracking
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use essential cookies to maintain your session and authenticate your account.
              We do not use advertising or tracking cookies. You can disable cookies in your browser settings,
              but this may affect Service functionality.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              9. Third-Party Services
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our Service integrates with third-party services that have their own privacy policies:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li><strong>HuggingFace:</strong> AI model hosting and processing (<a href="https://huggingface.co/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)</li>
              <li><strong>Stripe:</strong> Payment processing (<a href="https://stripe.com/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)</li>
              <li><strong>Resend:</strong> Email delivery (<a href="https://resend.com/legal/privacy-policy" className="text-indigo-600 dark:text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)</li>
              <li><strong>Vercel:</strong> Hosting infrastructure (<a href="https://vercel.com/legal/privacy-policy" className="text-indigo-600 dark:text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)</li>
              <li><strong>Supabase:</strong> Database services (<a href="https://supabase.com/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              10. Children's Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              If you believe we have collected information from a child under 13, please contact us immediately.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              11. International Data Transfers
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Your information may be transferred to and processed in countries other than your own.
              We ensure appropriate safeguards are in place to protect your data in compliance with applicable data protection laws.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              12. Data Retention
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We retain your personal information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy.
              Specifically:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li><strong>Account Data:</strong> Retained until you request deletion</li>
              <li><strong>Transaction Records:</strong> Retained for 7 years for tax and legal compliance</li>
              <li><strong>Uploaded Images:</strong> Deleted within 1 hour after processing</li>
              <li><strong>Logs:</strong> Retained for 90 days for security purposes</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              13. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Posting the new Privacy Policy on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending you an email notification (for material changes)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              14. Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Email:</strong> info@mothership-ai.com<br />
                <strong>Service:</strong> AI Image Editor by NextEleven<br />
                <strong>Website:</strong> <a href="https://pic.mothership-ai.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">pic.mothership-ai.com</a>
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
