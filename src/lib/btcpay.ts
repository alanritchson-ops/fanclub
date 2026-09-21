import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Minimal BTCPay Server (Greenfield API) client.
 * Docs: https://docs.btcpayserver.org/API/Greenfield/v1/
 */

export type BtcpayInvoiceStatus = "New" | "Processing" | "Settled" | "Expired" | "Invalid";

export type BtcpayInvoice = {
  id: string;
  status: BtcpayInvoiceStatus;
  additionalStatus?: string;
  amount: string;
  currency: string;
  checkoutLink: string;
  createdTime: number; // unix seconds
  metadata?: Record<string, unknown>;
};

export function btcpayConfigured() {
  return Boolean(
    process.env.BTCPAY_URL && process.env.BTCPAY_STORE_ID && process.env.BTCPAY_API_KEY,
  );
}

const baseUrl = () => (process.env.BTCPAY_URL ?? "").replace(/\/+$/, "");

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl()}/api/v1${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `token ${process.env.BTCPAY_API_KEY}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`BTCPay ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  return (await res.json()) as T;
}

const store = () => `/stores/${process.env.BTCPAY_STORE_ID}`;

export function createInvoice(input: {
  amount: string;
  currency: string;
  orderId: string;
  buyerEmail: string;
  description: string;
  redirectUrl: string;
}) {
  return api<BtcpayInvoice>(`${store()}/invoices`, {
    method: "POST",
    body: JSON.stringify({
      amount: input.amount,
      currency: input.currency,
      metadata: {
        orderId: input.orderId,
        buyerEmail: input.buyerEmail,
        itemDesc: input.description,
      },
      checkout: { redirectURL: input.redirectUrl, redirectAutomatically: false },
    }),
  });
}

export function getInvoice(id: string) {
  return api<BtcpayInvoice>(`${store()}/invoices/${encodeURIComponent(id)}`);
}

type PaymentMethod = {
  totalPaid?: string;
  payments?: { id?: string }[];
};

/** How much BTC arrived and the on-chain transaction, when BTCPay reports it. */
export async function getInvoicePaid(id: string) {
  const methods = await api<PaymentMethod[]>(
    `${store()}/invoices/${encodeURIComponent(id)}/payment-methods`,
  );
  const pm = methods.find((m) => Number(m.totalPaid) > 0) ?? methods[0];
  if (!pm) return {};
  const btc = Number(pm.totalPaid);
  return {
    btcAmount: Number.isFinite(btc) && btc > 0 ? btc : undefined,
    // BTCPay reports "<txid>-<vout>"
    txid: pm.payments?.[0]?.id?.split("-")[0],
  };
}

/** Webhooks arrive with `BTCPay-Sig: sha256=<hex HMAC-SHA256 of the raw body>`. */
export function verifyWebhookSignature(rawBody: string, header: string | null) {
  const secret = process.env.BTCPAY_WEBHOOK_SECRET;
  if (!secret || !header) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const given = header.replace(/^sha256=/, "");
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const invoiceUrl = (id: string) =>
  baseUrl() ? `${baseUrl()}/invoices/${encodeURIComponent(id)}` : undefined;
