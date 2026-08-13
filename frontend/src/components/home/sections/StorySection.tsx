"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import api from "@/lib/axios";
import IconRenderer from "@/components/shared/IconRenderer";

// Seeded highlight rows store bare lucide names ("Heart") while the admin
// icon picker writes react-icons names ("LuHeart", "FaLeaf", …). Alias the
// legacy bare names so both namespaces resolve through IconRenderer.
const LEGACY_ICON_ALIASES: Record<string, string> = {
  Heart: "LuHeart",
  Star: "LuStar",
  Sparkles: "LuSparkles",
};

interface StoryHighlight {
  icon?: string;
  label?: string;
}

interface StorySectionData {
  title?: string;
  paragraphs?: string[];
  highlights?: StoryHighlight[];
  tagline?: string;
}

export default function StorySection({ data: initialData }: { data?: StorySectionData | null }) {
  const [data, setData] = useState<StorySectionData | null | undefined>(initialData);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    // Only fetch if initialData is not provided (SSR fallback)
    if (!initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronous loading flag before the client-side fetch kicks off
      setLoading(true);
      api.get("/settings/homepage")
        .then(res => {
          setData(res.data?.data?.story);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [initialData]);

  // If we are loading AND have no data (neither SSR nor fetched yet), show skeleton
  if (loading && !data) {
    return (
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
           <div className="max-w-4xl mx-auto space-y-8">
              <div className="h-4 w-24 bg-muted/40 rounded-full mx-auto animate-pulse" />
              <div className="h-16 w-3/4 bg-muted/40 rounded-full mx-auto animate-pulse" />
              <div className="h-64 bg-muted/10 border border-border/50 rounded-[3rem] animate-pulse relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
           </div>
        </div>
      </section>
    );
  }

  // If still no data after loading attempt, return null or empty section
  if (!data) return null;

  const content = data;

  const title = content.title || "আমাদের গল্প";
  const paragraphs = content.paragraphs || [];
  const highlights = content.highlights || [];

  // Highlight the last word in the title — but only when there are at least
  // two words. Single-word (or Bangla one-liner) titles render as-is instead
  // of collapsing into an empty lead + all-highlight.
  const titleWords = String(title).trim().split(/\s+/).filter(Boolean);
  const titleLead = titleWords.slice(0, -1).join(" ");
  const titleTail = titleWords[titleWords.length - 1] || "";

  return (
    <section className="py-24 bg-background text-foreground relative overflow-hidden transition-colors duration-500">
      {/* Background accent — capped to viewport so it never overflows on small screens */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(600px,90vw)] h-[min(600px,90vw)] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">আমাদের গল্প · Our Story</span>
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-4xl md:text-6xl font-bold text-heading text-center mb-12 leading-tight"
          >
            {titleWords.length >= 2 ? (
              <>
                {titleLead} <span className="text-primary">{titleTail}</span>
              </>
            ) : (
              title
            )}
          </motion.h2>

          {/* Content card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-muted/20 border border-border/50 rounded-[3rem] p-10 md:p-16 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-6">
              {paragraphs.map((paragraph: string, i: number) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ))}

              {content.tagline && (
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg md:text-xl font-black text-foreground pt-4 border-t border-border/50"
                >
                  ✨ {content.tagline}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Highlight pills */}
          {highlights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-6 mt-12"
            >
              {highlights.map((item, i) => {
                const iconName = item.icon ? LEGACY_ICON_ALIASES[item.icon] ?? item.icon : undefined;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-3 px-6 py-3 bg-muted/30 border border-border/50 rounded-full"
                  >
                    <IconRenderer name={iconName} className="w-4 h-4 text-primary" fallback={Sparkles} />
                    <span className="text-sm font-bold text-foreground uppercase tracking-tight">{item.label}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
