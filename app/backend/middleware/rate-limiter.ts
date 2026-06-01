/**
 * Rate limiter middleware
 * Prototype: no-op. Production: integrate with Upstash Redis.
 */

export function rateLimiter(maxRequests = 20, windowMs = 60_000) {
  const counters = new Map<string, { count: number; resetAt: number }>();

  return function check(ip: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const entry = counters.get(ip);

    if (!entry || entry.resetAt < now) {
      counters.set(ip, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: maxRequests - 1 };
    }

    if (entry.count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    entry.count++;
    return { allowed: true, remaining: maxRequests - entry.count };
  };
}
