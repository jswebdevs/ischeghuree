---
name: nodemailer-gmail
description: "Send transactional email from ginag-backend via Gmail SMTP using utils/mailer.ts. Use whenever a controller needs to send a confirmation, notification, or reset email. Encapsulates the Gmail App Password flow and the order-confirmation HTML template."
trigger: send email
---

# Nodemailer + Gmail (ginag-backend)

All outgoing email goes through [ginag-backend/src/utils/mailer.ts](../../../ginag-backend/src/utils/mailer.ts). It uses Gmail's SMTP via App Password (NOT OAuth). Credentials come from `.env`:

- `GMAIL_USER` — full Gmail address (sender)
- `GMAIL_APP_PASSWORD` — 16-char app password (NOT the account password)

The transporter is lazy-instantiated and cached so we don't reconnect per-call.

## Sending a transactional email

```ts
import { sendMail } from '../utils/mailer';

await sendMail({
  to: customer.email,
  subject: `Order Confirmation — ${order.orderNumber}`,
  html: '<p>Thanks for your order…</p>',
  text: 'Thanks for your order…',  // fallback for plain-text clients
  fromName: 'Ginag',                // optional — wraps as `"Ginag" <user@gmail.com>`
});
```

Always wrap email sends in `try/catch`. Mail failures should NOT roll back the parent transaction (the order is already saved; logging the failure is enough):

```ts
try {
  await sendMail({ ... });
} catch (mailErr) {
  console.error('Confirmation email failed:', mailErr);
  // do not throw — the order itself succeeded
}
```

## Pre-built templates

`renderOrderConfirmation(params)` returns `{ html, text }` for custom-order confirmations. Used by [customOrder.controller.ts](../../../ginag-backend/src/controllers/customOrder.controller.ts). When adding new templates, follow the same pattern: a `render*` factory in `mailer.ts` that returns `{ html, text }`, then call `sendMail` with the result. Always HTML-escape user input (see the `escape` helper in `mailer.ts`).

## Gotchas

- Gmail's daily send limit is **500/day** for free accounts. Fine for small-business notifications; if volume grows beyond that, swap the transporter for a transactional provider (Resend, SendGrid, AWS SES) — the `sendMail` signature stays stable.
- Gmail rejects mail if the App Password is wrong with a generic auth error. If sends fail in dev, regenerate the App Password at https://myaccount.google.com/apppasswords.
- 2FA must be enabled on the Gmail account for App Passwords to exist at all.
- Do NOT send mail from request handlers without a try/catch — uncaught nodemailer rejections can crash the process.
