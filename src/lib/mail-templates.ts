/**
 * Branded HTML emails. Table layout and inline styles only, because email
 * clients ignore most modern CSS. Self-contained (no app imports) so it can
 * be previewed on its own.
 */

const C = {
  ink: "#150a0b",
  crimson: "#a51b21",
  oxblood: "#6f0f14",
  bone: "#f3ece5",
  paper: "#e6dbd0",
  brass: "#c8a56a",
  muted: "#6b5b58",
};

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Blank lines become paragraphs, single newlines become line breaks. */
const paragraphs = (s: string, style: string) =>
  s
    .trim()
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 16px;${style}">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");

type Brand = { clubName: string; url: string };

function layout(brand: Brand, preheader: string, inner: string) {
  const site = brand.url.replace(/^https?:\/\//, "");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(brand.clubName)}</title>
</head>
<body style="margin:0;padding:0;background:${C.bone};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.bone};">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${C.bone};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;">
      <tr><td style="background:${C.oxblood};background-image:linear-gradient(135deg,${C.crimson},${C.oxblood});padding:28px 32px;">
        <span style="font:800 13px/1 -apple-system,'Segoe UI',Helvetica,Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:${C.brass};">&#9733;&nbsp; Official fan club</span>
        <div style="margin-top:10px;font:800 28px/1.1 -apple-system,'Segoe UI',Helvetica,Arial,sans-serif;letter-spacing:-.02em;color:#ffffff;">Alan Ritchson</div>
      </td></tr>
      <tr><td style="padding:36px 32px 12px;font:16px/1.65 -apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:${C.ink};">
        ${inner}
      </td></tr>
      <tr><td style="padding:8px 32px 32px;">
        <div style="border-top:1px solid ${C.paper};padding-top:20px;font:13px/1.6 -apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:${C.muted};">
          We will never message you first asking for money, gift cards or a private meet-up. Payment details only ever come from our team in reply to a request you sent. If someone contacts you first, it isn&rsquo;t us.
          <br><br>
          <a href="${escapeHtml(brand.url)}" style="color:${C.crimson};text-decoration:underline;">${escapeHtml(site)}</a>
        </div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

const quote = (label: string, text: string) => `
<div style="margin:24px 0 8px;padding:16px 18px;background:${C.bone};border-left:3px solid ${C.brass};border-radius:0 12px 12px 0;">
  <div style="font:700 12px/1 -apple-system,'Segoe UI',Helvetica,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${C.muted};margin-bottom:10px;">${escapeHtml(label)}</div>
  ${paragraphs(text, `font-size:15px;color:${C.ink};`)}
</div>`;

export const VIP_TOPIC = "VIP membership request";

const firstName = (name: string) => name.trim().split(/\s+/)[0] || "there";

/** Sent to the visitor right after they submit the contact form. */
export function acknowledgementEmail(
  brand: Brand,
  m: { name: string; topic: string; message: string },
) {
  const first = firstName(m.name);
  const vip = m.topic === VIP_TOPIC;
  const subject = vip ? `We got your VIP request, ${first}` : `We got your message, ${first}`;
  const html = layout(
    brand,
    `Thanks for writing. We've received your message about ${m.topic.toLowerCase()}.`,
    `<h1 style="margin:0 0 20px;font:800 26px/1.15 -apple-system,'Segoe UI',Helvetica,Arial,sans-serif;letter-spacing:-.02em;">${vip ? "Thanks for your interest" : "Thanks for writing"}, ${escapeHtml(first)}.</h1>
     ${
       vip
         ? `<p style="margin:0 0 16px;">We&rsquo;ve received your request to join the VIP club. A member of the ${escapeHtml(brand.clubName)} team will email you personally, usually within two business days, with the payment options and next steps. Your numbered pass is issued once payment is confirmed.</p>
     <p style="margin:0 0 16px;">There&rsquo;s nothing else you need to do. Here&rsquo;s the request we received:</p>`
         : `<p style="margin:0 0 16px;">Your message has reached the ${escapeHtml(brand.clubName)} team. Every message is read by a person, and we&rsquo;ll reply to you by email, usually within two business days.</p>
     <p style="margin:0 0 16px;">You don&rsquo;t need to send it again. For reference, here&rsquo;s what you told us about <strong>${escapeHtml(m.topic.toLowerCase())}</strong>:</p>`
     }
     ${quote(vip ? "Your request" : "Your message", m.message)}
     <p style="margin:24px 0 0;">With thanks,<br><strong>The ${escapeHtml(brand.clubName)} team</strong></p>`,
  );
  const text = [
    vip ? `Thanks for your interest, ${first}.` : `Thanks for writing, ${first}.`,
    "",
    vip
      ? `We've received your request to join the VIP club. A member of the ${brand.clubName} team will email you personally, usually within two business days, with the payment options and next steps. Your numbered pass is issued once payment is confirmed.`
      : `Your message has reached the ${brand.clubName} team. Every message is read by a person, and we'll reply by email, usually within two business days.`,
    "",
    vip ? "Your request:" : `Your message about ${m.topic.toLowerCase()}:`,
    ...m.message.split("\n").map((l) => `> ${l}`),
    "",
    "With thanks,",
    `The ${brand.clubName} team`,
    brand.url,
  ].join("\n");
  return { subject, html, text };
}

/** The admin's answer, sent to the visitor's inbox. */
export function replyEmail(
  brand: Brand,
  m: { name: string; topic: string; body: string; original: string },
) {
  const first = firstName(m.name);
  const subject = `Re: ${m.topic}`;
  const html = layout(
    brand,
    m.body.replace(/\s+/g, " ").slice(0, 90),
    `<p style="margin:0 0 16px;">Hi ${escapeHtml(first)},</p>
     ${paragraphs(m.body, "")}
     <p style="margin:24px 0 0;">Best,<br><strong>The ${escapeHtml(brand.clubName)} team</strong></p>
     ${quote("You wrote", m.original)}
     <p style="margin:16px 0 0;font-size:14px;color:${C.muted};">Just reply to this email to keep the conversation going.</p>`,
  );
  const text = [
    `Hi ${first},`,
    "",
    m.body.trim(),
    "",
    "Best,",
    `The ${brand.clubName} team`,
    "",
    "---",
    "You wrote:",
    ...m.original.split("\n").map((l) => `> ${l}`),
    "",
    brand.url,
  ].join("\n");
  return { subject, html, text };
}
