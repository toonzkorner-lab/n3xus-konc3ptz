/**
 * Basic In-Memory Rate Limiter
 * Note: In a serverless environment (like Vercel), memory resets across lambda invocations.
 * This is primarily effective against rapid, consecutive brute-force bursts to the same instance.
 * For true global rate limiting, use Redis (e.g. Upstash).
 */

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

export function rateLimit(ip: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return true; // allowed
  }

  if (now > entry.resetAt) {
    // Window expired, reset
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return true; // allowed
  }

  if (entry.count >= maxRequests) {
    return false; // rate limited
  }

  entry.count++;
  return true; // allowed
}
