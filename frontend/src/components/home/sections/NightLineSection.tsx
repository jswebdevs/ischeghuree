import Image from "next/image";
import Link from "next/link";
import { Moon, Leaf, Phone, ArrowRight } from "lucide-react";

// Two brand-story panels straight from the Facebook creatives:
// 1. "রাতের প্রশান্তি" — the night-comfort satin scrunchie line, presented as a
//    dark spotlight over the actual night marketing photo.
// 2. "সোনালী আঁশ" — the jute heritage split with the riverside tote photo,
//    carrying the eco / wholesale-retail story.
export default function NightLineSection() {
  return (
    <section aria-label="Night comfort line and jute heritage">
      {/* ── Night spotlight ────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden">
        <Image
          src="/images/products/night-scrunchies-creative.jpg"
          alt="স্যাটিন স্ক্রাঞ্চি — রাতের আলোয় ইচ্ছে ঘুড়ির নাইট কেয়ার লাইন"
          fill
          sizes="100vw"
          className="object-cover"
        />
        {/* Night wash so the copy stays readable over the photo */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25"
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm">
              <Moon className="w-3.5 h-3.5 text-kite-cyan" aria-hidden="true" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                নাইট কেয়ার · Night Comfort
              </span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-3">
              রাতের প্রশান্তি, ইচ্ছে ঘুড়ি&rsquo;র যত্ন
            </h2>
            <p className="text-sm md:text-base text-white/70 tracking-[0.2em] uppercase mb-6">
              Night&rsquo;s tranquility, Ische Ghuree&rsquo;s care
            </p>

            <p className="text-base md:text-lg text-white/85 leading-relaxed mb-8">
              নরম স্যাটিনের ছোঁয়ায় চুল থাকুক যত্নে — সারা রাত। এমারেল্ড, পার্পল,
              শ্যাম্পেন, নেভি কিংবা পিচ — কালকের জন্য আপনার পছন্দের স্ক্রাঞ্চি
              কোনটি? Soft satin scrunchies that care for your hair all night long.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 hover:scale-[1.02] transition-all"
            >
              পছন্দেরটি বেছে নিন — Pick your favourite
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Jute heritage split ────────────────────────────────────────── */}
      <div className="bg-muted/40 border-y border-border/50">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Photo */}
            <div className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-border shadow-theme-lg">
              <Image
                src="/images/products/jute-tote-riverside.jpg"
                alt="পরিবেশবান্ধব পাটের টোট ব্যাগ — নদীর ধারে পিকনিক টেবিলে"
                fill
                sizes="(max-width: 1024px) 90vw, 560px"
                className="object-cover"
              />
            </div>

            {/* Story */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 bg-kite-green/10 border border-kite-green/30 rounded-full">
                <Leaf className="w-3.5 h-3.5 text-kite-green" aria-hidden="true" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-kite-green">
                  সোনালী আঁশ · Golden Fibre
                </span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-heading leading-tight mb-3">
                আবহমান বাংলার ঐতিহ্য
              </h2>
              <p className="text-sm md:text-base text-muted-foreground tracking-[0.2em] uppercase mb-6">
                The timeless heritage of Bengal
              </p>

              <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
                <p>
                  পাট — বাংলার সোনালী আঁশ। সেই আঁশে বোনা আমাদের পরিবেশবান্ধব
                  ব্যাগ: টেকসই, প্রাকৃতিক, আর প্রতিদিনের ব্যবহারে আভিজাত্যের
                  ছোঁয়া। Woven from Bengal&rsquo;s golden fibre, our jute bags are
                  durable, natural and effortlessly elegant.
                </p>
                <p>
                  পাইকারী (Wholesale) বা খুচরা (Retail) — যেভাবে চান, যত চান।
                  কল করুন, বাকিটা আমরা সামলে নেব।
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Link
                  href="/order-now"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 hover:scale-[1.02] transition-all"
                >
                  কোটেশন নিন — Request a Quote
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <a
                  href="tel:01820417426"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-primary/40 text-primary font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Call 01820-417426"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  কল করুন: 01820-417426
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
