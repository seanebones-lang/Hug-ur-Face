import { Header } from "@/components/Header";
import { SpaceEmbed } from "@/components/SpaceEmbed";
import Link from "next/link";

interface PageProps {
  params: Promise<{ spaceId: string[] }>;
}

export default async function SpaceViewerPage({ params }: PageProps) {
  const { spaceId: spaceIdParts } = await params;
  const spaceId = spaceIdParts.join("/");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link
              href="/spaces"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Spaces
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {spaceId}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              HuggingFace Space
            </p>
          </div>

          <SpaceEmbed spaceId={spaceId} title={spaceId} />

          <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              About This Space
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              This is a HuggingFace Space embedded through the monetization
              platform. Your usage is tracked against your subscription limits.
            </p>
            <div className="mt-4 flex gap-4">
              <a
                href={`https://huggingface.co/spaces/${spaceId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
              >
                View on HuggingFace
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
