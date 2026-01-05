import Link from "next/link";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Acceptable Use Policy - AI Image Editor by NextEleven",
  description: "Acceptable Use Policy for AI Image Editor by NextEleven AI",
};

export default function AcceptableUsePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Acceptable Use Policy
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Last Updated: January 5, 2026
          </p>

          <div className="prose prose-indigo dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              This Acceptable Use Policy outlines what you can and cannot do when using the AI Image Editor service.
              Violation of this policy may result in account suspension or termination.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              ✅ Acceptable Uses
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You MAY use the Service for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-6">
              <li>Personal creative projects and artwork</li>
              <li>Professional design work and client projects</li>
              <li>E-commerce product photography enhancement</li>
              <li>Marketing and promotional materials</li>
              <li>Social media content creation</li>
              <li>Portfolio and presentation materials</li>
              <li>Educational purposes and research</li>
              <li>Artistic experimentation and style exploration</li>
              <li>Photo restoration and enhancement</li>
              <li>Creating avatars and profile pictures</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              ⛔ Prohibited Uses
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              1. Illegal Content
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Do NOT create content that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Violates any local, state, national, or international law</li>
              <li>Promotes illegal activities or substances</li>
              <li>Facilitates fraud, scams, or deception</li>
              <li>Infringes on intellectual property rights of others</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              2. Harmful Content
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Do NOT create content depicting or promoting:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Violence, gore, or graphic injury</li>
              <li>Self-harm or suicide</li>
              <li>Terrorism or extremist ideologies</li>
              <li>Hate speech or discrimination based on race, ethnicity, religion, gender, sexual orientation, disability, or other protected characteristics</li>
              <li>Harassment, bullying, or threats</li>
              <li>Child exploitation or endangerment of any kind</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              3. Sexual Content
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Do NOT create:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Explicit sexual or pornographic content</li>
              <li>Non-consensual intimate imagery</li>
              <li>Content sexualizing minors in any way</li>
              <li>Nude or sexually suggestive images of real people without their explicit consent</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              4. Deepfakes and Misinformation
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Do NOT create content that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Creates misleading deepfakes of real people without consent</li>
              <li>Impersonates others for fraudulent purposes</li>
              <li>Spreads false information or propaganda</li>
              <li>Manipulates political figures or public officials in misleading ways</li>
              <li>Creates fake documents or identification</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              5. Privacy Violations
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Do NOT:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Upload images of people without their consent (except public figures for lawful purposes)</li>
              <li>Doxx or reveal private information about others</li>
              <li>Use images obtained through unauthorized access</li>
              <li>Create content intended to stalk or harass specific individuals</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              6. Copyright Infringement
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Do NOT:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Upload copyrighted images without permission</li>
              <li>Create derivative works of copyrighted material without authorization</li>
              <li>Use the Service to infringe on trademarks or brand identities</li>
              <li>Reproduce or modify copyrighted artwork, characters, or logos</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              7. Spam and Abuse
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Do NOT:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Create mass-generated spam content</li>
              <li>Automate or script access to the Service</li>
              <li>Attempt to circumvent credit limits or rate limiting</li>
              <li>Create multiple accounts to abuse free credits</li>
              <li>Share accounts or sell access to your account</li>
              <li>Reverse engineer or scrape the Service</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              8. System Abuse
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Do NOT:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Attempt to hack, exploit, or compromise the Service</li>
              <li>Upload malware, viruses, or malicious code</li>
              <li>Overload or disrupt Service infrastructure</li>
              <li>Bypass security measures or authentication</li>
              <li>Access other users' data or accounts</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Enforcement
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Violations of this policy may result in:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li><strong>Warning:</strong> First-time minor violations</li>
              <li><strong>Account Suspension:</strong> Temporary loss of access</li>
              <li><strong>Account Termination:</strong> Permanent ban for serious or repeated violations</li>
              <li><strong>Legal Action:</strong> Referral to law enforcement for illegal activity</li>
              <li><strong>Credit Forfeiture:</strong> Loss of all remaining credits</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Reporting Violations
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you become aware of content or behavior that violates this policy:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Report it immediately to <strong>info@mothership-ai.com</strong></li>
              <li>Include specific details and evidence when possible</li>
              <li>Do not engage with or share the violating content</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Responsible AI Use
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We encourage you to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Disclose when images are AI-generated when appropriate</li>
              <li>Respect the rights and dignity of people depicted in images</li>
              <li>Consider the ethical implications of your creative work</li>
              <li>Use AI technology responsibly and transparently</li>
              <li>Respect cultural sensitivities and avoid offensive stereotypes</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Updates to This Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may update this policy as needed to address new use cases or concerns.
              Continued use of the Service after changes constitutes acceptance of the updated policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Questions?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you're unsure whether a specific use case is acceptable, contact us at <strong>info@mothership-ai.com</strong> before proceeding.
            </p>

            <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
              <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-2">
                Golden Rule
              </h3>
              <p className="text-indigo-800 dark:text-indigo-200">
                Use the Service in a way that respects others, follows the law, and contributes positively to the creative community.
                If you wouldn't want someone to do it to you, don't do it to others.
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
