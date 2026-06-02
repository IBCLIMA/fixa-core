// Simple in-memory rate limiter
// Stores IP -> { count, resetTime } entries and cleans up expired ones periodically
// NOTE: In-memory rate limiting. Works with Vercel Fluid Compute (instance reuse)
// but is not distributed across regions. For stricter limiting, upgrade to Upstash Redis.
// Current implementation is sufficient for low-traffic SaaS.

const rateLimitStore = new Map<
  string,
  { count: number; resetAt: number }
>();

// Clean up expired entries every 10 minutes
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 10 * 60 * 1000;

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Check rate limit for a given IP address.
 *
 * @param ip - The client IP address
 * @param limit - Maximum number of requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns { success: boolean; remaining: number }
 */
export function rateLimit(
  ip: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number } {
  cleanup();

  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count };
}
