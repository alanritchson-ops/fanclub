import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LinkButton } from "@/components/ui/Button";
import { passNumber } from "@/lib/mail-templates";
import { btcpayConfigured } from "@/lib/btcpay";
import { getPaymentByOrder, syncInvoice } from "@/lib/payments";
import { AutoRefresh } from "./AutoRefresh";

export const metadata: Metadata = {
  title: "Payment status",
  robots: { index: false, follow: false },
};

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  if (!order) notFound();

  let payment = await getPaymentByOrder(order);
  if (!payment) notFound();

  // Don't wait for the webhook: ask BTCPay right now while it's still open
  if (payment.status === "pending" && btcpayConfigured()) {
    await syncInvoice(payment.invoiceId).catch(() => {});
    payment = (await getPaymentByOrder(order)) ?? payment;
  }
  const first = payment.name.trim().split(/\s+/)[0];

  return (
    <section className="bg-gradient-to-b from-oxblood via-wine to-ink text-bone">
      <div className="mx-auto max-w-[900px] px-5 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40">
        {payment.status === "successful" && (
          <>
            <h1 className="display text-[clamp(2.6rem,9vw,5rem)]">Welcome in, {first}.</h1>
            <p className="mt-6 max-w-[52ch] text-lg text-bone/80">
              Your payment is confirmed and your lifetime VIP pass is active
              {payment.memberNumber ? <> as <strong>No. {passNumber(payment.memberNumber)}</strong></> : null}.
              We&apos;ve emailed the details to {payment.email}.
            </p>
            <LinkButton href="/" variant="light" className="mt-8">
              Back to the club
            </LinkButton>
          </>
        )}
        {payment.status === "pending" && (
          <>
            <AutoRefresh />
            <h1 className="display text-[clamp(2.6rem,9vw,5rem)]">Almost there, {first}.</h1>
            <p role="status" className="mt-6 max-w-[52ch] text-lg text-bone/80">
              We&apos;re waiting for your Bitcoin payment to confirm on the network. This can take
              anywhere from a few minutes to an hour. You can leave this page: your pass is emailed
              to {payment.email} the moment it confirms.
            </p>
          </>
        )}
        {payment.status === "failed" && (
          <>
            <h1 className="display text-[clamp(2.6rem,9vw,5rem)]">That payment didn&apos;t complete.</h1>
            <p className="mt-6 max-w-[52ch] text-lg text-bone/80">
              The checkout expired before a full payment arrived. Nothing has been taken. If you did
              send Bitcoin, email us and we&apos;ll sort it out.
            </p>
            <LinkButton href="/join" variant="light" className="mt-8">
              Try again
            </LinkButton>
          </>
        )}
      </div>
    </section>
  );
}
