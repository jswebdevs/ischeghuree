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

  // The whole bar is a Link to /order-now. The marquee uses two duplicates of
  // the text in a row that translates -50%, giving an infinite seamless loop.
  return (
    <Link
      href="/order-now"
      className="block w-full bg-primary text-primary-foreground py-2.5 cursor-pointer hover:opacity-95 transition-opacity overflow-hidden relative"
      aria-label={text}
    >
      <div className="container mx-auto px-4 flex items-center gap-3">
        <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />

        {/* Marquee — a single text span that enters from the left, travels
            to the right, then restarts from the left after one full pass.
            No duplicates so the message never appears twice on screen. */}
        <div className="relative flex-1 min-w-0 overflow-hidden h-5">
          <span className="ig-marquee-track absolute top-0 whitespace-nowrap text-sm font-bold will-change-transform">
            🪁 {text}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary-foreground text-primary rounded-full text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer"
            >
              {btnText}
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
    </Link>
  );
}
