import "server-only";
import { Resend } from "resend";
import { acknowledgementEmail, replyEmail, welcomeEmail } from "@/lib/mail-templates";
import { site } from "@/lib/site";

const FROM = () =>
  process.env.RESEND_FROM || `${site.clubName} <${site.emails.support}>`;
const INBOX = () => process.env.CONTACT_TO || site.emails.support;

export function mailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Header values must be a single line */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

const html = (s: string) =>
  `<div style="font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#150a0b;white-space:pre-wrap">${escapeHtml(s)}</div>`;

async function send(payload: Parameters<Resend["emails"]["send"]>[0]) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send(payload);
  if (error) throw new Error(`Resend: ${error.message}`);
  return data?.id;
}

/** New website message: lands in the club inbox, and Reply goes to the sender. */
export async function sendContactNotification(m: {
  name: string;
  email: string;
  topic: string;
  message: string;
  adminUrl?: string;
}) {
  const text = [
    `From: ${m.name} <${m.email}>`,
    `Topic: ${m.topic}`,
    "",
    m.message,
    ...(m.adminUrl ? ["", `Open in the admin panel: ${m.adminUrl}`] : []),
  ].join("\n");

  return send({
    from: FROM(),
    to: INBOX(),
    replyTo: m.email,
    subject: oneLine(`[${m.topic}] Message from ${m.name}`),
    text,
    html: html(text),
  });
}

const brand = () => ({ clubName: site.clubName, url: site.url });

/** Styled "we got it" email to the visitor, sent as soon as they submit the form. */
export async function sendAcknowledgement(m: {
  name: string;
  email: string;
  topic: string;
  message: string;
}) {
  const mail = acknowledgementEmail(brand(), m);
  return send({ from: FROM(), to: m.email, replyTo: INBOX(), ...mail });
}

/** Admin reply, delivered to the fan's own inbox. Their answer comes back to the club inbox. */
export async function sendReply(m: {
  to: string;
  name: string;
  topic: string;
  body: string;
  original: string;
}) {
  const mail = replyEmail(brand(), m);
  return send({ from: FROM(), to: m.to, replyTo: INBOX(), ...mail });
}

/** VIP welcome with the numbered pass, sent when the payment settles. */
export async function sendWelcome(m: { name: string; email: string; memberNumber: number }) {
  if (!mailConfigured()) return;
  const mail = welcomeEmail(brand(), m);
  return send({ from: FROM(), to: m.email, replyTo: INBOX(), ...mail });
}
