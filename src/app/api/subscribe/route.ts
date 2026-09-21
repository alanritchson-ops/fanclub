import { NextResponse } from "next/server";
import { mailConfigured, sendAcknowledgement, sendContactNotification } from "@/lib/mail";
import { createMessage, TOPICS } from "@/lib/messages";
import { mongoConfigured } from "@/lib/mongo";
import { VIP_TOPIC } from "@/lib/mail-templates";
import { site, vipPriceLabel } from "@/lib/site";

/**
 * Form endpoint for membership sign-ups, newsletter and contact messages.
 *
 * Contact messages are saved to MongoDB (for the admin panel) and emailed to
 * the club inbox through Resend.
 *
 * A VIP join is a request: it goes through the same pipeline as a contact
 * message (saved, emailed to the club, acknowledged to the fan) and the admin
 * follows up with payment options.
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
    const country = clean(body.country, 60);
    return handleContact(
      {
        name: body.name,
        topic: VIP_TOPIC,
        message: [
          `VIP membership request (lifetime, ${vipPriceLabel}).`,
          `Country: ${country || "not given"}`,
          "",
          "Please send the payment options.",
        ].join("\n"),
      },
      email,
    );
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
