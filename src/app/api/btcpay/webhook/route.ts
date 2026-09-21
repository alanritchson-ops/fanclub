import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/btcpay";
import { syncInvoice } from "@/lib/payments";

/**
 * BTCPay Server webhook. In your store: Settings > Webhooks > Create, with
 *   URL:    https://<your domain>/api/btcpay/webhook
 *   Secret: the value of BTCPAY_WEBHOOK_SECRET
 *   Events: Invoice settled, processing, expired and invalid
 */
export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyWebhookSignature(raw, req.headers.get("btcpay-sig"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let invoiceId: unknown;
  try {
    invoiceId = (JSON.parse(raw) as { invoiceId?: unknown }).invoiceId;
  } catch {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }
  // Test deliveries and non-invoice events carry no invoice
  if (typeof invoiceId !== "string") return NextResponse.json({ ok: true });

  try {
    await syncInvoice(invoiceId);
  } catch (err) {
    // A non-2xx makes BTCPay retry the delivery
    console.error("[btcpay webhook] sync failed", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
