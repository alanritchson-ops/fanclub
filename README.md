# Alan Ritchson Fan Club (alanritchsonfanclub.com)

Independent, fan-run site. Next.js 16 (App Router), TypeScript, Tailwind CSS 4. Mobile-first.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Before launch: replace the placeholders

| What | Where |
| --- | --- |
| Emails, social handles, membership price, IMDb link | `src/lib/site.ts` (marked TODO) |
| All page copy, timeline, posters, merch, benefits, FAQ | `src/lib/content.ts` |
| Form handling (join, newsletter, contact) | `src/app/api/subscribe/route.ts` - currently validates and logs only. Connect Resend/Postmark, a newsletter tool and Stripe. |
| Checkout | The cart's "Send order request" opens an email draft. Replace with Stripe Checkout when ready. |

## Photos (optional, picked up automatically)

Drop files in `public/images/` and they replace the designed fallbacks. No code changes.

- `hero.jpg` - hero background (portrait-friendly, subject right of centre)
- `note.jpg` - portrait next to the club note (4:5)
- `store/<product-id>.jpg` - product photos (ids in `content.ts`, e.g. `founding-tee.jpg`)
- `fans/1.jpg` ... `fans/8.jpg` - fan wall

Only use images you have the rights to.

## Structure

```
src/app/            routes: /, /join, /contact, /api/subscribe, sitemap, robots, OG image
src/components/     Header, Footer, sections/, forms/, cart/, ui/
src/lib/            site config, content, image helper
```

Fonts (Inter Tight, Newsreader) are self-hosted via Fontsource, so there are no runtime requests to Google.

## Notes

- This is an unofficial fan club. Keep the disclaimers in the footer, FAQ and pass.
- Motion respects `prefers-reduced-motion`. Accordions, menu, cart and lightbox are keyboard accessible.

## Contact form and admin panel

Website messages are saved to MongoDB and emailed to `hello@alanritchsonfanclub.com` through Resend.
The admin panel at `/admin` lists them and lets the admin reply; replies are emailed to the sender.

1. Copy `.env.example` to `.env.local` and fill it in.
2. In Resend, verify the `alanritchsonfanclub.com` domain so `hello@` can send.
3. Create the admin password hash: `npm run admin:hash -- "a long password"`, then paste the
   `ADMIN_PASSWORD_HASH=...` line into `.env.local` along with `ADMIN_EMAIL` and `SESSION_SECRET`.
4. Sign in at `/admin/login`.

Fans who reply to an admin reply land in the `hello@` inbox (Reply-To), so the conversation continues there.

## VIP payments (Bitcoin via BTCPay Server)

VIP is a one-time, lifetime purchase. The join form creates a BTCPay invoice and sends the fan to BTCPay's
hosted checkout; payment confirmation arrives by webhook, which issues the numbered pass and emails it.
The price lives in `site.membership` in `src/lib/site.ts` (USD, paid in BTC at the live rate).

1. In BTCPay, create a store with an on-chain Bitcoin wallet (and no other payment methods).
2. Create an API key with `btcpay.store.cancreateinvoice` and `btcpay.store.canviewinvoices`.
3. Store > Settings > Webhooks > Create: URL `https://<your domain>/api/btcpay/webhook`, a secret of your
   choosing, and the invoice settled / processing / expired / invalid events.
4. Fill in the `BTCPAY_*` values in `.env.local` (see `.env.example`).
5. Payments appear in `/admin/payments`. A missed webhook can be fixed with "Re-check with BTCPay".
