/**
 * Minimal in-memory rate limiter.
 *
 * Good enough for a single Node instance (a VPS, a single container).
 * If you deploy to a serverless platform or run more than one instance,
 * swap this for Upstash Redis — see docs/user-guide.md, "Scaling the
 * rate limiter". The interface below is deliberately the same shape.
 */
type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

export function rateLimit(key: string, limit = 5, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || entry.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  entry.count += 1;
  if (entry.count > limit) {
    return { ok: false, remaining: 0, resetAt: entry.resetAt };
  }
  return { ok: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/** Best-effort client IP behind a proxy or CDN. */
export function clientIp(req: Request) {
  const h = req.headers;
  return (
    h.get("cf-connecting-ip") ??
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/** Periodically drop expired buckets so the map cannot grow unbounded. */
const sweeper = setInterval(
  () => {
    const now = Date.now();
    for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k);
  },
  10 * 60 * 1000,
) as unknown as { unref?: () => void };

// Don't hold the Node process open just for the sweeper.
sweeper.unref?.();
