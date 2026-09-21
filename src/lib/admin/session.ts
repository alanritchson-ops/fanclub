/**
 * Stateless admin session: a signed token in an HttpOnly cookie.
 * Uses Web Crypto only, so it runs in both the proxy and route handlers.
 */
export const SESSION_COOKIE = "fanclub_admin";
export const SESSION_MAX_AGE = 60 * 60 * 12; // 12 hours

const enc = new TextEncoder();

const b64url = (buf: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

async function hmac(data: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set to at least 32 characters");
  }
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(email: string) {
  const payload = b64url(
    enc.encode(JSON.stringify({ sub: email, exp: Date.now() + SESSION_MAX_AGE * 1000 })),
  );
  return `${payload}.${await hmac(payload)}`;
}

/** Returns the admin email if the token is genuine and unexpired. */
export async function verifySessionToken(token?: string): Promise<string | null> {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  try {
    if (!safeEqual(sig, await hmac(payload))) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { sub, exp } = JSON.parse(json) as { sub?: string; exp?: number };
    if (typeof sub !== "string" || typeof exp !== "number" || exp < Date.now()) return null;
    return sub;
  } catch {
    return null;
  }
}
