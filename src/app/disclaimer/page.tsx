import Link from "next/link";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Service Disclaimer - AI Image Editor by NextEleven",
  description: "Service disclaimers and limitations for AI Image Editor",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Service Disclaimer
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Last Updated: January 5, 2026
          </p>

          <div className="prose prose-indigo dark:prose-invert max-w-none">
            <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg mb-8">
              <h2 className="text-xl font-bold text-yellow-900 dark:text-yellow-100 mt-0 mb-3">
                ⚠️ Important Service Limitations
              </h2>
              <p className="text-yellow-800 dark:text-yellow-200 mb-0">
                Please read this disclaimer carefully before using our Service.
                By using the AI Image Editor, you acknowledge and accept these limitations.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              1. Service Availability
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>We Cannot Guarantee 100% Uptime:</strong>
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>During periods of high demand, users may experience wait times or delays in processing</li>
              <li>The Service may experience temporary interruptions or slowdowns</li>
              <li>In worst-case scenarios, the system may be temporarily unavailable</li>
              <li>The computational resources required for advanced AI processing are substantial</li>
              <li>Due to the popularity of our platform, we may need to implement queue systems during peak hours</li>
              <li>While we strive to maintain 24/7 availability and continuously optimize our infrastructure, perfect uptime cannot be guaranteed</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              2. AI-Generated Content Limitations
            </h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              2.1 Quality and Accuracy
            </h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>AI-generated results may vary in quality and may not always meet your expectations</li>
              <li>The AI may produce unexpected, unusual, or unintended results</li>
              <li>Results depend heavily on input image quality, resolution, and content</li>
              <li>Some image types or styles may produce better results than others</li>
              <li>Generated images may contain artifacts, distortions, or imperfections</li>
              <li>Text within images may not be accurately preserved or rendered</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              2.2 Processing Failures
            </h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Some image generation requests may fail or timeout</li>
              <li>Certain images may be incompatible with specific AI modes</li>
              <li>Third-party AI services we rely on may experience outages</li>
              <li>Failed generations will not consume your credits (when detectable)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              3. Third-Party Dependencies
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our Service relies on third-party infrastructure and AI models:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li><strong>HuggingFace:</strong> AI model hosting and processing</li>
              <li><strong>Vercel:</strong> Application hosting and delivery</li>
              <li><strong>Supabase:</strong> Database services</li>
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>Resend:</strong> Email delivery</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>Important:</strong> We are subject to the availability, performance, and terms of these third-party services.
              Outages or changes to these services may affect our Service availability and functionality.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              4. No Professional Advice
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The Service is provided for creative and professional use but should not be considered:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Legal advice or certification of authenticity</li>
              <li>Medical or diagnostic imaging</li>
              <li>Evidence for legal or forensic purposes</li>
              <li>Identity verification or authentication</li>
              <li>Safety-critical or life-critical applications</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              5. Content Responsibility
            </h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              5.1 User Responsibility
            </h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>YOU are responsible for images you upload and content you generate</li>
              <li>YOU must ensure you have appropriate rights to use uploaded images</li>
              <li>YOU are responsible for how you use generated content</li>
              <li>YOU must comply with applicable laws and regulations</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              5.2 No Content Review
            </h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>We do not pre-screen or review uploaded images</li>
              <li>We do not monitor or review generated content in real-time</li>
              <li>Automated filtering may not catch all prohibited content</li>
              <li>We investigate reported violations and may take action retroactively</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              6. Financial Disclaimers
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li><strong>Credits:</strong> Credits are digital goods with no cash value</li>
              <li><strong>Refunds:</strong> Credits are generally non-refundable except as required by law</li>
              <li><strong>Pricing:</strong> Prices may change with reasonable notice</li>
              <li><strong>No Guarantees:</strong> We do not guarantee specific results or value from purchased credits</li>
              <li><strong>Service Changes:</strong> Features may be added, modified, or removed at our discretion</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              7. Data and Privacy
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Uploaded images are temporarily processed and then deleted</li>
              <li>We cannot guarantee absolute security or privacy</li>
              <li>Third-party AI services may temporarily process your images</li>
              <li>See our <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</Link> for complete details</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              8. Intellectual Property
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>AI-generated content may be subject to complex copyright considerations</li>
              <li>Generated images may resemble existing copyrighted works</li>
              <li>You are responsible for ensuring your use of generated content is lawful</li>
              <li>We make no representations about the copyright status of AI-generated images</li>
              <li>Consult a legal professional for specific copyright questions</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              9. Changes to the Service
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We reserve the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Modify, suspend, or discontinue any feature or the entire Service</li>
              <li>Change pricing, credit costs, or credit bundles</li>
              <li>Update AI models or processing methods</li>
              <li>Implement usage limits or restrictions</li>
              <li>Change terms of service or policies</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We will provide reasonable notice of material changes when possible.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              10. Warranty Disclaimer
            </h2>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mb-4">
              <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE"
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-0">
                We make no warranties, express or implied, including but not limited to warranties of merchantability,
                fitness for a particular purpose, accuracy, or non-infringement. We do not warrant that the Service
                will be uninterrupted, error-free, secure, or free from viruses or other harmful components.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              11. Limitation of Liability
            </h2>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg mb-4">
              <p className="text-red-800 dark:text-red-200 mb-0">
                <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</strong><br /><br />
                NextEleven AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
                or any loss of profits, data, use, goodwill, or other intangible losses resulting from:
                (i) your use or inability to use the Service;
                (ii) any unauthorized access to or use of our servers;
                (iii) any interruption or cessation of the Service;
                (iv) any bugs, viruses, or harmful code;
                (v) any content or conduct of third parties;
                (vi) any content obtained from the Service; or
                (vii) unauthorized access, use, or alteration of your content.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              12. User Acknowledgment
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              By using the Service, you acknowledge that you have read, understood, and agree to this Disclaimer, and that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>You use the Service at your own risk</li>
              <li>You accept the limitations and potential issues described herein</li>
              <li>You understand that AI technology is not perfect</li>
              <li>You will not rely solely on AI-generated content for critical decisions</li>
              <li>You will use the Service responsibly and ethically</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Questions or Concerns?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you have questions about this Disclaimer or concerns about service reliability, please contact us at:
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 mb-0">
                <strong>Email:</strong> info@mothership-ai.com<br />
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
