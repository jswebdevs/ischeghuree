"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";

interface StickyBannerData {
  text?: string;
  btnText?: string;
}

interface StickyBannerProps {
  data?: StickyBannerData | null;
  whatsappLink?: string;
}

// Top promo banner. Renders ABOVE the navbar in normal document flow (so it
// can never overlap the sticky header), with a CSS-only marquee for the
// message text — no JS animation, pauses on hover so users can read.
export default function StickyBanner({ data, whatsappLink }: StickyBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("ig-banner-dismissed");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage is only readable client-side; hydration-safe reveal
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setVisible(false);
    sessionStorage.setItem("ig-banner-dismissed", "1");
  };

  const text =
    data?.text ||
    "পরিবেশবান্ধব পাটের ব্যাগ ও হেয়ার অ্যাক্সেসরিজ — সারা ঢাকায় হোম ডেলিভারি · Eco-friendly jute bags & hair accessories, home delivery across Dhaka · কল করুন: 01820-417426";
  const btnText = data?.btnText || "অর্ডার করুন — Order Now";
  const link = whatsappLink || "";

  if (!visible) return null;

  // The bar itself is a plain <div>; a full-bleed overlay <Link> makes the
  // whole surface navigate to /order-now WITHOUT nesting the CTA anchor and
  // the dismiss button inside an anchor (anchor-in-anchor / button-in-anchor
  // is invalid HTML). Interactive controls sit above the overlay via z-10.
  return (
    <div className="ig-banner relative block w-full bg-primary text-primary-foreground py-2.5 hover:opacity-95 transition-opacity overflow-hidden">
      <Link
        href="/order-now"
        aria-label={text}
        className="absolute inset-0 cursor-pointer"
      />
      <div className="container mx-auto px-4 flex items-center gap-3">
        <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />

        {/* Marquee — the message is rendered twice inside a track that
            translates 0 → -50% (exactly one copy's width), giving a seamless
            infinite loop that shows the FULL text on any container width —
            a single-span pass clipped the second half on narrow phones. */}
        <div className="relative flex-1 min-w-0 overflow-hidden h-5">
          <div className="ig-marquee-track flex w-max whitespace-nowrap text-sm font-bold will-change-transform">
            <span className="pr-16">🪁 {text}</span>
            <span className="pr-16" aria-hidden="true">🪁 {text}</span>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 shrink-0">
          {/* CTA always renders and goes where its label promises: the order
              form. It no longer sits dead behind the whatsappLink gate. */}
          <Link
            href="/order-now"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary-foreground text-primary rounded-full text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer"
          >
            {btnText}
          </Link>
          {/* WhatsApp chat — only when configured, labeled for what it does. */}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              title="হোয়াটসঅ্যাপে চ্যাট করুন — Chat on WhatsApp"
              aria-label="হোয়াটসঅ্যাপে চ্যাট করুন — Chat on WhatsApp"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 border border-primary-foreground/40 text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary-foreground/15 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" /> WhatsApp
            </a>
          )}
          <button
            type="button"
            onClick={dismiss}
            className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
