import "server-only";
import { randomBytes } from "node:crypto";
import type { Filter, WithId } from "mongodb";
import { getDb } from "@/lib/mongo";
import {
  createInvoice,
  getInvoice,
  getInvoicePaid,
  type BtcpayInvoice,
} from "@/lib/btcpay";
import { sendWelcome } from "@/lib/mail";
import { site } from "@/lib/site";

export type PaymentStatus = "pending" | "successful" | "failed";
export const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "successful", "failed"];

type PaymentDoc = {
  orderId: string; // random, unguessable; used in the post-payment URL
  invoiceId: string;
  name: string;
  email: string;
  country?: string;
  amountUsd: number;
  status: PaymentStatus;
  providerStatus: string;
  checkoutUrl: string;
  btcAmount?: number;
  txid?: string;
  memberNumber?: number;
  createdAt: Date;
  paidAt?: Date;
};

type MemberDoc = { email: string; name: string; number: number; paymentInvoiceId: string; joinedAt: Date };

export type Payment = {
  id: string;
  orderId: string;
  invoiceId: string;
  name: string;
  email: string;
  amountUsd: number;
  status: PaymentStatus;
  providerStatus: string;
  btcAmount?: number;
  txid?: string;
  memberNumber?: number;
  createdAt: string;
  paidAt?: string;
};

let indexes: Promise<unknown> | undefined;

async function cols() {
  const db = await getDb();
  const payments = db.collection<PaymentDoc>("payments");
  const members = db.collection<MemberDoc>("members");
  indexes ??= Promise.all([
    payments.createIndex({ invoiceId: 1 }, { unique: true }),
    payments.createIndex({ orderId: 1 }, { unique: true }),
    payments.createIndex({ createdAt: -1 }),
    members.createIndex({ email: 1 }, { unique: true }),
  ]).catch((err) => {
    indexes = undefined;
    console.error("[payments] could not create indexes", err);
  });
  await indexes;
  return { payments, members, counters: db.collection<{ _id: string; seq: number }>("counters") };
}

function toPayment(d: WithId<PaymentDoc>): Payment {
  return {
    id: d._id.toHexString(),
    orderId: d.orderId,
    invoiceId: d.invoiceId,
    name: d.name,
    email: d.email,
    amountUsd: d.amountUsd,
    status: d.status,
    providerStatus: d.providerStatus,
    btcAmount: d.btcAmount,
    txid: d.txid,
    memberNumber: d.memberNumber,
    createdAt: d.createdAt.toISOString(),
    paidAt: d.paidAt?.toISOString(),
  };
}

export class AlreadyMemberError extends Error {}

const statusFromInvoice = (s: BtcpayInvoice["status"]): PaymentStatus =>
  s === "Settled" ? "successful" : s === "Expired" || s === "Invalid" ? "failed" : "pending";

/** Start a lifetime VIP purchase: create the BTCPay invoice and record it as pending. */
export async function createCheckout(input: { name: string; email: string; country?: string }) {
  const { payments, members } = await cols();
  const email = input.email.toLowerCase();

  if (await members.findOne({ email })) throw new AlreadyMemberError();

  // Someone double-clicking or coming back shouldn't spawn a pile of invoices
  const existing = await payments.findOne({
    email,
    status: "pending",
    providerStatus: "New",
    createdAt: { $gt: new Date(Date.now() - 30 * 60 * 1000) },
  });
  if (existing) return { checkoutUrl: existing.checkoutUrl, orderId: existing.orderId };

  const orderId = randomBytes(18).toString("base64url");
  const origin = process.env.SITE_URL || site.url;
  const invoice = await createInvoice({
    amount: site.membership.price,
    currency: site.membership.currencyCode,
    orderId,
    buyerEmail: email,
    description: `${site.clubName} lifetime VIP membership`,
    redirectUrl: `${origin}/join/thanks?order=${orderId}`,
  });

  await payments.insertOne({
    orderId,
    invoiceId: invoice.id,
    name: input.name,
    email,
    country: input.country,
    amountUsd: Number(site.membership.price),
    status: "pending",
    providerStatus: invoice.status,
    checkoutUrl: invoice.checkoutLink,
    createdAt: new Date(),
  });
  return { checkoutUrl: invoice.checkoutLink, orderId };
}

/**
 * Pull the invoice's real state from BTCPay and update our record. Called by the
 * webhook, the thank-you page and the admin "re-check" button. Never trusts a
 * webhook payload: BTCPay is asked directly. Safe to call repeatedly.
 */
export async function syncInvoice(invoiceId: string) {
  const { payments } = await cols();
  const invoice = await getInvoice(invoiceId);
  const status = statusFromInvoice(invoice.status);
  const providerStatus = invoice.additionalStatus && invoice.additionalStatus !== "None"
    ? `${invoice.status} (${invoice.additionalStatus})`
    : invoice.status;

  if (status !== "successful") {
    // Never downgrade a payment that already succeeded
    await payments.updateOne(
      { invoiceId, status: { $ne: "successful" } },
      { $set: { status, providerStatus } },
    );
    return;
  }

  // The atomic flip means only one caller (webhook retry, page load, admin) issues the pass
  const before = await payments.findOneAndUpdate(
    { invoiceId, status: { $ne: "successful" } },
    { $set: { status: "successful", providerStatus, paidAt: new Date() } },
    { returnDocument: "before" },
  );
  if (!before) return;

  const paid = await getInvoicePaid(invoiceId).catch(() => ({}));
  if (Object.keys(paid).length) await payments.updateOne({ invoiceId }, { $set: paid });

  await issueMember(before);
}

async function issueMember(payment: WithId<PaymentDoc>) {
  const { payments, members, counters } = await cols();

  let member = await members.findOne({ email: payment.email });
  const isNew = !member;
  if (!member) {
    const { seq } = (await counters.findOneAndUpdate(
      { _id: "member" },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: "after" },
    ))!;
    const doc: MemberDoc = {
      email: payment.email,
      name: payment.name,
      number: seq,
      paymentInvoiceId: payment.invoiceId,
      joinedAt: new Date(),
    };
    await members.insertOne(doc);
    member = doc as WithId<MemberDoc>;
  }
  await payments.updateOne({ invoiceId: payment.invoiceId }, { $set: { memberNumber: member.number } });

  if (isNew) {
    try {
      await sendWelcome({ name: payment.name, email: payment.email, memberNumber: member.number });
    } catch (err) {
      console.error("[payments] could not send welcome email", err);
    }
  }
}

export async function getPaymentByOrder(orderId: string) {
  const { payments } = await cols();
  const doc = await payments.findOne({ orderId });
  return doc ? toPayment(doc) : null;
}

export async function getPaymentById(invoiceId: string) {
  const { payments } = await cols();
  const doc = await payments.findOne({ invoiceId });
  return doc ? toPayment(doc) : null;
}

// ---- Admin queries --------------------------------------------------------

export type PaymentQuery = { status?: PaymentStatus; from?: string; to?: string; q?: string };

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const isDay = (s?: string) => Boolean(s && /^\d{4}-\d{2}-\d{2}$/.test(s));

/** Dates are whole days in UTC, both ends inclusive. */
function buildFilter(query: PaymentQuery, withStatus = true): Filter<PaymentDoc> {
  const filter: Filter<PaymentDoc> = {};
  if (withStatus && query.status) filter.status = query.status;

  const range: { $gte?: Date; $lt?: Date } = {};
  if (isDay(query.from)) range.$gte = new Date(`${query.from}T00:00:00.000Z`);
  if (isDay(query.to)) range.$lt = new Date(new Date(`${query.to}T00:00:00.000Z`).getTime() + 86_400_000);
  if (range.$gte || range.$lt) filter.createdAt = range;

  const q = query.q?.trim().slice(0, 100);
  if (q) {
    const rx = { $regex: escapeRegex(q), $options: "i" };
    filter.$or = [{ name: rx }, { email: rx }, { invoiceId: rx }, { orderId: rx }, { txid: rx }];
  }
  return filter;
}

export const PAGE_SIZE = 25;

export async function listPayments(query: PaymentQuery, page: number) {
  const { payments } = await cols();
  const filter = buildFilter(query);
  const [docs, total] = await Promise.all([
    payments
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((Math.max(page, 1) - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .toArray(),
    payments.countDocuments(filter),
  ]);
  return { payments: docs.map(toPayment), total };
}

type Sum = { _id: PaymentStatus; n: number; usd: number; btc: number };

async function sums(filter: Filter<PaymentDoc>) {
  const { payments } = await cols();
  const rows = await payments
    .aggregate<Sum>([
      { $match: filter },
      {
        $group: {
          _id: "$status",
          n: { $sum: 1 },
          usd: { $sum: "$amountUsd" },
          btc: { $sum: { $ifNull: ["$btcAmount", 0] } },
        },
      },
    ])
    .toArray();
  const out = {
    pending: { n: 0, usd: 0, btc: 0 },
    successful: { n: 0, usd: 0, btc: 0 },
    failed: { n: 0, usd: 0, btc: 0 },
  };
  for (const r of rows) out[r._id] = { n: r.n, usd: r.usd, btc: r.btc };
  return out;
}

/** All-time totals (headline) and per-status counts for the current date/search filter (tabs). */
export async function paymentStats(query: PaymentQuery) {
  const [allTime, filtered] = await Promise.all([sums({}), sums(buildFilter(query, false))]);
  return { allTime, filtered };
}
