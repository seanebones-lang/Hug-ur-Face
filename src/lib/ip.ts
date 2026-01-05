import { headers } from "next/headers";

/**
 * Get the client's IP address from request headers
 * Checks multiple headers in order of preference
 */
export async function getClientIp(): Promise<string> {
  const headersList = await headers();

  // Check various headers that might contain the real IP
  const ip =
    headersList.get("x-real-ip") ||
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
    headersList.get("cf-connecting-ip") || // Cloudflare
    headersList.get("x-client-ip") ||
    headersList.get("x-cluster-client-ip") ||
    "unknown";

  return ip;
}
