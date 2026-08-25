import { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  expiresAt: number;
}

interface RateLimitResult {
  ok: boolean;
  retryAfterSeconds: number;
  remaining: number;
  limit: number;
}

const ADMIN_RATE_LIMIT_MAX = Number.parseInt(process.env.ADMIN_RATE_LIMIT_MAX ?? '30', 10);
const ADMIN_RATE_LIMIT_WINDOW_MS = Number.parseInt(process.env.ADMIN_RATE_LIMIT_WINDOW_SECONDS ?? '60', 10) * 1000;

const rateLimitStore = new Map<string, RateLimitEntry>();

const getClientIp = (request: NextRequest) => {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return 'unknown';
};

const pruneExpiredEntries = (now: number) => {
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.expiresAt <= now) {
      rateLimitStore.delete(key);
    }
  }
};

export const enforceAdminRateLimit = (request: NextRequest, scope: string): RateLimitResult => {
  const now = Date.now();
  pruneExpiredEntries(now);

  const ip = getClientIp(request);
  const key = `${scope}:${ip}`;
  const current = rateLimitStore.get(key);

  if (!current || current.expiresAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      expiresAt: now + ADMIN_RATE_LIMIT_WINDOW_MS,
    });

    return {
      ok: true,
      retryAfterSeconds: 0,
      remaining: Math.max(0, ADMIN_RATE_LIMIT_MAX - 1),
      limit: ADMIN_RATE_LIMIT_MAX,
    };
  }

  if (current.count >= ADMIN_RATE_LIMIT_MAX) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.expiresAt - now) / 1000)),
      remaining: 0,
      limit: ADMIN_RATE_LIMIT_MAX,
    };
  }

  current.count += 1;

  return {
    ok: true,
    retryAfterSeconds: 0,
    remaining: Math.max(0, ADMIN_RATE_LIMIT_MAX - current.count),
    limit: ADMIN_RATE_LIMIT_MAX,
  };
};
