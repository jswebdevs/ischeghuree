import dynamic from "next/dynamic";
import KiteHero from "@/components/home/hero/KiteHero";
import StickyBanner from "@/components/home/sections/StickyBanner";
import TrustBar from "@/components/home/afterhero/TrustBar";
import { getHomepageConfig, getFeaturedProducts } from "@/lib/getSettings";

// Below-the-fold sections — code-split to keep the initial bundle lean.
// They still SSR (default), just shipped in their own chunks.
const FeaturedProducts = dynamic(() => import("@/components/home/products/FeaturedProducts"));
const NightLineSection = dynamic(() => import("@/components/home/sections/NightLineSection"));
const StorySection = dynamic(() => import("@/components/home/sections/StorySection"));
const HowItWorks = dynamic(() => import("@/components/home/sections/HowItWorks"));
const GoogleReviewsSection = dynamic(
  () => import("@/components/home/reviews/GoogleReviewsSection"),
);
const FAQSection = dynamic(() => import("@/components/home/sections/FAQSection"));

export default async function Home() {
  const [hp, products] = await Promise.all([getHomepageConfig(), getFeaturedProducts()]);

  const whatsappLink: string = (hp.kiteHero as { whatsappLink?: string } | undefined)?.whatsappLink || "";

  return (
    // <div>, not <main> — the root layout already provides the single
    // <main id="main-content"> landmark around all page content.
    <div className="min-h-screen">
      <StickyBanner data={hp.stickyBanner} whatsappLink={whatsappLink} />
      <KiteHero heroConfig={hp.kiteHero} />
      <TrustBar data={hp.trustBar} />
      <FeaturedProducts initialProducts={products} />
      <NightLineSection />
      <StorySection data={hp.story} />
      <HowItWorks data={hp.howItWorks} whatsappLink={whatsappLink} />
      <GoogleReviewsSection />
      <FAQSection data={hp.faq} />
    </div>
  );
}
