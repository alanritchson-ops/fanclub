import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { btcpayConfigured, invoiceUrl } from "@/lib/btcpay";
import { passNumber } from "@/lib/mail-templates";
import { mongoConfigured } from "@/lib/mongo";
import {
  PAGE_SIZE,
  PAYMENT_STATUSES,
  listPayments,
  paymentStats,
  type PaymentQuery,
  type PaymentStatus,
} from "@/lib/payments";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/components/forms/Field";
import { LocalTime } from "../LocalTime";
import { recheckPaymentAction } from "../actions";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const btc = (n: number) => `${n.toFixed(8).replace(/0+$/, "").replace(/\.$/, "")} BTC`;

const badge: Record<PaymentStatus, string> = {
  pending: "bg-brass/20 text-brass",
  successful: "bg-emerald-500/20 text-emerald-300",
  failed: "bg-crimson/40 text-red-200",
};

type Params = { status?: string; from?: string; to?: string; q?: string; page?: string };

export default async function PaymentsPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requireAdmin();
  const sp = await searchParams;

  if (!mongoConfigured()) {
    return (
      <p className="rounded-2xl border border-white/15 p-6 text-bone/80">
        MongoDB isn&apos;t connected. Set <code>MONGODB_URI</code> to see payments here.
      </p>
    );
  }

  const status = PAYMENT_STATUSES.find((s) => s === sp.status);
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const query: PaymentQuery = { status, from: sp.from, to: sp.to, q: sp.q };

  let data;
  try {
    const [list, stats] = await Promise.all([listPayments(query, page), paymentStats(query)]);
    data = { ...list, stats };
  } catch (err) {
    console.error("[admin] could not load payments", err);
    return (
      <p className="rounded-2xl border border-white/15 p-6 text-bone/80">
        Couldn&apos;t reach the database. Check <code>MONGODB_URI</code> and try again.
      </p>
    );
  }
  const { payments, total, stats } = data;

  // Links that keep the date range and search but change the status or page
  const href = (over: Partial<Params>) => {
    const p = new URLSearchParams();
    const merged = { status: sp.status, from: sp.from, to: sp.to, q: sp.q, ...over };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const qs = p.toString();
    return qs ? `/admin/payments?${qs}` : "/admin/payments";
  };

  const filtering = Boolean(sp.from || sp.to || sp.q);
  const tabs: { label: string; value?: PaymentStatus; count: number }[] = [
    {
      label: "All",
      count: stats.filtered.pending.n + stats.filtered.successful.n + stats.filtered.failed.n,
    },
    ...PAYMENT_STATUSES.map((s) => ({
      label: s[0].toUpperCase() + s.slice(1),
      value: s,
      count: stats.filtered[s].n,
    })),
  ];
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <h1 className="display text-5xl md:text-6xl">Payments.</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-brass/50 bg-white/[.04] p-6 sm:col-span-2">
          <p className="text-sm text-bone/60">Total received (all successful transactions)</p>
          <p className="display mt-2 text-5xl md:text-6xl">{usd.format(stats.allTime.successful.usd)}</p>
          <p className="mt-2 text-sm text-bone/65">
            {stats.allTime.successful.n} successful
            {stats.allTime.successful.btc > 0 && <> · {btc(stats.allTime.successful.btc)} received</>}
          </p>
        </div>
        <div className="rounded-2xl border border-white/15 p-6">
          <p className="text-sm text-bone/60">Awaiting payment</p>
          <p className="display mt-2 text-4xl">{stats.allTime.pending.n}</p>
          <p className="mt-2 text-sm text-bone/65">{stats.allTime.failed.n} failed or expired</p>
        </div>
      </div>

      <form method="get" action="/admin/payments" className="mt-8 grid gap-4 md:grid-cols-[1fr_auto_auto_auto] md:items-end">
        {status && <input type="hidden" name="status" value={status} />}
        <div>
          <label htmlFor="q" className="mb-2 block text-sm font-medium text-bone/85">
            Search
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={sp.q}
            placeholder="Name, email, invoice or transaction ID"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="from" className="mb-2 block text-sm font-medium text-bone/85">
            From
          </label>
          <input id="from" name="from" type="date" defaultValue={sp.from} className={inputClass} />
        </div>
        <div>
          <label htmlFor="to" className="mb-2 block text-sm font-medium text-bone/85">
            To
          </label>
          <input id="to" name="to" type="date" defaultValue={sp.to} className={inputClass} />
        </div>
        <div className="flex gap-2">
          <Button type="submit" variant="light">
            Apply
          </Button>
          {(filtering || status) && (
            <Link
              href="/admin/payments"
              className="inline-flex min-h-12 items-center rounded-full border border-white/25 px-5 text-sm font-semibold hover:bg-white/10"
            >
              Clear
            </Link>
          )}
        </div>
      </form>
      <p className="mt-2 text-xs text-bone/50">Dates are whole days in UTC.</p>

      <nav aria-label="Filter by status" className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = t.value === status;
          return (
            <Link
              key={t.label}
              href={href({ status: t.value, page: undefined })}
              aria-current={active ? "page" : undefined}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                active ? "border-bone bg-bone text-ink" : "border-white/25 text-bone/80 hover:bg-white/10"
              }`}
            >
              {t.label} <span className="opacity-60">{t.count}</span>
            </Link>
          );
        })}
      </nav>

      {filtering && (
        <p className="mt-4 text-sm text-bone/70">
          In this date range and search: {usd.format(stats.filtered.successful.usd)} from{" "}
          {stats.filtered.successful.n} successful transactions.
        </p>
      )}

      {payments.length === 0 ? (
        <p className="mt-10 text-bone/60">No transactions match.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead className="border-b border-white/10 text-bone/55">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {payments.map((p) => {
                const link = invoiceUrl(p.invoiceId);
                return (
                  <tr key={p.id} className="align-top">
                    <td className="whitespace-nowrap px-4 py-4 text-bone/70">
                      <LocalTime iso={p.createdAt} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-bone/55">{p.email}</div>
                      {p.memberNumber && (
                        <div className="mt-1 text-xs text-brass">Pass No. {passNumber(p.memberNumber)}</div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="font-medium tabular-nums">{usd.format(p.amountUsd)}</div>
                      {p.btcAmount && <div className="text-xs text-bone/55">{btc(p.btcAmount)}</div>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${badge[p.status]}`}>
                        {p.status}
                      </span>
                      <div className="mt-1 text-xs text-bone/50">{p.providerStatus}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="break-all font-mono text-xs text-bone/70">
                        {link ? (
                          <a href={link} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                            {p.invoiceId}
                            <span className="sr-only"> (opens in BTCPay)</span>
                          </a>
                        ) : (
                          p.invoiceId
                        )}
                      </div>
                      {p.status === "pending" && btcpayConfigured() && (
                        <form action={recheckPaymentAction} className="mt-2">
                          <input type="hidden" name="invoiceId" value={p.invoiceId} />
                          <button
                            type="submit"
                            className="text-xs font-semibold text-brass underline underline-offset-2"
                          >
                            Re-check with BTCPay
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <nav aria-label="Pages" className="mt-6 flex items-center justify-between text-sm">
          {page > 1 ? (
            <Link href={href({ page: String(page - 1) })} className="underline underline-offset-4">
              &larr; Newer
            </Link>
          ) : (
            <span />
          )}
          <span className="text-bone/60">
            Page {page} of {pages} · {total} transactions
          </span>
          {page < pages ? (
            <Link href={href({ page: String(page + 1) })} className="underline underline-offset-4">
              Older &rarr;
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  );
}
