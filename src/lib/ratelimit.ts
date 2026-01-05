import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Only create Redis instance if env vars are present
let redis: Redis | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// Auth endpoints: 5 requests per 10 minutes
export const authRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      analytics: true,
      prefix: "ratelimit:auth",
    })
  : null;

// Generate endpoint: 10 generations per minute per user
export const generateRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      analytics: true,
      prefix: "ratelimit:generate",
    })
  : null;

// General API: 100 requests per minute
export const apiRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: true,
      prefix: "ratelimit:api",
    })
  : null;

// Signup: 3 per IP per hour
export const signupRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      analytics: true,
      prefix: "ratelimit:signup",
    })
  : null;
