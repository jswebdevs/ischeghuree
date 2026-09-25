import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Store, Sparkles, type LucideIcon } from "lucide-react";
import { getGlobalSettings } from "@/lib/getSettings";
import FooterSocials from "./FooterSocials";

interface FooterLink {
  label?: string;
  href: string;
}

interface FooterContact {
  icon?: string;
  text?: string;
  link?: string;
}

interface FooterConfig {
  col1?: { showLogo?: boolean; showTitle?: boolean; title?: string; description?: string };
  col2?: { title?: string; links: FooterLink[] };
  col3?: { title?: string; links: FooterLink[] };
  col4?: { title?: string; contacts: FooterContact[] };
}

async function getPublicSocialLinks() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/social`, {
      next: { revalidate: 300 }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function Footer() {
  const [settings, socialLinks] = await Promise.all([
    getGlobalSettings(),
    getPublicSocialLinks()
  ]);

  const storeName = settings?.storeName || "ইচ্ছে ঘুড়ি";
  const tagline = settings?.tagline || "আভিজাত্যের ছোঁয়া… A touch of elegance — পরিবেশবান্ধব পাটের ব্যাগ ও ওয়ার্ল্ড-ক্লাস হেয়ার অ্যাক্সেসরিজ, ঢাকা থেকে সারাদেশে ডেলিভারি।";
  const address = settings?.contactAddress || settings?.address || "Dhaka Uddan, Mohammadpur, Dhaka 1207";
  const phone = settings?.contactPhone || settings?.supportPhone || "01820-417426";
  const email = settings?.contactEmail || settings?.supportEmail || "ischeghuree@gmail.com";
  const logoUrl = settings?.logo?.originalUrl || null;
  const footerConfig = settings?.footerConfig as FooterConfig | undefined;

  const col1 = footerConfig?.col1 || {
    showLogo: true,
    showTitle: true,
    title: "ইচ্ছে ঘুড়ি — Ische Ghuree",
    description: settings?.companySlogan || "আবহমান বাংলার ঐতিহ্য — the timeless heritage of Bengal. Eco-friendly jute bags (খুচরা ও পাইকারী) and world-class hair accessories, made with care since 2020."
  };

  const col2 = footerConfig?.col2 || {
    title: "Quick Links",
    links: [
      { label: "Shop", href: "/shop" },
      { label: "Order Now", href: "/order-now" },
      { label: "Categories", href: "/categories" },
      { label: "About Us", href: "/about-us" },
      { label: "Contact Us", href: "/contact-us" }
    ]
  };

  const col3 = footerConfig?.col3 || {
    title: "Information",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Shipping & Delivery", href: "/shipping-policy" },
      { label: "Return & Exchange", href: "/return-refund-policy" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" }
    ]
  };

  const col4 = footerConfig?.col4 || {
    title: "Contact Us",
    contacts: [
      { icon: "MapPin", text: address },
      { icon: "Phone", text: phone, link: `tel:${String(phone).replace(/[^\d+]/g, "")}` },
      { icon: "Mail", text: email, link: `mailto:${email}` },
      { icon: "Store", text: "facebook.com/iccheghureeofficial", link: "https://www.facebook.com/iccheghureeofficial" }
    ]
  };

  const IconMap: Record<string, LucideIcon> = { Mail, Phone, MapPin, Store };

  return (
    <footer className="bg-gradient-theme border-t border-border mt-auto pt-16 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">

          {/* COLUMN 1: BRANDING & ABOUT */}
          <div className="space-y-8 lg:col-span-4 lg:pr-12">
            <div className="space-y-4">
              {col1.showLogo && (
                <Link href="/" className="block w-fit">
                  {logoUrl ? (
                    <div className="relative h-12 w-48">
                      <Image
                        src={logoUrl}
                        alt={`${storeName} Logo`}
                        fill
                        sizes="(max-width: 768px) 192px, 200px"
                        className="object-contain object-left"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-primary">
                      <Image
                        src="/ische-ghuree.svg"
                        alt="ইচ্ছে ঘুড়ি kite logo"
                        width={40}
                        height={40}
                        className="w-10 h-10"
                      />
                      <span className="font-heading text-2xl font-bold tracking-tight text-foreground">
                        {storeName}
                      </span>
                    </div>
                  )}
                </Link>
              )}

              {col1.showTitle && (
                <h4 className="text-[10px] font-black text-primary tracking-[0.3em] uppercase">
                  {col1.title}
                </h4>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-subheading text-sm font-medium leading-relaxed max-w-sm">
                {tagline}
              </p>
              
              {col1.description && (
                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {col1.description}
                  </p>
                </div>
              )}
            </div>

            <FooterSocials links={socialLinks} />
          </div>

          {/* COLUMN 2: LINKS */}
          <div className="lg:col-span-2">
            <h3 className="text-heading font-bold mb-6 text-sm uppercase tracking-widest">{col2.title}</h3>
            <ul className="space-y-4">
              {col2.links.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-subheading hover:text-primary text-sm font-medium transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: LINKS */}
          <div className="lg:col-span-3">
            <h3 className="text-heading font-bold mb-6 text-sm uppercase tracking-widest">{col3.title}</h3>
            <ul className="space-y-4">
              {col3.links.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-subheading hover:text-primary text-sm font-medium transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: CONTACTS */}
          <div className="lg:col-span-3">
            <h3 className="text-heading font-bold mb-6 text-sm uppercase tracking-widest">{col4.title}</h3>
            <ul className="space-y-5">
              {col4.contacts.map((contact, i) => {
                const Icon = (contact.icon && IconMap[contact.icon]) || MapPin;
                return (
                  <li key={i} className="flex items-start gap-4 text-sm text-subheading">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    {contact.link ? (
                      <a href={contact.link} className="mt-2 min-w-0 wrap-anywhere font-medium leading-relaxed hover:text-primary transition-colors">
                        {contact.text}
                      </a>
                    ) : (
                      <span className="mt-2 min-w-0 wrap-anywhere font-medium leading-relaxed">{contact.text}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-medium text-center md:text-left">
            © {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>
          <Link href="/order-now" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Custom Orders Welcome</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

