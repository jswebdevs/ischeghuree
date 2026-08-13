import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, ArrowRight, ClipboardList } from "lucide-react";

interface KiteHeroConfig {
  headline?: string;
  subheadline?: string;
  tagline?: string;
  brandName?: string;
  contactPhone?: string;
  contactEmail?: string;
  image?: string;
  imageUrl?: string;
}

interface KiteHeroProps {
  heroConfig?: KiteHeroConfig;
}

// ইচ্ছে ঘুড়ি hero — day-sky gradient with kite-facet glows and the kite mark
// floating above a Bangla-first headline stack. Everything is admin-editable
// from /dashboard/super-admin/storefront/homepage (homepageConfig.kiteHero);
// the fallbacks below mirror the seeded defaults exactly.
export default function KiteHero({ heroConfig = {} }: KiteHeroProps) {
  const headline = heroConfig.headline || "আভিজাত্যের ছোঁয়া…";
  const subheadline = heroConfig.subheadline || "A touch of elegance…";
  const tagline =
    heroConfig.tagline ||
    "পরিবেশবান্ধব পাটের ব্যাগ আর বিশ্বমানের হেয়ার অ্যাক্সেসরিজ — আবহমান বাংলার ঐতিহ্য, আপনার দরজায়। Eco-friendly jute bags & world-class hair accessories, delivered across Dhaka.";
  const brandName = heroConfig.brandName || "ইচ্ছে ঘুড়ি — Ische Ghuree";
  const contactPhone = heroConfig.contactPhone || "01820-417426";
  const contactEmail = heroConfig.contactEmail || "ischeghuree@gmail.com";
  const image = heroConfig.image || heroConfig.imageUrl || "/ische-ghuree-logo.jpg";

  const telHref = `tel:${contactPhone.replace(/[^\d+]/g, "")}`;
  const mailHref = `mailto:${contactEmail}`;

  return (
    <section
      className="relative w-full min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-b from-primary/15 via-background to-background"
      aria-label="Hero"
    >
      {/* Sky + kite-facet glows (decorative) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[70vw] h-[50vh] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-kite-cyan/15 rounded-full blur-[110px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-kite-magenta/10 rounded-full blur-[110px]" />
        <div className="absolute top-1/4 right-[12%] w-40 h-40 bg-kite-orange/10 rounded-full blur-[80px]" />
        {/* Floating kite mark */}
        <Image
          src="/ische-ghuree.svg"
          alt=""
          width={130}
          height={130}
          className="hidden md:block absolute top-16 right-[8%] opacity-70 animate-float-slow select-none"
        />
        <Image
          src="/ische-ghuree.svg"
          alt=""
          width={56}
          height={56}
          className="absolute bottom-12 left-[6%] opacity-30 rotate-12 animate-float-slow select-none"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text stack — Bangla first, English echo */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Brand kicker */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-card/80 border border-border rounded-full shadow-theme-sm">
              <Image src="/ische-ghuree.svg" alt="" width={18} height={18} aria-hidden="true" />
              <span className="text-xs font-bold tracking-wide text-foreground">{brandName}</span>
            </div>

            {/* Headline (LCP) */}
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-heading leading-tight mb-3">
              {headline}
            </h1>

            {/* English echo */}
            {subheadline && (
              <p className="text-base md:text-lg font-medium text-muted-foreground tracking-[0.2em] uppercase mb-5">
                {subheadline}
              </p>
            )}

            {/* Kite facet divider */}
            <div
              className="flex items-center justify-center lg:justify-start gap-1.5 mb-6"
              aria-hidden="true"
            >
              <span className="h-1 w-10 rounded-full bg-kite-cyan" />
              <span className="h-1 w-10 rounded-full bg-kite-orange" />
              <span className="h-1 w-10 rounded-full bg-kite-magenta" />
              <span className="h-1 w-10 rounded-full bg-kite-green" />
            </div>

            {/* Tagline */}
            {tagline && (
              <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                {tagline}
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-8">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 hover:scale-[1.02] transition-all shadow-theme-md w-full sm:w-auto"
              >
                পছন্দেরটি বেছে নিন — Shop
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/order-now"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-primary/40 text-primary bg-card/60 font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-colors w-full sm:w-auto"
              >
                <ClipboardList className="w-4 h-4" aria-hidden="true" />
                কোটেশন নিন — Request a Quote
              </Link>
            </div>

            {/* Contact lines */}
            {(contactPhone || contactEmail) && (
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {contactPhone && (
                  <a
                    href={telHref}
                    className="inline-flex items-center gap-2 hover:text-primary transition-colors"
                    aria-label={`Call ${contactPhone}`}
                  >
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    <span className="font-bold tracking-wider">{contactPhone}</span>
                  </a>
                )}
                {contactEmail && (
                  <a
                    href={mailHref}
                    className="inline-flex items-center gap-2 hover:text-primary transition-colors"
                    aria-label={`Email ${contactEmail}`}
                  >
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    <span className="font-bold tracking-wider">{contactEmail}</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Brand image */}
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto w-full max-w-md lg:max-w-lg aspect-square">
              {/* Facet ring behind the image */}
              <div
                className="absolute -inset-4 rounded-[3rem] opacity-20 blur-2xl"
                style={{
                  background:
                    "conic-gradient(var(--kite-cyan), var(--kite-orange), var(--kite-magenta), var(--kite-green), var(--kite-cyan))",
                }}
                aria-hidden="true"
              />
              <div className="relative w-full h-full rounded-[3rem] overflow-hidden border border-border bg-card shadow-theme-xl">
                <Image
                  src={image}
                  alt={`${brandName} — ${headline}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 520px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
