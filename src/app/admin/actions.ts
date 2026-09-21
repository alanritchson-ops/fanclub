"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { verifyPassword } from "@/lib/admin/password";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
} from "@/lib/admin/session";
import { sendReply } from "@/lib/mail";
import { addReply, getMessage, setStatus, STATUSES, type MessageStatus } from "@/lib/messages";

export type FormState = { error?: string; ok?: boolean };

// Basic brute-force brake: 5 failures per IP per 15 minutes. In-memory, so it
// is per server instance; put a real limiter in front for anything stricter.
const attempts = new Map<string, { n: number; resetAt: number }>();
const WINDOW = 15 * 60 * 1000;

async function clientKey() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !hash || !process.env.SESSION_SECRET) {
    return { error: "Admin sign-in isn't configured on this server yet." };
  }

  const key = await clientKey();
  const now = Date.now();
  const entry = attempts.get(key);
  if (entry && entry.resetAt > now && entry.n >= 5) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  // Always run the hash check so timing doesn't reveal whether the email matched
  const passwordOk = await verifyPassword(password, hash);
  if (!passwordOk || email !== adminEmail) {
    const fresh = entry && entry.resetAt > now ? entry : { n: 0, resetAt: now + WINDOW };
    attempts.set(key, { ...fresh, n: fresh.n + 1 });
    return { error: "That email or password isn't right." };
  }

  attempts.delete(key);
  (await cookies()).set(SESSION_COOKIE, await createSessionToken(adminEmail), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function logoutAction() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/admin" });
  redirect("/admin/login");
}

export async function replyAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const body = String(formData.get("body") ?? "").trim();

  if (body.length < 2) return { error: "Write a reply first." };
  if (body.length > 8000) return { error: "That reply is too long (8000 characters max)." };

  const message = await getMessage(id);
  if (!message) return { error: "That message no longer exists." };

  let resendId: string | undefined;
  try {
    resendId = await sendReply({
      to: message.email,
      name: message.name,
      topic: message.topic,
      body,
      original: message.message,
    });
  } catch (err) {
    console.error("[admin reply] send failed", err);
    return { error: "The email couldn't be sent. Nothing was recorded, so you can try again." };
  }

  await addReply(id, body, resendId);
  revalidatePath("/admin");
  revalidatePath(`/admin/messages/${id}`);
  return { ok: true };
}

export async function statusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as MessageStatus;
  if (!STATUSES.includes(status)) return;
  await setStatus(id, status);
  revalidatePath("/admin");
  revalidatePath(`/admin/messages/${id}`);
}
