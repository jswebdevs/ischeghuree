import dynamic from "next/dynamic";
import KiteHero from "@/components/home/hero/KiteHero";
import TrustBar from "@/components/home/afterhero/TrustBar";
import { getHomepageConfig } from "@/lib/getSettings";

// Catalog-first ordering: the hero and trust bar set the scene, then the
// storefront proper — one rail per collection, a featured product, and the
// collection tiles. The brand narrative (story, process, reviews, FAQ) follows
// underneath, so browsing never waits on it.
//
// Below-the-fold sections are code-split to keep the initial bundle lean. They
// still SSR (the default), just in their own chunks.
const CollectionRails = dynamic(() => import("@/components/home/collections/CollectionRails"));
const FeaturedProductBlock = dynamic(
  () => import("@/components/home/collections/FeaturedProductBlock"),
);
const CollectionTiles = dynamic(() => import("@/components/home/collections/CollectionTiles"));
const StorySection = dynamic(() => import("@/components/home/sections/StorySection"));
const HowItWorks = dynamic(() => import("@/components/home/sections/HowItWorks"));
const GoogleReviewsSection = dynamic(
  () => import("@/components/home/reviews/GoogleReviewsSection"),
);
const FAQSection = dynamic(() => import("@/components/home/sections/FAQSection"));

export default async function Home() {
  const hp = await getHomepageConfig();

  const whatsappLink: string =
    (hp.kiteHero as { whatsappLink?: string } | undefined)?.whatsappLink || "";

  return (
    // <div>, not <main> — the root layout already provides the single
    // <main id="main-content"> landmark around all page content. The
    // announcement bar also lives in the layout now, above the navbar.
    <div className="min-h-screen">
      <KiteHero heroConfig={hp.kiteHero} />
      <TrustBar data={hp.trustBar} />

      <CollectionRails />
      <FeaturedProductBlock />
      <CollectionTiles subtitle="পাটের ব্যাগ ও হেয়ার অ্যাক্সেসরিজ — browse the full range by collection." />

      <StorySection data={hp.story} />
      <HowItWorks data={hp.howItWorks} whatsappLink={whatsappLink} />
      <GoogleReviewsSection />
      <FAQSection data={hp.faq} />
    </div>
  );
}
