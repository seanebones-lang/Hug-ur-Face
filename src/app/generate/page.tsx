"use client";

import { Header } from "@/components/Header";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function GeneratePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(
    session?.user?.imageCredits ?? null
  );
  const [loraAdapter, setLoraAdapter] = useState("Photo-to-Anime");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (!imageFile || !prompt.trim()) {
      setError("Please upload an image and enter a prompt");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent
        body: JSON.stringify({
          image: base64Image,
          prompt: prompt.trim(),
          loraAdapter: loraAdapter,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Session expired or not authenticated
          setError("Session expired. Please sign in again.");
          setTimeout(() => router.push("/auth/signin"), 2000);
          return;
        }
        throw new Error(data.error || data.message || "Generation failed");
      }

      setGeneratedImage(data.image);
      setCreditsRemaining(data.creditsRemaining);

      if (session?.user) {
        session.user.imageCredits = data.creditsRemaining;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sign in to Generate Images
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You need to be signed in to generate images
            </p>
            <Link
              href="/auth/signin"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Transform Any Image with the Most Advanced AI Image System in the World
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-4xl mx-auto mb-4">
              From photo-to-anime transformations to 4K upscaling, lighting migration to pose control - perform any visual adjustment imaginable. What once required teams of professional artists and expensive software now happens in seconds.
            </p>
            <div className="mt-4">
              <span className="px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full font-semibold">
                {creditsRemaining !== null ? creditsRemaining : session.user?.imageCredits || 0} credits remaining
              </span>
            </div>
          </div>

          {/* NextEleven AI Image Editor - White Labeled */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full">
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Powered by NextEleven AI
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Base Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-900 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-50 file:to-purple-50 file:text-blue-700 hover:file:from-blue-100 hover:file:to-purple-100 dark:file:from-blue-900 dark:file:to-purple-900 dark:file:text-blue-200"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full h-auto rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                )}
              </div>

              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Describe Your Edit
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Transform into anime style, add dramatic lighting, make it look professional..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Style Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  AI Style
                </label>
                <select
                  value={loraAdapter}
                  onChange={(e) => setLoraAdapter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="Photo-to-Anime">Photo to Anime</option>
                  <option value="Upscaler">4K Upscaler</option>
                  <option value="Style-Transfer">Style Transfer</option>
                  <option value="Manga-Tone">Manga Tone</option>
                  <option value="Multiple-Angles">Multiple Angles</option>
                  <option value="Any-Pose">Pose Control</option>
                  <option value="Light-Migration">Lighting Control</option>
                </select>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {error}
                  </p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || !imageFile || !prompt.trim() || (session.user?.imageCredits === 0 && creditsRemaining === 0)}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {loading ? "Generating with NextEleven AI..." : "Generate Image (1 credit)"}
              </button>

              {/* Generated Image */}
              {generatedImage && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Generated by NextEleven AI
                  </h3>
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="max-w-full h-auto rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                  <a
                    href={generatedImage}
                    download="nexteleven-ai-image.png"
                    className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors shadow-md"
                  >
                    Download Image
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
