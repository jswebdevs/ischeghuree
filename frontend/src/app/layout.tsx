import type { Metadata } from "next";
import { Noto_Serif_Bengali, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/shared/navbar/Navbar";
import TanstackProvider from "@/lib/tanstack";
import Footer from "@/components/shared/footer/Footer";
import ThemedToaster from "@/components/shared/ThemedToaster";

// 1. Settings and Guard Imports
import { getGlobalSettings, getActiveTheme, getHomepageConfig } from "@/lib/getSettings";
import MaintenanceGuard from "@/components/shared/MaintenanceGuard";
import StickyBanner from "@/components/home/sections/StickyBanner";

// Global Floating Components
import FloatingWidget from "@/components/shared/chatbox/FloatingWidget";
import ToTopButton from "@/components/shared/totop/ToTopButton";

// Brand typography — Bangla-first pairing loaded via next/font.
// Headings: Noto Serif Bengali (elegant serif, renders Bangla + Latin).
// Body/UI:  Hind Siliguri (humanist sans with first-class Bangla support).
// The CSS vars feed the Tailwind @theme tokens --font-heading / --font-body
// in globals.css, exposed as the `font-heading` / `font-body` utilities.
const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["bengali", "latin"],
  variable: "--font-noto-serif-bengali",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const revalidate = 60; // revalidate layout data at most every 60 s

// 2. Dynamic Metadata Generation
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();

  const storeName = settings?.storeName || "ইচ্ছে ঘুড়ি — Ische Ghuree";
  const tagline = settings?.tagline || "আভিজাত্যের ছোঁয়া… A touch of elegance…";
  const faviconUrl = settings?.favicon?.originalUrl || settings?.favicon?.thumbUrl || "/ische-ghuree.svg";
  const ogImageUrl = settings?.ogImage?.originalUrl || "/ische-ghuree-logo.jpg";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_CLIENT_URL || "https://ischeghuree.com"),
    title: {
      default: `${storeName} | ${tagline}`,
      template: `%s | ${storeName}`,
    },
    description: tagline,
    keywords: [
      "jute bags Bangladesh",
      "পাটের ব্যাগ",
      "hair accessories",
      "scrunchies",
      "headbands",
      "ইচ্ছে ঘুড়ি",
      "Ische Ghuree",
      "eco-friendly bags Dhaka",
    ],
    authors: [{ name: storeName }],
    creator: storeName,
    publisher: storeName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [{ url: faviconUrl }],
      shortcut: faviconUrl,
      apple: [{ url: faviconUrl }],
      other: [
        {
          rel: 'apple-touch-icon-precomposed',
          url: faviconUrl,
        },
      ],
    },
    alternates: {
      canonical: '/',
    },

    openGraph: {
      type: "website",
      locale: "bn_BD",
      url: "/",
      siteName: storeName,
      title: storeName,
      description: tagline,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${storeName} Banner`,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: storeName,
      description: tagline,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateViewport() {
  return {
    themeColor: [
      // Brand palette (DESIGN.md §1): day-sky cloud white / deep night blue.
      { media: '(prefers-color-scheme: light)', color: '#f6fafd' },
      { media: '(prefers-color-scheme: dark)', color: '#0d1b2a' },
    ],
  };
}


import { SettingsProvider } from "@/context/SettingsContext";

// 3. Updated Async Root Layout
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, activeTheme, homepage] = await Promise.all([
    getGlobalSettings(),
    getActiveTheme(),
    getHomepageConfig(),
  ]);

  // The announcement bar is sitewide, so its config is read here rather than on
  // the homepage. The WhatsApp link lives under the hero section in
  // homepageConfig, which is where the admin UI writes it.
  const bannerData = (homepage as { stickyBanner?: { text?: string; btnText?: string } } | null)
    ?.stickyBanner;
  const bannerWhatsapp =
    (homepage as { kiteHero?: { whatsappLink?: string } } | null)?.kiteHero?.whatsappLink || "";

  const isMaintenanceMode = settings?.maintenanceMode ?? false;
  const maintenanceMessage = settings?.maintenanceMessage || "সাইটটি এখন রক্ষণাবেক্ষণে আছে — we are briefly down for maintenance. We'll be back shortly!";

  // Organization JSON-LD — search engines use this for the Knowledge Panel
  // (logo, contact, social) and to associate reviews with the brand.
  const baseUrl =
    process.env.NEXT_PUBLIC_CLIENT_URL?.replace(/\/$/, '') || 'https://ischeghuree.com';
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings?.storeName || 'ইচ্ছে ঘুড়ি — Ische Ghuree',
    url: baseUrl,
    logo: settings?.logo?.originalUrl || `${baseUrl}/ische-ghuree-logo.jpg`,
    description: settings?.tagline || 'পরিবেশবান্ধব পাটের ব্যাগ ও হেয়ার অ্যাক্সেসরিজ — eco-friendly jute bags and hair accessories from Dhaka.',
    ...(settings?.contactEmail && { email: settings.contactEmail }),
    ...(settings?.contactPhone && {
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: settings.contactPhone,
        contactType: 'customer support',
        email: settings.contactEmail || undefined,
      },
    }),
  };

  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className={`${notoSerifBengali.variable} ${hindSiliguri.variable}`}
    >
      <head>
        {/* Resource hints — establish early connection to the API server */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL?.split('/api')[0] ?? 'http://localhost:4000'} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL?.split('/api')[0] ?? 'http://localhost:4000'} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {/* Light ("দিনের আকাশ") is the default; visitors who picked dark
            ("রাতের প্রশান্তি") via the header toggle get it applied before
            paint, so there is no flash of the wrong palette. Both palettes are
            admin-editable (Dashboard → Storefront → Themes). */}
        <script dangerouslySetInnerHTML={{
          __html: `
          (function () {
            var dark = false;
            try { dark = localStorage.getItem('ig-theme') === 'dark'; } catch (e) {}
            document.documentElement.classList.toggle('dark', dark);
            document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
          })();
        `}} />

      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:shadow-theme-lg"
        >
          Skip to main content
        </a>
        <TanstackProvider>
          <SettingsProvider initialSettings={settings}>
            <ThemeProvider initialTheme={activeTheme}>

              <MaintenanceGuard
                isMaintenanceMode={isMaintenanceMode}
                message={maintenanceMessage}
              >
                <StickyBanner data={bannerData} whatsappLink={bannerWhatsapp} />
                <Navbar initialSettings={settings} />
                <main id="main-content" className="flex-1">
                  {children}
                </main>
                <Footer />
              </MaintenanceGuard>

              {/* These components use React Portals to break out of layout constraints automatically */}
              {!isMaintenanceMode && (
                <>
                  <FloatingWidget />
                  <ToTopButton />
                </>
              )}

              <ThemedToaster />

            </ThemeProvider>
          </SettingsProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
