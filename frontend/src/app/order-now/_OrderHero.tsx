import Image from "next/image";
import { Phone, Mail } from "lucide-react";

export interface OrderHeroData {
  title?: string | null;
  subtitle?: string | null;
  personName?: string | null;
  phone?: string | null;
  email?: string | null;
  instructions?: string | null;
  badgeText?: string | null;
  imageUrl?: string | null;
  bottomImageUrl?: string | null;
}

/** Small vector kite in the four brand facet colours. */
function KiteMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 56" className={className} aria-hidden="true">
      <polygon points="20,2 36,20 20,38 4,20" fill="none" />
      <polygon points="20,2 36,20 20,20" fill="var(--kite-cyan)" />
      <polygon points="36,20 20,38 20,20" fill="var(--kite-magenta)" />
      <polygon points="20,38 4,20 20,20" fill="var(--kite-green)" />
      <polygon points="4,20 20,2 20,20" fill="var(--kite-orange)" />
      <path
        d="M20 38 C 22 44, 16 48, 20 54"
        fill="none"
        stroke="var(--kite-magenta)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Four-colour ribbon divider. */
function KiteRibbon({ className = "" }: { className?: string }) {
  return (
    <div className={`flex h-1 rounded-full overflow-hidden ${className}`} aria-hidden="true">
      <span className="flex-1" style={{ background: "var(--kite-cyan)" }} />
      <span className="flex-1" style={{ background: "var(--kite-orange)" }} />
      <span className="flex-1" style={{ background: "var(--kite-magenta)" }} />
      <span className="flex-1" style={{ background: "var(--kite-green)" }} />
    </div>
  );
}

export default function OrderHero({ hero }: { hero: OrderHeroData }) {
  const title = hero.title?.trim() || "ইচ্ছে ঘুড়ি";
  const subtitle = hero.subtitle?.trim() || "আবহমান বাংলার ঐতিহ্য";
  const personName = hero.personName?.trim() || "Ische Ghuree";
  const phone = hero.phone?.trim() || "01820-417426";
  const email = hero.email?.trim() || "ischeghuree@gmail.com";
  const badgeText = hero.badgeText?.trim() || "আপনার জন্যই তৈরি — Made Just For You!";
  const instructions = hero.instructions?.trim() || "";
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <section className="relative overflow-hidden flex flex-col justify-between p-5 md:p-6 bg-gradient-to-b from-primary/10 via-background to-muted">
      {/* Decorative kite, top-left */}
      <KiteMark className="absolute top-4 left-4 w-8 h-11 opacity-70 pointer-events-none" />

      {/* Central content — logo, title, subtitle, tagline */}
      <div className="relative z-10 flex flex-col items-center text-center px-2 pt-6">
        {hero.imageUrl ? (
          <Image
            src={hero.imageUrl}
            alt={`${title} logo`}
            width={800}
            height={300}
            sizes="(max-width: 768px) 100vw, 400px"
            className="w-full h-auto max-h-44 object-contain rounded-2xl"
            priority
          />
        ) : (
          <Image
            src="/ische-ghuree-logo.jpg"
            alt="ইচ্ছে ঘুড়ি — Ische Ghuree logo"
            width={400}
            height={400}
            sizes="(max-width: 768px) 60vw, 260px"
            className="w-40 md:w-48 h-auto rounded-2xl border border-border shadow-theme-sm"
            priority
          />
        )}

        <h1 className="mt-4 font-heading text-3xl md:text-4xl font-bold text-heading">{title}</h1>

        <p className="mt-1 text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-primary">
          {subtitle}
        </p>

        <KiteRibbon className="mt-3 w-full max-w-[240px]" />

        <p className="mt-3 text-sm md:text-base text-foreground font-medium">
          আভিজাত্যের ছোঁয়া…{" "}
          <span className="text-muted-foreground italic">A touch of elegance…</span>
        </p>
        <p className="mt-1 text-xs md:text-sm text-muted-foreground">
          পাটের ব্যাগ · হেয়ার অ্যাক্সেসরিজ — Jute bags &amp; hair accessories
        </p>
      </div>

      {/* Bottom — product image on the left, contact + badge on the right */}
      <div className="relative flex-1 mt-4 min-h-[240px]">
        {hero.bottomImageUrl && (
          <div
            className="absolute left-0 bottom-0 w-[58%] h-full z-0 rounded-2xl overflow-hidden"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse 110% 110% at 0% 100%, black 55%, transparent 100%)",
              maskImage:
                "radial-gradient(ellipse 110% 110% at 0% 100%, black 55%, transparent 100%)",
            }}
          >
            <Image
              src={hero.bottomImageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 60vw, 250px"
              className="object-cover object-left-bottom"
            />
          </div>
        )}

        <div
          className={`relative z-10 h-full flex flex-col justify-center gap-6 md:gap-8 ${
            hero.bottomImageUrl ? "items-end pr-2" : "items-center"
          }`}
        >
          {/* Order contact block */}
          <div className="text-center max-w-[70%] bg-card/80 backdrop-blur-sm border border-border rounded-2xl px-5 py-4 shadow-theme-sm">
            <p className="font-heading text-xl md:text-2xl font-bold text-heading mb-0.5">
              অর্ডার করতে
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-2">
              To order · {personName}
            </p>
            {instructions ? (
              <p className="text-sm text-foreground leading-snug whitespace-pre-line">
                {instructions}
              </p>
            ) : (
              <div className="text-sm text-foreground leading-snug space-y-1">
                <a
                  href={phoneHref}
                  className="flex items-center justify-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-primary" /> কল করুন {phone}
                </a>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center justify-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-primary" /> {email}
                </a>
              </div>
            )}
          </div>

          {/* Round badge — kite-colour ring */}
          <div
            className="relative shrink-0 rounded-full p-1"
            style={{
              background:
                "conic-gradient(var(--kite-cyan), var(--kite-orange), var(--kite-magenta), var(--kite-green), var(--kite-cyan))",
            }}
          >
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-card border border-border flex items-center justify-center text-center px-4">
              <p className="text-[10px] md:text-[11px] font-bold leading-snug text-heading">
                {badgeText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
