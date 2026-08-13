import * as dotenv from 'dotenv';
import * as path from 'path';

// Load the correct .env file before anything else
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Use DIRECT_URL for the seed script to avoid pooler issues
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 20000, // 20 seconds
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─────────────────────────────────────────────────────────────────────────────
// ইচ্ছে ঘুড়ি — Ische Ghuree storefront pages.
// Bangla-first with English echo (BRAND.md voice). Real contact everywhere:
// 01820-417426 · ischeghuree@gmail.com · Dhaka Uddan, Mohammadpur, Dhaka 1207
// · facebook.com/iccheghureeofficial · hours: always open.
// Delivery model: inside Dhaka 1–3 days (home delivery), outside Dhaka 3–7
// days via courier, no international shipping.
//
// Format notes (frontend template contracts):
// - FAQ page must keep the `<p><strong>Q: …</strong><br>answer</p>` pattern —
//   FAQTemplate splits on `<p><strong>Q:` and `<br>` to build the accordion.
// - Custom Order Process must keep keycap-numbered paragraphs (`<p>1️⃣ …`) —
//   ProcessTemplate splits on them; the first two words of each step become
//   the step-card title, so each step leads with a short English title.
// ─────────────────────────────────────────────────────────────────────────────

const pages = [
  {
    title: 'About Us',
    slug: 'about-us',
    content: [
      {
        type: 'rich-text',
        data: {
          content: `
            <h2>ইচ্ছে ঘুড়ি — Ische Ghuree 🪁</h2>
            <p><strong>আভিজাত্যের ছোঁয়া… A touch of elegance…</strong></p>
            <p>২০২০ সালের ২৫ আগস্ট, ঢাকার মোহাম্মদপুরের ঢাকা উদ্যান থেকে আমাদের যাত্রা শুরু। ছেলেবেলার ঘুড়ির মতোই — যার সুতোয় বাঁধা থাকে ইচ্ছে আর স্বপ্ন — ইচ্ছে ঘুড়ি উড়িয়ে চলেছে আবহমান বাংলার ঐতিহ্য। Our journey began on 25 August 2020 at Dhaka Uddan, Mohammadpur. Like the kites of childhood — strings tied to wishes and dreams — Ische Ghuree keeps the timeless heritage of Bengal flying.</p>
            <h3>আমরা যা তৈরি করি — What we make</h3>
            <ul>
              <li><strong>পাটের ব্যাগ — Jute bags:</strong> বাংলার সোনালী আঁশে বোনা পরিবেশবান্ধব টোট ও শপার — খুচরা ও পাইকারী। Eco-friendly totes and shoppers woven from Bengal's golden fibre — retail and wholesale.</li>
              <li><strong>হেয়ার অ্যাক্সেসরিজ — Hair accessories:</strong> স্যাটিন ও ভেলভেট স্ক্রাঞ্চি, হেডব্যান্ড, বো — বিশ্বমানের সংগ্রহ। World-class satin and velvet scrunchies, headbands and bows.</li>
              <li><strong>নাইট কেয়ার — Night comfort:</strong> রাতের প্রশান্তি, ইচ্ছে ঘুড়ি'র যত্ন — নরম স্যাটিনে সারা রাত চুলের যত্ন। Soft satin that cares for your hair all night long.</li>
            </ul>
            <h3>আমাদের প্রতিশ্রুতি — Our promise</h3>
            <p>প্রতিটি অর্ডারে যত্নের ছোঁয়া, পরিবেশের প্রতি দায়িত্ব, আর সবসময় খোলা দরজা। Care in every order, responsibility to the environment, and doors that are always open.</p>
            <p>📍 Dhaka Uddan, Mohammadpur, Dhaka 1207 · 📞 01820-417426 · ✉️ ischeghuree@gmail.com · 👍 facebook.com/iccheghureeofficial</p>
          `,
        },
      },
    ],
  },
  {
    title: 'Contact Us',
    slug: 'contact-us',
    content: [
      {
        type: 'rich-text',
        data: {
          content: `
            <h2>যোগাযোগ করুন — Contact Us</h2>
            <p>প্রশ্ন, কোটেশন বা পাইকারী অর্ডার — আমরা সবসময় খোলা। Questions, quotes or wholesale orders — we are always open.</p>
            <p>📞 ফোন — Phone: 01820-417426</p>
            <p>✉️ ইমেইল — Email: ischeghuree@gmail.com</p>
            <p>📍 ঠিকানা — Address: Dhaka Uddan, Mohammadpur, Dhaka 1207, Bangladesh</p>
            <p>👍 ফেসবুক — Facebook: facebook.com/iccheghureeofficial</p>
            <h3>🕒 সময় — Hours</h3>
            <p>সবসময় খোলা — Always open. কল বা মেসেজ করুন যেকোনো সময়; আমরা সাধারণত কয়েক ঘণ্টার মধ্যেই উত্তর দিই। Call or message any time; we usually reply within a few hours.</p>
            <p>👉 দ্রুততম উত্তরের জন্য সরাসরি কল করুন বা ফেসবুক পেজে মেসেজ পাঠান। For the fastest response, call us directly or message our Facebook page.</p>
          `,
        },
      },
    ],
  },
  {
    title: 'Custom Order Process',
    slug: 'custom-order-process',
    content: [
      {
        type: 'rich-text',
        data: {
          content: `
            <h2>কাস্টম অর্ডার যেভাবে হয় — How Custom Orders Work</h2>
            <p>1️⃣ Browse Catalog — শপ থেকে পাটের ব্যাগ বা হেয়ার অ্যাক্সেসরিজ পছন্দ করুন, অথবা নিজের ডিজাইনের কথা ভাবুন। Browse the catalog and pick your favourite, or bring your own design idea.</p>
            <p>2️⃣ Request Quote — অর্ডার ফর্ম পূরণ করুন বা 01820-417426 নম্বরে কল করুন — খুচরা বা পাইকারী, পরিমাণসহ জানান। Fill in the order form or call us with your quantity — retail or wholesale.</p>
            <p>3️⃣ Confirm Order — আমরা কল করে দাম, ডিজাইন আর ডেলিভারির খুঁটিনাটি চূড়ান্ত করি। We call you back to confirm price, design and delivery details together.</p>
            <p>4️⃣ We Prepare — আপনার অর্ডার যত্নে তৈরি ও প্যাক করা হয় — কাস্টম পাটের ব্যাগে ২–৫ কর্মদিবস লাগতে পারে। Your order is prepared and packed with care; custom jute bags may take 2–5 working days.</p>
            <p>5️⃣ Home Delivery — ঢাকার ভিতরে ১–৩ দিনে হোম ডেলিভারি, ঢাকার বাইরে কুরিয়ারে ৩–৭ দিন। Home delivery in 1–3 days inside Dhaka, 3–7 days by courier elsewhere in Bangladesh.</p>
          `,
        },
      },
    ],
  },
  {
    title: 'Shipping Policy',
    slug: 'shipping-policy',
    content: [
      {
        type: 'rich-text',
        data: {
          content: `
            <h2>ডেলিভারি তথ্য — Shipping & Delivery</h2>
            <h3>📦 প্রস্তুতির সময় — Processing time</h3>
            <p>স্টকে থাকা পণ্য ১ কর্মদিবসের মধ্যে প্যাক করা হয়; কাস্টম বা পাইকারী পাটের ব্যাগে ২–৫ কর্মদিবস লাগতে পারে। In-stock items are packed within one working day; custom or wholesale jute bags may take 2–5 working days.</p>
            <h3>🚚 ডেলিভারির সময় — Delivery time</h3>
            <ul>
              <li>ঢাকার ভিতরে — Inside Dhaka: ১–৩ দিন, হোম ডেলিভারি · 1–3 days, home delivery</li>
              <li>ঢাকার বাইরে — Outside Dhaka: ৩–৭ দিন, কুরিয়ার সার্ভিসে · 3–7 days via courier</li>
            </ul>
            <p>🌍 আপাতত আমরা শুধু বাংলাদেশের ভিতরে ডেলিভারি করি — আন্তর্জাতিক শিপিং নেই। We currently deliver only within Bangladesh — no international shipping.</p>
            <p>💰 ডেলিভারি চার্জ এলাকাভেদে ভিন্ন — অর্ডার কনফার্মের সময় মোট খরচ জানিয়ে দিই। ক্যাশ অন ডেলিভারি আছে। Delivery charge varies by area — we confirm the total when we confirm your order. Cash on delivery is available.</p>
            <p>📞 ডেলিভারি নিয়ে প্রশ্ন? কল করুন: 01820-417426। Questions about delivery? Call us any time.</p>
          `,
        },
      },
    ],
  },
  {
    title: 'Return & Refund Policy',
    slug: 'return-refund-policy',
    content: [
      {
        type: 'rich-text',
        data: {
          content: `
            <h2>রিটার্ন ও রিফান্ড — Return & Refund Policy</h2>
            <p>কাস্টম-তৈরি পণ্য — বিশেষত আপনার ডিজাইনে বানানো পাটের ব্যাগ — ফেরত বা রিফান্ডযোগ্য নয়। Custom-made items, especially jute bags made to your design, cannot be returned or refunded.</p>
            <h3>✅ যেসব ক্ষেত্রে বদলে দিই — When we replace</h3>
            <ul>
              <li>ডেলিভারির সময় পণ্য ক্ষতিগ্রস্ত হলে — the item arrived damaged</li>
              <li>ভুল পণ্য পেলে — you received the wrong item</li>
            </ul>
            <p>📸 হাতে পাওয়ার ৪৮ ঘণ্টার মধ্যে ছবিসহ আমাদের জানান — 01820-417426 নম্বরে কল করুন বা ফেসবুক পেজে (facebook.com/iccheghureeofficial) মেসেজ করুন। Contact us within 48 hours of delivery with photos — call 01820-417426 or message our Facebook page.</p>
            <p>যাচাইয়ের পর আমরা বিনামূল্যে পণ্যটি বদলে দিই। After verification, we replace the item free of charge.</p>
          `,
        },
      },
    ],
  },
  {
    title: 'Exchange Policy',
    slug: 'exchange-policy',
    content: [
      {
        type: 'rich-text',
        data: {
          content: `
            <h2>এক্সচেঞ্জ — Exchange Policy</h2>
            <p>আমরা পণ্য বদলে দিই যদি — We exchange items that are:</p>
            <ul>
              <li>✔ ডেলিভারিতে ক্ষতিগ্রস্ত — damaged in transit</li>
              <li>✔ ভুল পণ্য — the incorrect item was delivered</li>
            </ul>
            <p>স্টকের রেডিমেড পণ্যে (যেমন স্ক্রাঞ্চি বা হেডব্যান্ডের রঙ) হাতে পাওয়ার ৪৮ ঘণ্টার মধ্যে, অব্যবহৃত অবস্থায় জানালে রঙ বা ডিজাইন বদলের ব্যবস্থা করি — সেক্ষেত্রে ডেলিভারি খরচ ক্রেতার। For ready-made stock items (e.g. scrunchie or headband colours), tell us within 48 hours with the item unused and we will arrange a colour or design swap — delivery cost borne by the customer.</p>
            <p>প্রোডাকশন শুরু হয়ে গেলে কাস্টম অর্ডারের পছন্দ আর বদলানো যায় না। Custom orders cannot be changed once production has started.</p>
          `,
        },
      },
    ],
  },
  {
    title: 'Cancellation Policy',
    slug: 'cancellation-policy',
    content: [
      {
        type: 'rich-text',
        data: {
          content: `
            <h2>অর্ডার বাতিল — Cancellation Policy</h2>
            <ul>
              <li>অর্ডার দেওয়ার ৬ ঘণ্টার মধ্যে বিনা খরচে বাতিল করা যায় — orders can be cancelled free of charge within 6 hours of placing them.</li>
              <li>এরপর কাস্টম কাজ শুরু হয়ে গেলে বাতিল সম্ভব নয় — once custom production begins, cancellation is no longer possible.</li>
              <li>পাইকারী অর্ডারে অগ্রিম নেওয়া হলে, কাজ শুরুর আগে বাতিল করলে অগ্রিম ফেরতযোগ্য — for wholesale orders, any advance is refundable if work has not started.</li>
            </ul>
            <p>বাতিল করতে যত দ্রুত সম্ভব কল করুন: 01820-417426। To cancel, call us as soon as possible.</p>
          `,
        },
      },
    ],
  },
  {
    title: 'Terms of Service',
    slug: 'terms-of-service',
    content: [
      {
        type: 'rich-text',
        data: {
          content: `
            <h2>শর্তাবলী — Terms of Service</h2>
            <p>ইচ্ছে ঘুড়ি'র ওয়েবসাইট ব্যবহার করে আপনি নিচের শর্তগুলোতে সম্মত হচ্ছেন — By using the Ische Ghuree website you agree that:</p>
            <ul>
              <li>আমাদের পণ্য হস্তনির্মিত ও কাস্টম-তৈরি; ডিজাইন, রঙ বা মাপে সামান্য তারতম্য হতে পারে। Our products are handmade and custom-made; slight variations in design, colour or size may occur.</li>
              <li>অর্ডারের সময় সঠিক নাম, ফোন নম্বর ও ঠিকানা দিতে হবে। Customers must provide a correct name, phone number and address.</li>
              <li>সব অর্ডার ফোনে কনফার্ম হওয়ার পর চূড়ান্ত হয়; ওয়েবসাইটে দেখানো দাম নির্দেশক — চূড়ান্ত দাম কোটেশনে জানানো হয়। Orders are final after phone confirmation; listed prices are indicative and the final price is given in your quote.</li>
              <li>প্রোডাকশন শুরুর পর অর্ডার পরিবর্তন করা যায় না। Orders cannot be changed once production starts.</li>
              <li>কুরিয়ার সার্ভিসের কারণে দেরির দায় আমাদের নয়, তবে সমাধানে আমরা সবসময় পাশে আছি। We are not responsible for courier delays, though we always help resolve them.</li>
            </ul>
            <p>প্রশ্ন থাকলে — Questions? 📞 01820-417426 · ✉️ ischeghuree@gmail.com</p>
          `,
        },
      },
    ],
  },
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    content: [
      {
        type: 'rich-text',
        data: {
          content: `
            <h2>প্রাইভেসি পলিসি — Privacy Policy</h2>
            <p>অর্ডার প্রক্রিয়ার জন্য আমরা শুধু প্রয়োজনীয় তথ্যটুকু সংগ্রহ করি — We collect only what an order needs:</p>
            <ul>
              <li>নাম — Name</li>
              <li>ফোন নম্বর — Phone number</li>
              <li>ইমেইল (ঐচ্ছিক) — Email (optional)</li>
              <li>ডেলিভারির ঠিকানা — Delivery address</li>
            </ul>
            <p>এই তথ্য ব্যবহৃত হয় শুধু — This information is used only for:</p>
            <ul>
              <li>✔ অর্ডার প্রসেসিং — order processing</li>
              <li>✔ কোটেশন ও অর্ডার-সংক্রান্ত যোগাযোগ — quotes and order communication</li>
              <li>✔ ডেলিভারি আপডেট — delivery updates</li>
            </ul>
            <p>আমরা আপনার তথ্য কারও কাছে বিক্রি বা শেয়ার করি না; শুধু ডেলিভারির প্রয়োজনে কুরিয়ার পার্টনারকে নাম ও ঠিকানা দেওয়া হয়। We never sell or share your data; only your name and address go to the courier partner for delivery.</p>
            <p>আপনার তথ্য মুছে ফেলতে চাইলে যোগাযোগ করুন — To have your data removed, contact us: ✉️ ischeghuree@gmail.com · 📞 01820-417426</p>
          `,
        },
      },
    ],
  },
  {
    title: 'FAQ',
    slug: 'faq',
    content: [
      {
        type: 'rich-text',
        data: {
          content: `
            <h2>সচরাচর জিজ্ঞাসা — Frequently Asked Questions</h2>
            <p><strong>Q: কীভাবে অর্ডার করব? — How do I order?</strong><br>ওয়েবসাইটের অর্ডার ফর্ম পূরণ করুন বা সরাসরি 01820-417426 নম্বরে কল করুন — আমরা কোটেশন দিয়ে অর্ডার কনফার্ম করি। Fill in the order form or call us directly; we confirm every order with a quote.</p>
            <p><strong>Q: পাইকারী অর্ডার নেন কি? — Do you take wholesale orders?</strong><br>হ্যাঁ! পাটের ব্যাগ খুচরা ও পাইকারী দুইভাবেই পাবেন। অর্ডার ফর্মে "পাইকারী" নির্বাচন করে পরিমাণ জানালে বিশেষ দরে কোটেশন পাবেন। Yes — jute bags are sold retail and wholesale; select "Wholesale", tell us the quantity and we quote a special rate.</p>
            <p><strong>Q: ডেলিভারি কোথায়, কত দিনে? — Where and how fast do you deliver?</strong><br>ঢাকার ভিতরে ১–৩ দিনে হোম ডেলিভারি, ঢাকার বাইরে কুরিয়ারে ৩–৭ দিন। আপাতত দেশের বাইরে ডেলিভারি নেই। Home delivery in 1–3 days inside Dhaka, 3–7 days by courier elsewhere in Bangladesh; no international shipping yet.</p>
            <p><strong>Q: ডেলিভারিতে টাকা দেওয়া যায়? — Can I pay on delivery?</strong><br>হ্যাঁ, ক্যাশ অন ডেলিভারি আছে। অর্ডার কনফার্মের সময় ডেলিভারি চার্জসহ মোট টাকা জানিয়ে দিই। Yes — cash on delivery is available; we confirm the total including delivery charge before dispatch.</p>
            <p><strong>Q: কাস্টম পাটের ব্যাগ বানান? — Do you make custom jute bags?</strong><br>হ্যাঁ, আপনার ডিজাইন, মাপ বা লোগো অনুযায়ী কাস্টম পাটের ব্যাগ বানাই — বিশেষ করে পাইকারী অর্ডারে। Yes, we make custom jute bags to your design, size or logo — especially for wholesale orders.</p>
            <p><strong>Q: স্ক্রাঞ্চি ও ব্যাগের যত্ন কীভাবে নেব? — How do I care for my items?</strong><br>স্যাটিন বা ভেলভেট স্ক্রাঞ্চি ঠান্ডা পানিতে হালকা হাতে ধুয়ে ছায়ায় শুকান; পাটের ব্যাগ ভেজাবেন না — ভেজা কাপড়ে মুছে বাতাসে শুকান। Hand-wash satin and velvet scrunchies gently in cold water and dry in shade; keep jute bags dry and wipe them clean with a damp cloth.</p>
          `,
        },
      },
    ],
  },
];

async function main() {
  console.log('🪁 Ische Ghuree pages seed started…');

  for (const page of pages) {
    await prisma.storefrontPage.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        content: page.content as any,
        status: 'PUBLISHED',
      },
      create: {
        title: page.title,
        slug: page.slug,
        content: page.content as any,
        status: 'PUBLISHED',
      },
    });
    console.log(`Page "${page.title}" upserted.`);
  }

  // Footer links — full column config matching the Footer component's shape
  // (col1 brand blurb, col2/col3 link lists, col4 contacts). Upserts the
  // settings singleton so this script also works on a fresh database.
  const footerConfig = {
    col1: {
      showLogo: true,
      showTitle: true,
      title: 'ইচ্ছে ঘুড়ি — Ische Ghuree',
      description:
        'আবহমান বাংলার ঐতিহ্য — the timeless heritage of Bengal. Eco-friendly jute bags (খুচরা ও পাইকারী) and world-class hair accessories, made with care since 2020.',
    },
    col2: {
      title: 'Quick Links',
      links: [
        { label: 'Shop', href: '/shop' },
        { label: 'Order Now', href: '/order-now' },
        { label: 'Categories', href: '/categories' },
        { label: 'About Us', href: '/about-us' },
        { label: 'Custom Order Process', href: '/custom-order-process' },
        { label: 'Contact Us', href: '/contact-us' },
      ],
    },
    col3: {
      title: 'Information',
      links: [
        { label: 'FAQ', href: '/faq' },
        { label: 'Shipping & Delivery', href: '/shipping-policy' },
        { label: 'Return & Refund Policy', href: '/return-refund-policy' },
        { label: 'Exchange Policy', href: '/exchange-policy' },
        { label: 'Cancellation Policy', href: '/cancellation-policy' },
        { label: 'Terms of Service', href: '/terms-of-service' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
      ],
    },
    col4: {
      title: 'যোগাযোগ — Contact',
      contacts: [
        { icon: 'MapPin', text: 'Dhaka Uddan, Mohammadpur, Dhaka 1207' },
        { icon: 'Phone', text: '01820-417426', link: 'tel:01820417426' },
        { icon: 'Mail', text: 'ischeghuree@gmail.com', link: 'mailto:ischeghuree@gmail.com' },
        {
          icon: 'Store',
          text: 'facebook.com/iccheghureeofficial',
          link: 'https://www.facebook.com/iccheghureeofficial',
        },
      ],
    },
  };

  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: { footerConfig },
    create: { id: 'singleton', footerConfig },
  });
  console.log('Footer configuration updated.');

  console.log('🪁 Pages seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
