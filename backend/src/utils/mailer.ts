import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

let cached: nodemailer.Transporter | null = null;

export const getTransporter = (): nodemailer.Transporter => {
  if (cached) return cached;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    throw new Error('GMAIL_USER and GMAIL_APP_PASSWORD must be set in env');
  }
  cached = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });
  return cached;
};

export interface SendMailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
}

export const sendMail = async ({ to, subject, html, text, fromName }: SendMailParams) => {
  const transporter = getTransporter();
  const from = fromName ? `"${fromName}" <${GMAIL_USER}>` : GMAIL_USER!;
  return transporter.sendMail({ from, to, subject, html, text });
};

export const renderOrderConfirmation = (params: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  charmColorAndStyle: string;
  addInitial: boolean;
  initial?: string | null;
  deliveryMethod: 'PICKUP' | 'MAILING';
  mailingAddress?: string | null;
  storeName: string;
  supportPhone?: string | null;
  supportEmail?: string | null;
}) => {
  const escape = (s: string) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]!));

  const detailsRow = (label: string, value: string) =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#111;font-weight:600;">${value}</td></tr>`;

  const html = `
<!doctype html>
<html><body style="margin:0;padding:0;background:#f6f6f6;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f6;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
        <tr><td style="background:#000;padding:32px;text-align:center;">
          <h1 style="color:#d4af37;margin:0;font-size:28px;letter-spacing:0.05em;">${escape(params.storeName)}</h1>
          <p style="color:#fff;margin:8px 0 0;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;">Order Confirmation</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="font-size:16px;color:#111;margin:0 0 8px;">Hi ${escape(params.customerName)},</p>
          <p style="font-size:14px;color:#444;line-height:1.6;margin:0 0 24px;">
            Thank you for your custom order. We've received your request and will reach out shortly to confirm details.
          </p>
          <p style="font-size:13px;color:#888;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.1em;">Order Number</p>
          <p style="font-size:20px;color:#d4af37;font-weight:bold;margin:0 0 24px;">${escape(params.orderNumber)}</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:8px;overflow:hidden;margin-bottom:24px;">
            ${detailsRow('Name', escape(params.customerName))}
            ${detailsRow('Phone', escape(params.customerPhone))}
            ${detailsRow('Charm Color & Style', escape(params.charmColorAndStyle))}
            ${detailsRow('Initial Added', params.addInitial ? `Yes — "${escape(params.initial || '')}"` : 'No')}
            ${detailsRow('Delivery', params.deliveryMethod === 'PICKUP' ? 'Pick Up' : 'Mailing')}
            ${params.deliveryMethod === 'MAILING' && params.mailingAddress
              ? detailsRow('Mailing Address', escape(params.mailingAddress).replace(/\n/g, '<br>'))
              : ''}
          </table>

          ${params.supportPhone || params.supportEmail ? `
            <p style="font-size:13px;color:#444;margin:0 0 8px;">Questions? Reach us at:</p>
            <p style="font-size:13px;color:#111;margin:0;">
              ${params.supportPhone ? `📞 ${escape(params.supportPhone)}<br>` : ''}
              ${params.supportEmail ? `✉ ${escape(params.supportEmail)}` : ''}
            </p>
          ` : ''}
        </td></tr>
        <tr><td style="background:#fafafa;padding:16px;text-align:center;color:#888;font-size:11px;">
          © ${new Date().getFullYear()} ${escape(params.storeName)}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `Hi ${params.customerName},`,
    ``,
    `Thank you for your custom order with ${params.storeName}.`,
    `Order #${params.orderNumber}`,
    ``,
    `Phone: ${params.customerPhone}`,
    `Charm Color & Style: ${params.charmColorAndStyle}`,
    `Initial: ${params.addInitial ? `Yes — "${params.initial || ''}"` : 'No'}`,
    `Delivery: ${params.deliveryMethod === 'PICKUP' ? 'Pick Up' : 'Mailing'}`,
    params.deliveryMethod === 'MAILING' && params.mailingAddress ? `Mailing Address: ${params.mailingAddress}` : '',
  ].filter(Boolean).join('\n');

  return { html, text };
};
