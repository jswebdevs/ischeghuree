"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import MarqueeTicker from "./MarqueeTicker";

/** One marquee message and its own scroll time (seconds to cross the bar). */
export interface BannerMessage {
  text: string;
  speed: number;
}

interface StickyBannerData {
  /** Marquee messages, shown one after another. Plain strings are the older
   *  shape and use `speed` as their scroll time. */
  messages?: (string | Partial<BannerMessage>)[];
  /** Legacy single message — fallback when `messages` is empty. */
  text?: string;
  btnText?: string;
  /** Marquee font size in px. */
  fontSize?: number;
  /** Fallback scroll time for messages without their own (legacy). */
  speed?: number;
  /** Seconds of pause between one message leaving and the next entering. */
  gap?: number;
}

export const BANNER_FONT_SIZE = { min: 10, max: 48, default: 20 };
export const BANNER_SPEED = { min: 4, max: 120, default: 18 };
export const BANNER_GAP = { min: 0, max: 30, default: 2 };

const clamp = (v: unknown, { min, max, default: d }: { min: number; max: number; default: number }) => {
  const n = Number(v);
  return v !== undefined && v !== null && v !== "" && Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : d;
};

export const DEFAULT_BANNER_MESSAGE =
  "পরিবেশবান্ধব পাটের ব্যাগ ও হেয়ার অ্যাক্সেসরিজ — সারা ঢাকায় হোম ডেলিভারি · Eco-friendly jute bags & hair accessories, home delivery across Dhaka · কল করুন: 01820-417426";

export const clampBannerSpeed = (v: unknown) => clamp(v, BANNER_SPEED);

// Resolves any saved shape (object messages, plain-string messages, or the
// legacy single `text`) into messages that each carry their own scroll time.
export function normalizeBannerMessages(data?: StickyBannerData | null): BannerMessage[] {
  const fallbackSpeed = clampBannerSpeed(data?.speed);
  const messages = (data?.messages ?? [])
    .map((m) =>
      typeof m === "string"
        ? { text: m, speed: fallbackSpeed }
        : { text: m?.text ?? "", speed: m?.speed === undefined ? fallbackSpeed : clampBannerSpeed(m.speed) },
    )
    .filter((m) => m.text.trim());
  return messages.length
    ? messages
    : [{ text: data?.text || DEFAULT_BANNER_MESSAGE, speed: fallbackSpeed }];
}

interface StickyBannerProps {
  data?: StickyBannerData | null;
  whatsappLink?: string;
}

// Top promo banner. Renders ABOVE the navbar in normal document flow (so it
// can never overlap the sticky header), with a ticker that scrolls the
// admin's messages one after another — pauses on hover so users can read.
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

  const messages = normalizeBannerMessages(data);
  const btnText = data?.btnText || "অর্ডার করুন — Order Now";
  const link = whatsappLink || "";
  const fontSize = clamp(data?.fontSize, BANNER_FONT_SIZE);
  const gap = clamp(data?.gap, BANNER_GAP);

  if (!visible) return null;

  // The bar itself is a plain <div>; a full-bleed overlay <Link> makes the
  // whole surface navigate to /order-now WITHOUT nesting the CTA anchor and
  // the dismiss button inside an anchor (anchor-in-anchor / button-in-anchor
  // is invalid HTML). Interactive controls sit above the overlay via z-10.
  return (
    <div className="ig-banner relative block w-full bg-primary text-primary-foreground py-2 hover:opacity-95 transition-opacity overflow-hidden">
      <Link
        href="/order-now"
        aria-label={messages.map((m) => m.text).join(" · ")}
        className="absolute inset-0 cursor-pointer"
      />
      <div className="container mx-auto px-4 flex items-center gap-3">
        <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />

        <MarqueeTicker messages={messages} fontSize={fontSize} gap={gap} />

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
