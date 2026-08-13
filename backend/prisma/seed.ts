import 'dotenv/config';
import bcryptjs from 'bcryptjs';
import { Role, UserStatus, ProductStatus } from '@prisma/client';
import prisma from '../src/config/prisma';

// ─────────────────────────────────────────────────────────────────────────────
// Ische Ghuree (ইচ্ছে ঘুড়ি) seed — idempotent. Safe to run repeatedly:
// every entity is upserted by its unique key (or findFirst-guarded when the
// model has no natural unique key). Brand data per BRAND.md / DESIGN.md.
// ─────────────────────────────────────────────────────────────────────────────

const BRAND = {
  storeName: 'ইচ্ছে ঘুড়ি — Ische Ghuree',
  tagline: 'আভিজাত্যের ছোঁয়া… A touch of elegance…',
  slogan: 'আবহমান বাংলার ঐতিহ্য — The timeless heritage of Bengal',
  phone: '01820-417426',
  email: 'ischeghuree@gmail.com',
  address: 'Dhaka Uddan, Mohammadpur, Dhaka 1207',
  facebook: 'https://www.facebook.com/iccheghureeofficial',
};

// ── 1. Super admin ───────────────────────────────────────────────────────────

async function seedSuperAdmin() {
  const plainPassword = process.env.SEED_ADMIN_PASSWORD || 'IG#2020@Dhaka';
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.warn(
      '⚠️  SEED_ADMIN_PASSWORD not set — using the default seed password. ' +
        'Change it immediately after first login (or re-run the seed with SEED_ADMIN_PASSWORD set).'
    );
  }
  const password = await bcryptjs.hash(plainPassword, 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: BRAND.email },
    update: {
      password,
      roles: [Role.SUPER_ADMIN],
      status: UserStatus.ACTIVE,
    },
    create: {
      firstName: 'Ische',
      lastName: 'Ghuree',
      fullName: 'Ische Ghuree',
      username: 'ischeghuree',
      email: BRAND.email,
      password,
      roles: [Role.SUPER_ADMIN],
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  });

  console.log(`✔ super admin ready: ${superAdmin.email} (id: ${superAdmin.id})`);
  return superAdmin;
}

// ── 2. Media (local public/ assets) ──────────────────────────────────────────
// Media has no unique key on URL, so ensureMedia is findFirst-guarded.

interface MediaSpec {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
  altText: string;
  title?: string;
  folder?: string;
}

async function ensureMedia(spec: MediaSpec, uploadedById: string) {
  const existing = await prisma.media.findFirst({ where: { originalUrl: spec.url } });
  if (existing) return existing;
  return prisma.media.create({
    data: {
      filename: spec.filename,
      title: spec.title || spec.altText,
      originalUrl: spec.url,
      mimetype: spec.mimetype,
      size: spec.size,
      folder: spec.folder || 'brand',
      altText: spec.altText,
      uploadedById,
    },
  });
}

async function seedMedia(adminId: string) {
  const jpg = (file: string, size: number, altText: string): MediaSpec => ({
    url: `/images/products/${file}`,
    filename: file,
    mimetype: 'image/jpeg',
    size,
    altText,
    folder: 'products',
  });

  const media = {
    logoSvg: await ensureMedia(
      {
        url: '/ische-ghuree.svg',
        filename: 'ische-ghuree.svg',
        mimetype: 'image/svg+xml',
        size: 1142,
        altText: 'ইচ্ছে ঘুড়ি — Ische Ghuree kite logo',
        title: 'Ische Ghuree kite mark (vector)',
      },
      adminId
    ),
    logoJpg: await ensureMedia(
      {
        url: '/ische-ghuree-logo.jpg',
        filename: 'ische-ghuree-logo.jpg',
        mimetype: 'image/jpeg',
        size: 36290,
        altText: 'ইচ্ছে ঘুড়ি — Ische Ghuree logo, multicolour kite on a blue sky',
        title: 'Ische Ghuree logo (photo)',
      },
      adminId
    ),
    juteTote: await ensureMedia(
      jpg('jute-tote-riverside.jpg', 71381, 'পরিবেশবান্ধব পাটের টোট ব্যাগ — eco-friendly jute tote bag by the river'),
      adminId
    ),
    hairStand: await ensureMedia(
      jpg('hair-collection-stand.jpg', 76620, 'লেপার্ড স্ক্রাঞ্চি স্ট্যান্ড সেট — leopard-print scrunchie stand set'),
      adminId
    ),
    morningScrunchies: await ensureMedia(
      jpg('morning-scrunchies-creative.jpg', 48762, 'স্যাটিন স্ক্রাঞ্চি — satin scrunchies in morning light'),
      adminId
    ),
    scrunchieTower: await ensureMedia(
      jpg('scrunchie-collection-tower.jpg', 67817, 'ভেলভেট স্ক্রাঞ্চি কালেকশন — velvet scrunchie collection tower'),
      adminId
    ),
    headbandsLoop: await ensureMedia(
      jpg('satin-headbands-loop.jpg', 35667, 'স্যাটিন হেডব্যান্ড ১০ রঙে — satin-wrapped headbands in ten colours'),
      adminId
    ),
    headbandsCloseup: await ensureMedia(
      jpg('satin-headbands-closeup.jpg', 34865, 'গিংহাম ও বো হেয়ারব্যান্ড — gingham and bow hair bands close-up'),
      adminId
    ),
    nightScrunchies: await ensureMedia(
      jpg('night-scrunchies-creative.jpg', 46978, 'রাতের প্রশান্তি — night-care satin scrunchies with fairy lights'),
      adminId
    ),
    flatlay: await ensureMedia(
      jpg('collection-flatlay-creative.jpg', 64505, 'ইচ্ছে ঘুড়ি কালেকশন ফ্ল্যাটলে — Ische Ghuree collection flat lay'),
      adminId
    ),
  };

  console.log('✔ media rows ready (brand + product photos)');
  return media;
}

// ── 3. Site settings singleton ───────────────────────────────────────────────
// homepageConfig section keys/fields mirror exactly what the frontend
// components read: kiteHero (KiteHero.tsx), story (StorySection), howItWorks
// (HowItWorks), faq (FAQSection), stickyBanner (StickyBanner), trustBar,
// orderHero (app/order-now/page.tsx).

function buildHomepageConfig() {
  return {
    kiteHero: {
      brandName: BRAND.storeName,
      headline: 'আভিজাত্যের ছোঁয়া…',
      subheadline: 'A touch of elegance…',
      tagline:
        'আবহমান বাংলার ঐতিহ্য — পরিবেশবান্ধব পাটের ব্যাগ আর বিশ্বমানের হেয়ার অ্যাক্সেসরিজ, আপনার দরজায়। The timeless heritage of Bengal — eco-friendly jute bags & world-class hair accessories, delivered across Dhaka.',
      contactPhone: BRAND.phone,
      contactEmail: BRAND.email,
      image: '/ische-ghuree-logo.jpg',
      whatsappLink: '',
    },
    story: {
      title: 'ইচ্ছে ঘুড়ির গল্প',
      paragraphs: [
        '২০২০ সালের ২৫ আগস্ট, মোহাম্মদপুরের ঢাকা উদ্যান থেকে উড়তে শুরু করে ইচ্ছে ঘুড়ি — ছেলেবেলার সেই ঘুড়ির মতো, যার সুতোয় বাঁধা থাকে ইচ্ছে আর স্বপ্ন। Founded on 25 August 2020 in Mohammadpur, Dhaka, Ische Ghuree took flight like the kites of our childhood — strings tied to wishes and dreams.',
        'পাট — বাংলার সোনালী আঁশ। সেই আঁশে বোনা আমাদের পরিবেশবান্ধব ব্যাগ, আর সাথে বিশ্বমানের হেয়ার অ্যাক্সেসরিজ: স্যাটিন স্ক্রাঞ্চি, হেডব্যান্ড, বো। Woven from Bengal’s golden fibre, our eco-friendly jute bags fly alongside world-class hair accessories — satin scrunchies, headbands and bows.',
        'খুচরা হোক বা পাইকারী — প্রতিটি অর্ডারে থাকে যত্নের ছোঁয়া, আর সারা ঢাকায় হোম ডেলিভারি। Retail or wholesale, every order carries a touch of care, delivered to your door across Dhaka.',
      ],
      tagline: BRAND.tagline,
      highlights: [
        { icon: 'Heart', label: 'যত্নে তৈরি — Made with care' },
        { icon: 'Star', label: '২০২০ থেকে — Since 2020' },
        { icon: 'Sparkles', label: 'সোনালী আঁশ — Golden fibre' },
      ],
    },
    howItWorks: {
      title: 'কীভাবে অর্ডার করবেন',
      subtitle:
        'ব্রাউজ → কল/কোটেশন → কনফার্ম → ডেলিভারি — চারটি সহজ ধাপ। Four simple steps from browsing to your doorstep.',
      steps: [
        {
          number: '01',
          icon: 'LuSearch',
          title: 'পছন্দ করুন — Browse',
          description:
            'শপ থেকে পাটের ব্যাগ বা হেয়ার অ্যাক্সেসরিজ দেখে পছন্দেরটি বেছে নিন। Browse the catalog and pick your favourite.',
        },
        {
          number: '02',
          icon: 'LuPhoneCall',
          title: 'কল বা কোটেশন — Call / Quote',
          description:
            '01820-417426 নম্বরে কল করুন বা অর্ডার ফর্মে কোটেশন চান — খুচরা বা পাইকারী। Call us or request a quote — retail or wholesale.',
        },
        {
          number: '03',
          icon: 'LuClipboardCheck',
          title: 'কনফার্ম করুন — Confirm',
          description:
            'দাম, পরিমাণ আর ডেলিভারির খুঁটিনাটি ঠিক করে অর্ডার কনফার্ম করুন। We agree price, quantity and delivery details together.',
        },
        {
          number: '04',
          icon: 'LuTruck',
          title: 'ডেলিভারি — Delivery',
          description:
            'ঢাকায় ১–৩ দিনে হোম ডেলিভারি, ঢাকার বাইরে কুরিয়ারে ৩–৭ দিন। Home delivery in 1–3 days inside Dhaka, 3–7 days by courier elsewhere.',
        },
      ],
      ctaLine: 'সবসময় খোলা — কল করুন: 01820-417426 · Always open — call us any time',
      ctaBtnText: 'কল করুন — Call Now',
      whatsappLink: '',
    },
    faq: {
      title: 'সচরাচর জিজ্ঞাসা',
      subtitle:
        'অর্ডার, ডেলিভারি আর যত্ন নিয়ে সাধারণ প্রশ্নের উত্তর। Answers to common questions about ordering, delivery and care.',
      faqs: [
        {
          question: 'কীভাবে অর্ডার করব? — How do I order?',
          answer:
            'ওয়েবসাইটের অর্ডার ফর্ম পূরণ করুন বা সরাসরি 01820-417426 নম্বরে কল করুন — আমরা কোটেশন দিয়ে অর্ডার কনফার্ম করি। Fill in the order form or call us directly; we confirm every order with a quote.',
        },
        {
          question: 'পাইকারী অর্ডার নেন কি? — Do you take wholesale orders?',
          answer:
            'হ্যাঁ! পাটের ব্যাগ খুচরা ও পাইকারী দুইভাবেই পাবেন। অর্ডার ফর্মে “পাইকারী” নির্বাচন করে পরিমাণ জানালে বিশেষ দরে কোটেশন পাবেন। Yes — jute bags are sold retail and wholesale; select “Wholesale”, tell us the quantity and we quote a special rate.',
        },
        {
          question: 'ডেলিভারি কোথায়, কত দিনে? — Where and how fast do you deliver?',
          answer:
            'ঢাকার ভিতরে ১–৩ দিনে হোম ডেলিভারি, ঢাকার বাইরে কুরিয়ারে ৩–৭ দিন। আপাতত দেশের বাইরে ডেলিভারি নেই। Home delivery in 1–3 days inside Dhaka, 3–7 days by courier elsewhere in Bangladesh; no international shipping yet.',
        },
        {
          question: 'ডেলিভারিতে টাকা দেওয়া যায়? — Can I pay on delivery?',
          answer:
            'হ্যাঁ, ক্যাশ অন ডেলিভারি আছে। অর্ডার কনফার্মের সময় ডেলিভারি চার্জসহ মোট টাকা জানিয়ে দিই। Yes — cash on delivery is available; we confirm the total including delivery charge before dispatch.',
        },
        {
          question: 'কাস্টম পাটের ব্যাগ বানান? — Do you make custom jute bags?',
          answer:
            'হ্যাঁ, আপনার ডিজাইন, মাপ বা লোগো অনুযায়ী কাস্টম পাটের ব্যাগ বানাই — বিশেষ করে পাইকারী অর্ডারে। Yes, we make custom jute bags to your design, size or logo — especially for wholesale orders.',
        },
        {
          question: 'স্ক্রাঞ্চি ও ব্যাগের যত্ন কীভাবে নেব? — How do I care for my items?',
          answer:
            'স্যাটিন/ভেলভেট স্ক্রাঞ্চি ঠান্ডা পানিতে হালকা হাতে ধুয়ে ছায়ায় শুকান; পাটের ব্যাগ ভেজাবেন না, ভেজা কাপড়ে মুছে বাতাসে শুকান। Hand-wash scrunchies gently in cold water and dry in shade; keep jute bags dry and wipe them clean with a damp cloth.',
        },
      ],
    },
    stickyBanner: {
      text:
        'পরিবেশবান্ধব পাটের ব্যাগ ও হেয়ার অ্যাক্সেসরিজ — সারা ঢাকায় হোম ডেলিভারি · Eco-friendly jute bags & hair accessories, home delivery across Dhaka · কল করুন: 01820-417426',
      btnText: 'অর্ডার করুন — Order Now',
    },
    trustBar: {
      items: [
        {
          icon: 'LuLeaf',
          title: 'পরিবেশবান্ধব — Eco-friendly',
          desc: 'বাংলার সোনালী আঁশ পাটের তৈরি — Made from natural jute',
        },
        {
          icon: 'LuStore',
          title: 'পাইকারী ও খুচরা — Wholesale & Retail',
          desc: 'ছোট-বড় সব অর্ডার — Orders of every size',
        },
        {
          icon: 'LuTruck',
          title: 'ঢাকায় ডেলিভারি — Delivery in Dhaka',
          desc: 'দ্রুত হোম ডেলিভারি — Fast home delivery',
        },
        {
          icon: 'LuClock',
          title: 'সবসময় খোলা — Always Open',
          desc: 'কল করুন: 01820-417426 — Call any time',
        },
      ],
    },
    orderHero: {
      title: BRAND.storeName,
      subtitle: BRAND.slogan,
      personName: 'Ische Ghuree',
      phone: BRAND.phone,
      email: BRAND.email,
      instructions:
        'ফর্মটি পূরণ করুন — আমরা কল করে দাম, পরিমাণ ও ডেলিভারি কনফার্ম করব। Fill in the form and we will call you to confirm price, quantity and delivery.',
      badgeText: 'খুচরা ও পাইকারী অর্ডার — Retail & Wholesale!',
      imageUrl: '/images/products/collection-flatlay-creative.jpg',
      bottomImageUrl: '/images/products/jute-tote-riverside.jpg',
    },
  };
}

function buildFooterConfig() {
  return {
    col1: {
      showLogo: true,
      showTitle: true,
      title: BRAND.storeName,
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
        { icon: 'MapPin', text: BRAND.address },
        { icon: 'Phone', text: BRAND.phone, link: 'tel:01820417426' },
        { icon: 'Mail', text: BRAND.email, link: `mailto:${BRAND.email}` },
        { icon: 'Store', text: 'facebook.com/iccheghureeofficial', link: BRAND.facebook },
      ],
    },
  };
}

async function seedSiteSettings(media: Awaited<ReturnType<typeof seedMedia>>) {
  const data = {
    storeName: BRAND.storeName,
    tagline: BRAND.tagline,
    companySlogan: BRAND.slogan,
    supportEmail: BRAND.email,
    supportPhone: BRAND.phone,
    contactEmail: BRAND.email,
    contactPhone: BRAND.phone,
    contactAddress: BRAND.address,
    address: BRAND.address,
    currencyCode: 'BDT',
    currencySymbol: '৳',
    timezone: 'Asia/Dhaka',
    orderPrefix: 'IG-',
    logoId: media.logoSvg.id,
    faviconId: media.logoSvg.id,
    ogImageId: media.logoJpg.id,
    homepageConfig: buildHomepageConfig(),
    footerConfig: buildFooterConfig(),
  };

  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: data, // update the existing row too — @default() only affects new rows
    create: { id: 'singleton', ...data },
  });

  console.log('✔ site settings singleton upserted (brand, currency ৳/BDT, homepageConfig, footerConfig)');
}

// ── 4. Facebook social link ──────────────────────────────────────────────────

async function seedSocialLinks() {
  const existing = await prisma.socialLink.findFirst({ where: { link: BRAND.facebook } });
  if (!existing) {
    await prisma.socialLink.create({
      data: {
        name: 'Facebook',
        icon: 'FaFacebookF',
        link: BRAND.facebook,
        isActive: true,
        order: 1,
      },
    });
  }
  console.log('✔ social link ready: facebook.com/iccheghureeofficial');
}

// ── 5. "Sky Kite" store theme (DESIGN.md §1) ─────────────────────────────────
// Variable keys mirror frontend ThemeProvider FALLBACK_LIGHT / FALLBACK_DARK.

async function seedTheme() {
  // Light — "দিনের আকাশ" (day sky): cloud white, kite-sky blue, jute tan.
  const lightVariables = {
    background: '204 45% 98%',
    foreground: '215 45% 15%',
    heading: '215 45% 15%',
    subheading: '215 25% 40%',
    card: '0 0% 100%',
    'card-foreground': '215 45% 15%',
    popover: '0 0% 100%',
    'popover-foreground': '215 45% 15%',
    primary: '204 80% 40%',
    'primary-foreground': '0 0% 100%',
    secondary: '33 45% 62%',
    'secondary-foreground': '27 50% 16%',
    muted: '204 30% 92%',
    'muted-foreground': '215 25% 40%',
    accent: '330 72% 52%',
    'accent-foreground': '0 0% 100%',
    destructive: '0 84% 60%',
    'destructive-foreground': '0 0% 98%',
    border: '204 25% 86%',
    input: '204 25% 86%',
    ring: '204 80% 40%',
    'shadow-color': '215 45% 15%',
    'gradient-from': '204 45% 98%',
    'gradient-to': '204 30% 92%',
  };

  // Dark — "রাতের প্রশান্তি" (night tranquility): deep night blue, not black.
  const darkVariables = {
    background: '215 50% 8%',
    foreground: '204 40% 94%',
    heading: '204 40% 94%',
    subheading: '204 25% 65%',
    card: '215 45% 12%',
    'card-foreground': '204 40% 94%',
    popover: '215 45% 10%',
    'popover-foreground': '204 40% 94%',
    primary: '204 75% 55%',
    'primary-foreground': '215 50% 8%',
    secondary: '33 40% 55%',
    'secondary-foreground': '215 50% 8%',
    muted: '215 40% 14%',
    'muted-foreground': '204 25% 65%',
    accent: '330 70% 60%',
    'accent-foreground': '0 0% 100%',
    destructive: '0 84% 60%',
    'destructive-foreground': '0 0% 98%',
    border: '215 30% 20%',
    input: '215 35% 16%',
    ring: '204 75% 55%',
    'shadow-color': '215 80% 3%',
    'gradient-from': '215 45% 12%',
    'gradient-to': '215 50% 6%',
  };

  await prisma.storeTheme.upsert({
    where: { name: 'Sky Kite' },
    update: { lightVariables, darkVariables, radius: '0.75rem', status: true, isActive: true },
    create: {
      name: 'Sky Kite',
      lightVariables,
      darkVariables,
      radius: '0.75rem',
      status: true,
      isActive: true,
    },
  });

  // Exactly one active theme: retire any jewelry-era themes still flagged active.
  await prisma.storeTheme.updateMany({
    where: { name: { not: 'Sky Kite' }, isActive: true },
    data: { isActive: false },
  });

  console.log('✔ store theme "Sky Kite" active (light: day sky · dark: night tranquility)');
}

// ── 6. Categories ────────────────────────────────────────────────────────────

async function seedCategories(media: Awaited<ReturnType<typeof seedMedia>>, adminId: string) {
  const categories = [
    {
      slug: 'jute-bags',
      name: 'জুট ব্যাগ — Jute Bags',
      description:
        'বাংলার সোনালী আঁশে বোনা পরিবেশবান্ধব পাটের ব্যাগ — খুচরা ও পাইকারী। Eco-friendly bags woven from Bengal’s golden fibre — retail & wholesale.',
      featuredImageId: media.juteTote.id,
    },
    {
      slug: 'hair-accessories',
      name: 'হেয়ার অ্যাক্সেসরিজ — Hair Accessories',
      description:
        'স্যাটিন ও ভেলভেট স্ক্রাঞ্চি, হেডব্যান্ড, বো — বিশ্বমানের হেয়ার অ্যাক্সেসরিজ। World-class satin & velvet scrunchies, headbands and bows.',
      featuredImageId: media.hairStand.id,
    },
    {
      slug: 'night-care',
      name: 'নাইট কেয়ার — Night Comfort',
      description:
        'রাতের প্রশান্তি, ইচ্ছে ঘুড়ি’র যত্ন — নরম স্যাটিনে সারা রাত চুলের যত্ন। Night’s tranquility — soft satin that cares for your hair all night.',
      featuredImageId: media.nightScrunchies.id,
    },
  ];

  const bySlug: Record<string, { id: string }> = {};
  for (const cat of categories) {
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        featuredImageId: cat.featuredImageId,
      },
      create: { ...cat, createdBy: adminId },
    });
    bySlug[cat.slug] = row;
  }

  console.log('✔ categories upserted: jute-bags · hair-accessories · night-care');
  return bySlug;
}

// ── 7. Products (DESIGN.md §4) ───────────────────────────────────────────────
// NOTE: ProductStatus has no PUBLISHED value — anything not DRAFT/ARCHIVED is
// public. FEATURED marks the homepage-grid heroes; the array is ordered so the
// three FEATURED items are created last (newest → shown by getFeaturedProducts).

interface ProductSpec {
  productCode: string;
  slug: string;
  name: string;
  shortDesc: string;
  longDesc: string;
  tags: string[];
  material: string;
  priceMin: number | null;
  priceMax: number | null;
  priceNote: string | null;
  productStatus: ProductStatus;
  categorySlugs: string[];
  featuredImageId: string;
  galleryImageIds: string[];
  attributes?: any;
}

async function seedProducts(
  media: Awaited<ReturnType<typeof seedMedia>>,
  cats: Record<string, { id: string }>,
  adminId: string
) {
  const products: ProductSpec[] = [
    {
      productCode: 'JUT-002',
      slug: 'natural-jute-shopper',
      name: 'ন্যাচারাল জুট শপার — Natural Jute Shopper',
      shortDesc:
        'প্রাকৃতিক রঙের টেকসই পাটের শপিং ব্যাগ — বাজার থেকে অফিস, সবখানে। A sturdy natural-tone jute shopper for market runs and everyday carry.',
      longDesc:
        'বাংলার সোনালী আঁশে বোনা এই শপার ব্যাগ প্লাস্টিকের চমৎকার বিকল্প — হালকা অথচ মজবুত, আর প্রতিদিনের ব্যবহারে আভিজাত্যের ছোঁয়া। প্রশস্ত ভেতর, শক্ত সেলাই, প্রাকৃতিক ফিনিশ। Woven from Bengal’s golden fibre, this shopper is the elegant alternative to plastic — light yet strong, with a roomy interior, reinforced stitching and a natural finish. খুচরা ও পাইকারী দুই-ই পাওয়া যায়। Available retail and wholesale.',
      tags: ['Jute', 'Eco-friendly', 'Shopper'],
      material: 'পাট — Natural jute',
      priceMin: 250,
      priceMax: 320,
      priceNote: null,
      productStatus: ProductStatus.ACTIVE,
      categorySlugs: ['jute-bags'],
      featuredImageId: media.juteTote.id,
      galleryImageIds: [media.flatlay.id],
    },
    {
      productCode: 'JUT-003',
      slug: 'custom-jute-bag-wholesale',
      name: 'কাস্টম পাটের ব্যাগ (পাইকারী) — Custom Jute Bag (Wholesale)',
      shortDesc:
        'আপনার ডিজাইন, মাপ বা লোগোতে কাস্টম পাটের ব্যাগ — পাইকারী দরে। Custom jute bags to your design, size or logo — at wholesale rates.',
      longDesc:
        'দোকান, ব্র্যান্ড বা ইভেন্টের জন্য নিজের ডিজাইনে পরিবেশবান্ধব পাটের ব্যাগ বানিয়ে নিন — মাপ, রঙ, হাতল আর লোগো ছাপা, সব আপনার পছন্দে। পরিমাণ অনুযায়ী বিশেষ পাইকারী দর। কোটেশনের জন্য 01820-417426 নম্বরে কল করুন বা অর্ডার ফর্মে “পাইকারী” নির্বাচন করুন। Have eco-friendly jute bags made to your own design for your shop, brand or event — size, colour, handles and logo printing all your choice, with special wholesale rates by quantity. Call 01820-417426 or select “Wholesale” on the order form for a quote.',
      tags: ['Jute', 'Wholesale', 'Custom'],
      material: 'পাট — Natural jute',
      priceMin: null,
      priceMax: null,
      priceNote: 'পাইকারী দর — কোটেশনের জন্য কল করুন: 01820-417426 · Wholesale: call for a quote',
      productStatus: ProductStatus.ACTIVE,
      categorySlugs: ['jute-bags'],
      featuredImageId: media.flatlay.id,
      galleryImageIds: [media.juteTote.id],
      attributes: { orderType: 'WHOLESALE', quoteOnly: true },
    },
    {
      productCode: 'HAIR-002',
      slug: 'satin-scrunchies-5-pack',
      name: 'স্যাটিন স্ক্রাঞ্চি ৫-প্যাক — Satin Scrunchies (5-Pack)',
      shortDesc:
        'এমারেল্ড, পার্পল, শ্যাম্পেন, নেভি ও পিচ — পাঁচ রঙের নরম স্যাটিন স্ক্রাঞ্চি। Five soft satin scrunchies: emerald, purple, champagne, navy and peach.',
      longDesc:
        'বিশ্বমানের স্যাটিনে তৈরি এই স্ক্রাঞ্চিগুলো চুলে দাগ ফেলে না, ভাঁজ পড়তে দেয় না — দিনে স্টাইল, রাতে যত্ন। পাঁচটি রঙ: এমারেল্ড, পার্পল, শ্যাম্পেন, নেভি, পিচ। World-class satin that’s gentle on your hair — no creases, no snags. Style by day, care by night, in five colours: emerald, purple, champagne, navy and peach.',
      tags: ['Scrunchies', 'Satin', 'New'],
      material: 'স্যাটিন — Satin',
      priceMin: 250,
      priceMax: 300,
      priceNote: null,
      productStatus: ProductStatus.NEW,
      categorySlugs: ['hair-accessories'],
      featuredImageId: media.morningScrunchies.id,
      galleryImageIds: [media.scrunchieTower.id],
    },
    {
      productCode: 'HAIR-003',
      slug: 'velvet-scrunchie-multi-pack',
      name: 'ভেলভেট স্ক্রাঞ্চি মাল্টি-প্যাক — Velvet Scrunchie Multi-Pack',
      shortDesc:
        'গাঢ় রঙের নরম ভেলভেট স্ক্রাঞ্চির মাল্টি-প্যাক — শীত-শরতের সাজে আভিজাত্য। Rich velvet scrunchies in deep tones — elegance for every season.',
      longDesc:
        'ভেলভেটের গভীর রঙ আর নরম ছোঁয়া — প্রতিদিনের খোঁপা থেকে উৎসবের সাজ, সবকিছুতে মানিয়ে যায়। টেকসই ইলাস্টিক, যত্নে সেলাই করা। Deep velvet tones with a soft touch — from everyday buns to festive looks. Durable elastics, carefully stitched.',
      tags: ['Scrunchies', 'Velvet'],
      material: 'ভেলভেট — Velvet',
      priceMin: 280,
      priceMax: 350,
      priceNote: null,
      productStatus: ProductStatus.ACTIVE,
      categorySlugs: ['hair-accessories'],
      featuredImageId: media.scrunchieTower.id,
      galleryImageIds: [media.hairStand.id],
    },
    {
      productCode: 'HAIR-004',
      slug: 'satin-headbands-10-colour-set',
      name: 'স্যাটিন হেডব্যান্ড ১০-কালার সেট — Satin Headbands (10-Colour Set)',
      shortDesc:
        'দশটি রঙের স্যাটিন-মোড়ানো হেডব্যান্ড — প্রতিদিনের জন্য একেকটি রঙ। Satin-wrapped headbands in ten colours — one for every mood.',
      longDesc:
        'মসৃণ স্যাটিনে মোড়ানো হালকা হেডব্যান্ড — সারাদিন পরেও চাপ লাগে না। দশটি রঙের সেট: উজ্জ্বল থেকে প্যাস্টেল, সব সাজে মানানসই। Smooth satin-wrapped headbands, light enough for all-day wear. A ten-colour set from brights to pastels to match any outfit.',
      tags: ['Headbands', 'Satin', 'Hot'],
      material: 'স্যাটিন — Satin',
      priceMin: 300,
      priceMax: 350,
      priceNote: null,
      productStatus: ProductStatus.HOT,
      categorySlugs: ['hair-accessories'],
      featuredImageId: media.headbandsLoop.id,
      galleryImageIds: [media.headbandsCloseup.id],
    },
    {
      productCode: 'HAIR-005',
      slug: 'gingham-bow-bands',
      name: 'গিংহাম বো ব্যান্ড — Gingham Bow Bands',
      shortDesc:
        'গিংহাম চেক আর লেপার্ড প্রিন্টের বো হেয়ারব্যান্ড — মিষ্টি, ক্লাসিক লুক। Gingham-check and leopard-print bow bands — a sweet, classic look.',
      longDesc:
        'ক্লাসিক গিংহাম চেক আর ট্রেন্ডি প্রিন্টে তৈরি বো হেয়ারব্যান্ড — স্কুল, অফিস কিংবা ঘোরাঘুরির সাজে মিষ্টি ছোঁয়া। নরম ফ্যাব্রিক, আরামদায়ক ফিট। Bow hair bands in classic gingham and trending prints — a sweet touch for school, work or weekends. Soft fabric, comfortable fit.',
      tags: ['Bows', 'Headbands', 'New'],
      material: 'কটন-মিক্স ফ্যাব্রিক — Cotton-mix fabric',
      priceMin: 120,
      priceMax: 180,
      priceNote: null,
      productStatus: ProductStatus.NEW,
      categorySlugs: ['hair-accessories'],
      featuredImageId: media.headbandsCloseup.id,
      galleryImageIds: [media.headbandsLoop.id],
    },
    // ── The three FEATURED heroes — created last so they lead the storefront ──
    {
      productCode: 'JUT-001',
      slug: 'jute-tote-orange-handle',
      name: 'পাটের টোট ব্যাগ (কমলা হাতল) — Jute Tote Bag (Orange Handle)',
      shortDesc:
        'কমলা হাতলের পরিবেশবান্ধব পাটের টোট — রোজকার সঙ্গী, বাংলার ঐতিহ্য। An eco-friendly jute tote with orange handles — everyday carry, Bengal heritage.',
      longDesc:
        'বাংলার সোনালী আঁশ পাটে বোনা এই টোট ব্যাগে আছে উজ্জ্বল কমলা হাতলের ছোঁয়া — প্রকৃতির রঙে একটু রোদ্দুর। টেকসই বুনন, প্রশস্ত ভেতর, প্রতিদিনের বাজার-অফিস-ঘোরাঘুরির নির্ভরযোগ্য সঙ্গী। Woven from Bengal’s golden fibre with a pop of bright orange on the handles — a little sunshine on natural tones. Durable weave, roomy interior, a reliable companion for markets, office and outings. খুচরা ও পাইকারী দুই-ই পাওয়া যায়। Available retail and wholesale.',
      tags: ['Jute', 'Eco-friendly', 'Featured'],
      material: 'পাট — Natural jute',
      priceMin: 350,
      priceMax: 450,
      priceNote: null,
      productStatus: ProductStatus.FEATURED,
      categorySlugs: ['jute-bags'],
      featuredImageId: media.juteTote.id,
      galleryImageIds: [media.flatlay.id],
    },
    {
      productCode: 'HAIR-001',
      slug: 'leopard-scrunchie-stand-set',
      name: 'লেপার্ড স্ক্রাঞ্চি স্ট্যান্ড সেট — Leopard Scrunchie Stand Set',
      shortDesc:
        'স্ট্যান্ডসহ লেপার্ড-প্রিন্ট স্ক্রাঞ্চির সেট — সাজের টেবিলের শোভা। A leopard-print scrunchie set with its own display stand.',
      longDesc:
        'ট্রেন্ডি লেপার্ড প্রিন্টের স্ক্রাঞ্চি, সাথে সুন্দর ডিসপ্লে স্ট্যান্ড — নিজের সাজের টেবিলে রাখুন বা উপহার দিন। নরম ফ্যাব্রিক, মজবুত ইলাস্টিক, বিশ্বমানের ফিনিশ। Trendy leopard-print scrunchies on a lovely display stand — dress your vanity or gift the whole set. Soft fabric, strong elastics, world-class finish.',
      tags: ['Scrunchies', 'Gift', 'Featured'],
      material: 'সফট ফ্যাব্রিক — Soft fabric',
      priceMin: 220,
      priceMax: 280,
      priceNote: null,
      productStatus: ProductStatus.FEATURED,
      categorySlugs: ['hair-accessories'],
      featuredImageId: media.hairStand.id,
      galleryImageIds: [media.scrunchieTower.id, media.flatlay.id],
    },
    {
      productCode: 'NIGHT-001',
      slug: 'night-care-satin-trio',
      name: 'নাইট-কেয়ার স্যাটিন ট্রায়ো — Night-Care Satin Trio',
      shortDesc:
        'রাতের প্রশান্তি — ঘুমের সময় চুলের যত্নে তিনটি নরম স্যাটিন স্ক্রাঞ্চি। Night’s tranquility — three soft satin scrunchies for all-night hair care.',
      longDesc:
        '“রাতের প্রশান্তি, ইচ্ছে ঘুড়ি’র যত্ন।” ঘুমের মধ্যে চুল ভাঙা আর জট থেকে বাঁচাতে মসৃণ স্যাটিনের তিনটি স্ক্রাঞ্চির সেট — সকালে চুল থাকে ঝরঝরে। কালকের জন্য আপনার পছন্দের স্ক্রাঞ্চি কোনটি? Smooth satin protects your hair from creases and tangles while you sleep, so mornings start frizz-free. A trio of night-time favourites — which one is yours for tomorrow?',
      tags: ['Night Care', 'Satin', 'Featured'],
      material: 'স্যাটিন — Satin',
      priceMin: 200,
      priceMax: 260,
      priceNote: null,
      productStatus: ProductStatus.FEATURED,
      categorySlugs: ['night-care', 'hair-accessories'],
      featuredImageId: media.nightScrunchies.id,
      galleryImageIds: [media.morningScrunchies.id],
    },
  ];

  for (const p of products) {
    const categoryIds = p.categorySlugs.map((slug) => ({ id: cats[slug].id }));
    const galleryIds = p.galleryImageIds.map((id) => ({ id }));

    const shared = {
      name: p.name,
      productCode: p.productCode,
      shortDesc: p.shortDesc,
      longDesc: p.longDesc,
      tags: p.tags,
      material: p.material,
      priceMin: p.priceMin,
      priceMax: p.priceMax,
      priceNote: p.priceNote,
      productStatus: p.productStatus,
      attributes: p.attributes ?? undefined,
      featuredImageId: p.featuredImageId,
    };

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        ...shared,
        categories: { set: categoryIds },
        images: { set: galleryIds },
      },
      create: {
        ...shared,
        slug: p.slug,
        createdBy: adminId,
        categories: { connect: categoryIds },
        images: { connect: galleryIds },
      },
    });
  }

  console.log(`✔ ${products.length} products upserted (JUT-001..003, HAIR-001..005, NIGHT-001)`);
}

// ── 8. Hero section (admin-managed hero rows) ────────────────────────────────
// The public order-now page reads homepageConfig.orderHero (seeded above); a
// branded HeroSection row is still seeded so the admin hero manager isn't
// empty. findFirst-guarded — the model has no natural unique key.

async function seedHeroSection(media: Awaited<ReturnType<typeof seedMedia>>) {
  const existing = await prisma.heroSection.findFirst();
  if (!existing) {
    await prisma.heroSection.create({
      data: {
        title: 'আভিজাত্যের ছোঁয়া…',
        subtitle: 'A touch of elegance…',
        description:
          'পরিবেশবান্ধব পাটের ব্যাগ আর বিশ্বমানের হেয়ার অ্যাক্সেসরিজ — খুচরা ও পাইকারী, সারা ঢাকায় ডেলিভারি। Eco-friendly jute bags & world-class hair accessories — retail & wholesale, delivered across Dhaka.',
        buttonText: 'অর্ডার করুন — Order Now',
        buttonLink: '/order-now',
        badgeLabel: '🪁',
        badgeText: 'খুচরা ও পাইকারী — Retail & Wholesale',
        imageID: media.flatlay.id,
        isActive: true,
        order: 0,
      },
    });
    console.log('✔ hero section created');
  } else {
    console.log('✔ hero section already present — left untouched');
  }
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🪁 Ische Ghuree seed started…');

  const superAdmin = await seedSuperAdmin();
  const media = await seedMedia(superAdmin.id);
  await seedSiteSettings(media);
  await seedSocialLinks();
  await seedTheme();
  const cats = await seedCategories(media, superAdmin.id);
  await seedProducts(media, cats, superAdmin.id);
  await seedHeroSection(media);

  console.log('🪁 Seed completed — ইচ্ছে ঘুড়ি is ready to fly.');
  console.log('   Run "pnpm run prisma:seed:pages" next to seed the storefront pages.');
}

main()
  .catch((err) => {
    console.error('seed failed', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
