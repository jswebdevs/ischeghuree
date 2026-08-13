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

// ── Ische Ghuree brand palette (mirrors DESIGN.md §1) ──────────────────────
// Sky-blue primary on white; kite facet colours as decorative accents only.
const BRAND = {
  sky: '#1971c2', // primary — headers, buttons, links
  navy: '#14263d', // deep slate-navy body text
  slate: '#5c6f82', // muted secondary text
  cloud: '#f2f7fb', // cool cloud-white background
  border: '#d7e4ee',
  kiteCyan: '#22b8cf',
  kiteOrange: '#f76707',
  kiteMagenta: '#e64980',
  kiteGreen: '#37b24d',
};

const escapeHtml = (s: string) =>
  String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]!));

// A thin 4-facet kite strip used as a decorative divider under the header.
const kiteStrip = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
  <td style="height:4px;background:${BRAND.kiteCyan};" width="25%"></td>
  <td style="height:4px;background:${BRAND.kiteOrange};" width="25%"></td>
  <td style="height:4px;background:${BRAND.kiteMagenta};" width="25%"></td>
  <td style="height:4px;background:${BRAND.kiteGreen};" width="25%"></td>
</tr></table>`;

const emailShell = (storeName: string, headerLine: string, bodyHtml: string) => `
<!doctype html>
<html><body style="margin:0;padding:0;background:${BRAND.cloud};font-family:'Hind Siliguri',Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cloud};padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;border:1px solid ${BRAND.border};">
        <tr><td style="background:${BRAND.sky};padding:28px 32px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:26px;letter-spacing:0.02em;">${escapeHtml(storeName)}</h1>
          <p style="color:#d6e9ff;margin:8px 0 0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;">${headerLine}</p>
        </td></tr>
        <tr><td>${kiteStrip}</td></tr>
        <tr><td style="padding:32px;">${bodyHtml}</td></tr>
        <tr><td style="background:${BRAND.cloud};padding:16px;text-align:center;color:${BRAND.slate};font-size:11px;">
          আভিজাত্যের ছোঁয়া… — A touch of elegance…<br>
          © ${new Date().getFullYear()} ${escapeHtml(storeName)}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

const contactBlock = (supportPhone?: string | null, supportEmail?: string | null) =>
  supportPhone || supportEmail
    ? `
    <p style="font-size:13px;color:${BRAND.slate};margin:24px 0 8px;">প্রশ্ন আছে? যোগাযোগ করুন — Questions? Reach us at:</p>
    <p style="font-size:13px;color:${BRAND.navy};margin:0;">
      ${supportPhone ? `📞 ${escapeHtml(supportPhone)}<br>` : ''}
      ${supportEmail ? `✉ ${escapeHtml(supportEmail)}` : ''}
    </p>`
    : '';

const ORDER_TYPE_LABELS: Record<string, string> = {
  RETAIL: 'খুচরা — Retail',
  WHOLESALE: 'পাইকারী — Wholesale',
};

export const renderOrderConfirmation = (params: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  productDetails: string;
  quantity?: number | null;
  orderType: string;
  deliveryMethod: 'PICKUP' | 'MAILING';
  mailingAddress?: string | null;
  storeName: string;
  supportPhone?: string | null;
  supportEmail?: string | null;
}) => {
  const detailsRow = (label: string, value: string) =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid ${BRAND.border};color:${BRAND.slate};font-size:12px;letter-spacing:0.04em;">${label}</td><td style="padding:8px 12px;border-bottom:1px solid ${BRAND.border};color:${BRAND.navy};font-weight:600;">${value}</td></tr>`;

  const orderTypeLabel = ORDER_TYPE_LABELS[params.orderType] || params.orderType;
  const deliveryLabel = params.deliveryMethod === 'PICKUP' ? 'পিক আপ — Pick Up' : 'মেইলিং — Mailing';

  const body = `
    <p style="font-size:16px;color:${BRAND.navy};margin:0 0 8px;">প্রিয় ${escapeHtml(params.customerName)},</p>
    <p style="font-size:14px;color:${BRAND.navy};line-height:1.7;margin:0 0 4px;">
      আপনার অর্ডারটি আমরা পেয়েছি। বিস্তারিত নিশ্চিত করতে আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
    </p>
    <p style="font-size:13px;color:${BRAND.slate};line-height:1.6;margin:0 0 24px;">
      Thank you for your order. We've received your request and will reach out shortly to confirm details.
    </p>
    <p style="font-size:13px;color:${BRAND.slate};margin:0 0 4px;letter-spacing:0.08em;">অর্ডার নম্বর — Order Number</p>
    <p style="font-size:20px;color:${BRAND.sky};font-weight:bold;margin:0 0 24px;">${escapeHtml(params.orderNumber)}</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BRAND.border};border-radius:8px;overflow:hidden;margin-bottom:24px;">
      ${detailsRow('নাম — Name', escapeHtml(params.customerName))}
      ${detailsRow('ফোন — Phone', escapeHtml(params.customerPhone))}
      ${detailsRow('পণ্যের বিবরণ — Product Details', escapeHtml(params.productDetails))}
      ${params.quantity != null ? detailsRow('পরিমাণ — Quantity', escapeHtml(String(params.quantity))) : ''}
      ${detailsRow('অর্ডারের ধরন — Order Type', escapeHtml(orderTypeLabel))}
      ${detailsRow('ডেলিভারি — Delivery', deliveryLabel)}
      ${params.deliveryMethod === 'MAILING' && params.mailingAddress
        ? detailsRow('ঠিকানা — Mailing Address', escapeHtml(params.mailingAddress).replace(/\n/g, '<br>'))
        : ''}
    </table>
    ${contactBlock(params.supportPhone, params.supportEmail)}`;

  const html = emailShell(params.storeName, 'Order Confirmation', body);

  const text = [
    `প্রিয় ${params.customerName},`,
    ``,
    `আপনার অর্ডারটি আমরা পেয়েছি। Thank you for your order with ${params.storeName}.`,
    `অর্ডার নম্বর / Order #${params.orderNumber}`,
    ``,
    `ফোন / Phone: ${params.customerPhone}`,
    `পণ্যের বিবরণ / Product Details: ${params.productDetails}`,
    params.quantity != null ? `পরিমাণ / Quantity: ${params.quantity}` : '',
    `অর্ডারের ধরন / Order Type: ${ORDER_TYPE_LABELS[params.orderType] || params.orderType}`,
    `ডেলিভারি / Delivery: ${params.deliveryMethod === 'PICKUP' ? 'Pick Up' : 'Mailing'}`,
    params.deliveryMethod === 'MAILING' && params.mailingAddress ? `ঠিকানা / Mailing Address: ${params.mailingAddress}` : '',
  ].filter(Boolean).join('\n');

  return { html, text };
};

const DELIVERY_STATUS_LABELS: Record<string, string> = {
  PENDING: 'অপেক্ষমাণ — Pending',
  DISPATCHED: 'প্রেরণ হয়েছে — Dispatched',
  IN_TRANSIT: 'পথে আছে — In Transit',
  OUT_FOR_DELIVERY: 'ডেলিভারির পথে — Out for Delivery',
  DELIVERED: 'ডেলিভারি সম্পন্ন — Delivered',
  RETURNED: 'ফেরত — Returned',
  CANCELLED: 'বাতিল — Cancelled',
};

export const renderDeliveryStatusUpdate = (params: {
  orderNumber: string;
  customerName: string;
  newStatus: string;
  previousStatus?: string;
  deliveryProvider?: string | null;
  trackingUrl?: string | null;
  deliveryNote?: string | null;
  storeName: string;
  supportPhone?: string | null;
  supportEmail?: string | null;
}) => {
  const label = DELIVERY_STATUS_LABELS[params.newStatus] || params.newStatus;

  const trackButton = params.trackingUrl
    ? `<a href="${escapeHtml(params.trackingUrl)}" style="display:inline-block;background:${BRAND.sky};color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600;font-size:14px;letter-spacing:0.03em;">পার্সেল ট্র্যাক করুন — Track Your Parcel</a>`
    : '';

  const providerLine = params.deliveryProvider
    ? `<p style="font-size:13px;color:${BRAND.navy};margin:0 0 4px;"><strong>ক্যারিয়ার — Carrier:</strong> ${escapeHtml(params.deliveryProvider)}</p>`
    : '';

  const noteBlock = params.deliveryNote
    ? `<p style="font-size:13px;color:${BRAND.slate};margin:16px 0 0;font-style:italic;">${escapeHtml(params.deliveryNote)}</p>`
    : '';

  const body = `
    <p style="font-size:16px;color:${BRAND.navy};margin:0 0 8px;">প্রিয় ${escapeHtml(params.customerName)},</p>
    <p style="font-size:14px;color:${BRAND.navy};line-height:1.7;margin:0 0 4px;">
      আপনার অর্ডার <strong>${escapeHtml(params.orderNumber)}</strong>-এর ডেলিভারি অবস্থা হালনাগাদ হয়েছে।
    </p>
    <p style="font-size:13px;color:${BRAND.slate};line-height:1.6;margin:0 0 24px;">
      The delivery status of your order has been updated.
    </p>
    <p style="font-size:13px;color:${BRAND.slate};margin:0 0 4px;letter-spacing:0.08em;">বর্তমান অবস্থা — Current Status</p>
    <p style="font-size:22px;color:${BRAND.kiteMagenta};font-weight:bold;margin:0 0 24px;">${escapeHtml(label)}</p>
    ${providerLine}
    ${trackButton ? `<div style="margin:16px 0 8px;">${trackButton}</div>` : ''}
    ${noteBlock}
    ${contactBlock(params.supportPhone, params.supportEmail)}`;

  const html = emailShell(params.storeName, 'Delivery Update', body);

  const text = [
    `প্রিয় ${params.customerName},`,
    ``,
    `আপনার অর্ডার ${params.orderNumber}-এর ডেলিভারি অবস্থা হালনাগাদ হয়েছে। The delivery status of your order has been updated.`,
    ``,
    `বর্তমান অবস্থা / Current Status: ${label}`,
    params.deliveryProvider ? `ক্যারিয়ার / Carrier: ${params.deliveryProvider}` : '',
    params.trackingUrl ? `ট্র্যাক / Track: ${params.trackingUrl}` : '',
    params.deliveryNote ? `নোট / Note: ${params.deliveryNote}` : '',
  ].filter(Boolean).join('\n');

  return { html, text };
};

export const renderVerificationEmail = (params: {
  name: string;
  verifyUrl: string;
  storeName: string;
}) => {
  const body = `
    <p style="font-size:16px;color:${BRAND.navy};margin:0 0 8px;">প্রিয় ${escapeHtml(params.name)},</p>
    <p style="font-size:14px;color:${BRAND.navy};line-height:1.7;margin:0 0 4px;">
      ${escapeHtml(params.storeName)}-এ স্বাগতম! আপনার অ্যাকাউন্ট চালু করতে নিচের বোতামে ক্লিক করে ইমেইল ঠিকানাটি নিশ্চিত করুন।
    </p>
    <p style="font-size:13px;color:${BRAND.slate};line-height:1.6;margin:0 0 24px;">
      Welcome! Please confirm your email address by clicking the button below to activate your account.
    </p>
    <div style="margin:0 0 24px;">
      <a href="${escapeHtml(params.verifyUrl)}" style="display:inline-block;background:${BRAND.sky};color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:600;font-size:14px;letter-spacing:0.03em;">ইমেইল ভেরিফাই করুন — Verify Email</a>
    </div>
    <p style="font-size:12px;color:${BRAND.slate};line-height:1.6;margin:0;">
      বোতামটি কাজ না করলে এই লিংকটি ব্রাউজারে খুলুন — If the button doesn't work, open this link in your browser:<br>
      <a href="${escapeHtml(params.verifyUrl)}" style="color:${BRAND.sky};word-break:break-all;">${escapeHtml(params.verifyUrl)}</a>
    </p>`;

  const html = emailShell(params.storeName, 'Email Verification', body);

  const text = [
    `প্রিয় ${params.name},`,
    ``,
    `${params.storeName}-এ স্বাগতম! Welcome to ${params.storeName}!`,
    `আপনার ইমেইল ঠিকানা নিশ্চিত করতে এই লিংকটি খুলুন — Please verify your email address by opening this link:`,
    params.verifyUrl,
  ].join('\n');

  return { html, text };
};
