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
      // Convert image to base64
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
        body: JSON.stringify({
          image: base64Image,
          prompt: prompt.trim(),
          loraAdapter: loraAdapter,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Generation failed");
      }

      setGeneratedImage(data.image);
      setCreditsRemaining(data.creditsRemaining);

      // Update session to reflect new credit count
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

          {/* Embed HuggingFace Space directly - THIS WORKS NOW */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
            <div className="mb-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Powered by Qwen Image Editor on HuggingFace
            </div>
            <iframe
              src="https://bizbots-qwen-image-editor.hf.space"
              frameBorder="0"
              width="100%"
              height="900"
              className="rounded-lg"
            ></iframe>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Each generation uses 1 credit. {(creditsRemaining === 0 || session.user?.imageCredits === 0) && (
                <Link
                  href="/pricing"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline ml-2"
                >
                  Buy more credits
                </Link>
              )}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
