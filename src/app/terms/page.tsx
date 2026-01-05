import Link from "next/link";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Terms of Service - AI Image Editor by NextEleven",
  description: "Terms of Service for AI Image Editor by NextEleven AI",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Last Updated: January 5, 2026
          </p>

          <div className="prose prose-indigo dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              1. Agreement to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              By accessing or using the AI Image Editor service at pic.mothership-ai.com (the "Service"),
              you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these Terms,
              you may not access the Service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              NextEleven AI provides an AI-powered image editing platform that offers 9 advanced editing modes including
              photo-to-anime conversion, character consistency, 4K upscaling, lighting effects, viewpoint generation,
              style transfer, manga effects, industrial design, and style reference features.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              3. Account Registration and Security
            </h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              3.1 Account Creation
            </h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>You must provide a valid email address to create an account</li>
              <li>You must verify your email address before using the Service</li>
              <li>You must be at least 13 years old to use the Service</li>
              <li>You are limited to 3 accounts per IP address within 30 days</li>
              <li>One account per person; no account sharing or selling</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              3.2 Account Security
            </h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>You are responsible for maintaining the confidentiality of your password</li>
              <li>You are responsible for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>We are not liable for any loss resulting from unauthorized use of your account</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              4. Credits and Pricing
            </h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              4.1 Free Credits
            </h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>New verified accounts receive 3 free credits</li>
              <li>Free credits are non-transferable and non-refundable</li>
              <li>One credit is consumed per image generation</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              4.2 Purchased Credits
            </h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Credits may be purchased through our payment provider (Stripe)</li>
              <li>Pricing is subject to change with reasonable notice</li>
              <li>Purchased credits do not expire</li>
              <li>Credits are non-refundable except as required by law</li>
              <li>Credits cannot be converted to cash or transferred to other accounts</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              5. Service Availability and Performance
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>Important Service Limitations:</strong>
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>We strive for 24/7 availability but cannot guarantee 100% uptime</li>
              <li>During high demand, you may experience wait times or delays</li>
              <li>Service interruptions may occur due to maintenance, updates, or technical issues</li>
              <li>The computational resources required for AI processing are substantial</li>
              <li>We reserve the right to implement rate limiting during peak usage</li>
              <li>Failed generations due to service issues will not consume credits</li>
              <li>We are not liable for any losses resulting from service unavailability</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              6. Content and Intellectual Property
            </h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              6.1 Your Content
            </h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>You retain all rights to images you upload</li>
              <li>You grant us a limited license to process your images solely to provide the Service</li>
              <li>We do not claim ownership of your uploaded images or generated outputs</li>
              <li>You are responsible for ensuring you have rights to upload and process images</li>
              <li>Do not upload copyrighted material without permission</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              6.2 Generated Content
            </h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>AI-generated outputs are provided to you for your use</li>
              <li>We make no claims of copyright ownership over AI-generated images</li>
              <li>You are responsible for ensuring appropriate use of generated content</li>
              <li>Generated content may be subject to third-party AI model licenses</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              6.3 Our Intellectual Property
            </h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>The Service, including its design, code, and features, is owned by NextEleven AI</li>
              <li>Our trademarks, logos, and branding materials are protected</li>
              <li>You may not copy, modify, or reverse engineer our Service</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              7. Prohibited Uses
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You agree NOT to use the Service to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Create harmful, illegal, or offensive content</li>
              <li>Generate deepfakes or misleading content of real people without consent</li>
              <li>Harass, threaten, or defame others</li>
              <li>Attempt to circumvent security measures or abuse the Service</li>
              <li>Scrape, data mine, or automate access to the Service</li>
              <li>Resell or redistribute our Service without authorization</li>
              <li>Create content depicting minors in inappropriate situations</li>
              <li>Generate spam, phishing, or fraudulent content</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              See our <Link href="/acceptable-use" className="text-indigo-600 dark:text-indigo-400 hover:underline">Acceptable Use Policy</Link> for complete guidelines.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              8. Termination
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may terminate or suspend your account immediately, without prior notice, for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Abuse of the Service or other users</li>
              <li>Non-payment of fees</li>
              <li>Any reason at our sole discretion</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Upon termination, your right to use the Service will cease immediately.
              Unused credits will be forfeited unless termination was due to our error.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              9. Disclaimers and Limitations of Liability
            </h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              9.1 Service "As Is"
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
              WE DISCLAIM ALL WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              9.2 AI Output Quality
            </h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>AI-generated results may vary in quality</li>
              <li>We do not guarantee specific outcomes or quality levels</li>
              <li>Results depend on input quality and AI model capabilities</li>
              <li>Some generations may fail or produce unexpected results</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              9.3 Limitation of Liability
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEXTELEVEN AI SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
              <li>Service interruptions or unavailability</li>
              <li>Errors, mistakes, or inaccuracies in generated content</li>
              <li>Third-party access to your data</li>
              <li>Any claim exceeding the amount you paid us in the past 12 months</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              10. Indemnification
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You agree to indemnify and hold harmless NextEleven AI, its affiliates, officers, agents, and employees from any claims,
              damages, losses, liabilities, and expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Content you upload or generate</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              11. Dispute Resolution
            </h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              11.1 Informal Resolution
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Before filing a claim, you agree to contact us at info@mothership-ai.com to attempt informal resolution.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              11.2 Governing Law
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the United States,
              without regard to conflict of law provisions.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              11.3 Arbitration
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Any disputes shall be resolved through binding arbitration in accordance with commercial arbitration rules,
              except you may assert claims in small claims court if they qualify.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              12. Changes to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting.
              Your continued use of the Service after changes constitutes acceptance of the modified Terms.
              Material changes will be communicated via email.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              13. Miscellaneous
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and NextEleven AI</li>
              <li><strong>Severability:</strong> If any provision is found invalid, the remaining provisions continue in effect</li>
              <li><strong>Waiver:</strong> Failure to enforce any right or provision does not constitute a waiver</li>
              <li><strong>Assignment:</strong> You may not assign these Terms; we may assign them without restriction</li>
              <li><strong>Force Majeure:</strong> We are not liable for delays or failures due to circumstances beyond our control</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              14. Contact Information
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
              <p className="text-gray-700 dark:text-gray-300">
                For questions about these Terms, please contact:<br /><br />
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
