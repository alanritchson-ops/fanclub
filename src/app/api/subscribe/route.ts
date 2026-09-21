import { NextResponse } from "next/server";
import { mailConfigured, sendAcknowledgement, sendContactNotification } from "@/lib/mail";
import { createMessage, TOPICS } from "@/lib/messages";
import { btcpayConfigured } from "@/lib/btcpay";
import { mongoConfigured } from "@/lib/mongo";
import { AlreadyMemberError, createCheckout } from "@/lib/payments";
import { site } from "@/lib/site";

/**
 * Form endpoint for membership sign-ups, newsletter and contact messages.
 *
 * Contact messages are saved to MongoDB (for the admin panel) and emailed to
 * the club inbox through Resend.
 *
 * Join creates a BTCPay Server invoice for the lifetime VIP pass and returns
 * its checkout link; the webhook confirms payment.
 *
 * TODO: connect a real provider for the newsletter (Mailchimp/Buttondown).
 * That form still just validates and logs.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TYPES = new Set(["join", "newsletter", "contact"]);

// Every contact message now triggers an email to the address given, so cap how
// often one client can submit. In-memory (per server instance): a brake against
// casual abuse, not a substitute for edge rate limiting.
const recent = new Map<string, number[]>();
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function tooMany(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > LIMIT;
}

const clean = (v: unknown, max = 500) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: pretend success so bots learn nothing
  if (clean(body.company)) return NextResponse.json({ ok: true });

  const type = clean(body.type, 20);
  const email = clean(body.email, 200);

  if (!TYPES.has(type)) {
    return NextResponse.json({ error: "Unknown form." }, { status: 400 });
  }
  if (!EMAIL.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 422 },
    );
  }
  if (type === "join" && !clean(body.name, 60)) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 422 });
  }
  if (type === "join" && body.agree !== true) {
    return NextResponse.json(
      { error: "Please confirm you've read the fan club terms." },
      { status: 422 },
    );
  }
  if (type === "contact" && clean(body.message, 4000).length < 10) {
    return NextResponse.json(
      { error: "Please write a little more so we can help." },
      { status: 422 },
    );
  }

  if (type === "contact") {
    if (tooMany(req)) {
      return NextResponse.json(
        { error: "You've sent a few messages already. Please try again in a little while." },
        { status: 429 },
      );
    }
    return handleContact(body, email);
  }

  if (type === "join") {
    if (tooMany(req)) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again in a little while." },
        { status: 429 },
      );
    }
    return handleJoin(body, email);
  }

  console.log("[fanclub form]", {
    type,
    email,
    name: clean(body.name, 60),
    topic: clean(body.topic, 60),
  });

  return NextResponse.json({ ok: true });
}

async function handleContact(body: Record<string, unknown>, email: string) {
  const topicInput = clean(body.topic, 60);
  const message = {
    name: clean(body.name, 60) || "Anonymous",
    email,
    topic: TOPICS.find((t) => t === topicInput) ?? "Something else",
    message: clean(body.message, 4000),
  };

  if (!mongoConfigured() && !mailConfigured()) {
    // Local development without credentials: keep the form testable
    console.log("[fanclub contact, not delivered: no MONGODB_URI or RESEND_API_KEY]", message);
    return NextResponse.json({ ok: true });
  }

  // Save first so a mail outage never loses a message. Each step is allowed to
  // fail on its own; the visitor only sees an error if neither worked.
  let id: string | undefined;
  let stored = false;
  let mailed = false;

  if (mongoConfigured()) {
    try {
      id = await createMessage(message);
      stored = true;
    } catch (err) {
      console.error("[fanclub contact] could not save message", err);
    }
  }

  if (mailConfigured()) {
    const adminUrl = id ? `${site.url}/admin/messages/${id}` : undefined;
    const [notice, ack] = await Promise.allSettled([
      sendContactNotification({ ...message, adminUrl }),
      sendAcknowledgement(message),
    ]);
    mailed = notice.status === "fulfilled";
    if (notice.status === "rejected") {
      console.error("[fanclub contact] could not send notification", notice.reason);
    }
    // The visitor's confirmation failing must never fail their submission
    if (ack.status === "rejected") {
      console.error("[fanclub contact] could not send acknowledgement", ack.reason);
    }
  }

  if (!stored && !mailed) {
    return NextResponse.json(
      { error: "We couldn't send your message right now. Please try again shortly." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}

async function handleJoin(body: Record<string, unknown>, email: string) {
  if (!mongoConfigured() || !btcpayConfigured()) {
    console.error("[fanclub join] MONGODB_URI or BTCPAY_* is not configured");
    return NextResponse.json(
      { error: "Membership sign-up isn't available right now. Please try again soon." },
      { status: 503 },
    );
  }
  try {
    const { checkoutUrl } = await createCheckout({
      name: clean(body.name, 60),
      email,
      country: clean(body.country, 60) || undefined,
    });
    return NextResponse.json({ ok: true, checkoutUrl });
  } catch (err) {
    if (err instanceof AlreadyMemberError) {
      return NextResponse.json(
        { error: "That email already has a VIP pass. Check your inbox for the welcome email." },
        { status: 409 },
      );
    }
    console.error("[fanclub join] could not start checkout", err);
    return NextResponse.json(
      { error: "We couldn't start your payment. Please try again shortly." },
      { status: 502 },
    );
  }
}
