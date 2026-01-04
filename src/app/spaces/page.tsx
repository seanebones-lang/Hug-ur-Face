import Link from "next/link";
import { Header } from "@/components/Header";

// Example spaces - in production, you'd fetch these from a database or API
const DEMO_SPACES = [
  {
    id: "stabilityai/stable-diffusion",
    name: "Stable Diffusion",
    description: "Generate images from text prompts using Stable Diffusion.",
    tier: "FREE",
    category: "Image Generation",
  },
  {
    id: "openai/whisper",
    name: "Whisper",
    description: "Automatic speech recognition and transcription.",
    tier: "BASIC",
    category: "Audio",
  },
  {
    id: "meta-llama/llama-3.2",
    name: "Llama 3.2",
    description: "Chat with Meta's latest large language model.",
    tier: "PRO",
    category: "Text Generation",
  },
  {
    id: "runwayml/stable-diffusion-v1-5",
    name: "SD 1.5 Inpainting",
    description: "Edit and modify images with AI-powered inpainting.",
    tier: "BASIC",
    category: "Image Editing",
  },
  {
    id: "microsoft/phi-3",
    name: "Phi-3",
    description: "Microsoft's efficient small language model.",
    tier: "FREE",
    category: "Text Generation",
  },
  {
    id: "coqui/XTTS-v2",
    name: "XTTS v2",
    description: "High-quality text-to-speech synthesis.",
    tier: "PRO",
    category: "Audio",
  },
];

const TIER_COLORS = {
  FREE: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  BASIC: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  PRO: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  ENTERPRISE:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

export default function SpacesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Spaces
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Access premium HuggingFace Spaces with your subscription. Upgrade
              for more features and higher limits.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEMO_SPACES.map((space) => (
              <Link
                key={space.id}
                href={`/spaces/${encodeURIComponent(space.id)}`}
                className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {space.category}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      TIER_COLORS[space.tier as keyof typeof TIER_COLORS]
                    }`}
                  >
                    {space.tier}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {space.name}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {space.description}
                </p>

                <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                  <span>Open Space</span>
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Want to add your own space to the platform?
            </p>
            <Link
              href="/contact"
              className="inline-block px-6 py-3 border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
