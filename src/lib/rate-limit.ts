const store = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_CONTACT = 10; // max contact submissions per IP per window
const MAX_AUTH = 5; // max login attempts per IP per window

function getKey(ip: string, prefix: string): string {
  return `${prefix}:${ip}`;
}

function cleanup() {
  const now = Date.now();
  Array.from(store.entries()).forEach(([k, v]) => {
    if (v.resetAt < now) store.delete(k);
  });
}

export function checkRateLimit(ip: string, type: 'contact' | 'auth'): { ok: boolean } {
  cleanup();
  const key = getKey(ip, type);
  const max = type === 'contact' ? MAX_CONTACT : MAX_AUTH;
  const now = Date.now();
  const entry = store.get(key);
  if (!entry) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (entry.count >= max) return { ok: false };
  entry.count += 1;
  return { ok: true };
}

export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const xri = request.headers.get('x-real-ip');
  if (xri) return xri.trim();
  return 'unknown';
}
