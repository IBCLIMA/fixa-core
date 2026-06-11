// Distributed rate limiter backed by Postgres (Neon).
// Atomic INSERT ... ON CONFLICT counter — works across all Vercel instances/regions.
// In-memory Map acts as a fast-path: a hot abuser gets rejected without hitting the DB.
// Fail-open: if the DB errors, the request is allowed (public flows must not break).

import { neon } from "@neondatabase/serverless";

const localStore = new Map<string, { count: number; resetAt: number }>();

let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 10 * 60 * 1000;

function localCleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of localStore) {
    if (now > entry.resetAt) localStore.delete(key);
  }
}

function localCheck(key: string, limit: number, windowMs: number): boolean {
  localCleanup();
  const now = Date.now();
  const entry = localStore.get(key);
  if (!entry || now > entry.resetAt) {
    localStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count++;
  return entry.count <= limit;
}

/**
 * Check rate limit for a given key (e.g. an IP or `route:ip`).
 *
 * @param key - Identifier to limit on
 * @param limit - Maximum number of requests allowed in the window
 * @param windowMs - Time window in milliseconds
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; remaining: number }> {
  // Fast path: this instance alone already saw too many requests
  if (!localCheck(key, limit, windowMs)) {
    return { success: false, remaining: 0 };
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const windowSeconds = Math.ceil(windowMs / 1000);

    const rows = await sql.query(
      `INSERT INTO rate_limits (key, count, reset_at)
       VALUES ($1, 1, now() + make_interval(secs => $2))
       ON CONFLICT (key) DO UPDATE SET
         count = CASE WHEN rate_limits.reset_at < now() THEN 1 ELSE rate_limits.count + 1 END,
         reset_at = CASE WHEN rate_limits.reset_at < now() THEN now() + make_interval(secs => $2) ELSE rate_limits.reset_at END
       RETURNING count`,
      [key, windowSeconds]
    );

    const count = Number(rows[0]?.count ?? 1);

    // Opportunistic cleanup of stale rows (~1% of calls)
    if (Math.random() < 0.01) {
      sql.query(`DELETE FROM rate_limits WHERE reset_at < now() - interval '1 day'`).catch(() => {});
    }

    return { success: count <= limit, remaining: Math.max(0, limit - count) };
  } catch (e) {
    console.error("[rate-limit] DB error, failing open:", e instanceof Error ? e.message : e);
    return { success: true, remaining: 1 };
  }
}
