import { BadgeCheck, Clock, Leaf, Store, Truck, type LucideIcon } from "lucide-react";

// Trust strip under the hero — the four promises from the Facebook page:
// eco-friendly jute, wholesale + retail, Dhaka delivery, always open.
// Content is driven by homepageConfig.trustBar (seeded in
// backend/prisma/seed.ts, editable via PATCH /settings/homepage/trustBar);
// the hardcoded items below are the fallback when no config exists.

interface TrustBarItem {
  icon?: string;
  title?: string;
  desc?: string;
}

interface TrustBarData {
  items?: TrustBarItem[];
}

// Seeded icon names are react-icons style ("LuLeaf"); accept the bare lucide
// names too. Unknown names fall back to a neutral check badge.
const ICON_MAP: Record<string, LucideIcon> = {
  LuLeaf: Leaf,
  Leaf,
  LuStore: Store,
  Store,
  LuTruck: Truck,
  Truck,
  LuClock: Clock,
  Clock,
};

const DEFAULT_FEATURES = [
  {
    icon: Leaf,
    title: "পরিবেশবান্ধব — Eco-friendly",
    desc: "বাংলার সোনালী আঁশ পাটের তৈরি — Made from natural jute",
  },
  {
    icon: Store,
    title: "পাইকারী ও খুচরা — Wholesale & Retail",
    desc: "ছোট-বড় সব অর্ডার — Orders of every size",
  },
  {
    icon: Truck,
    title: "ঢাকায় ডেলিভারি — Delivery in Dhaka",
    desc: "দ্রুত হোম ডেলিভারি — Fast home delivery",
  },
  {
    icon: Clock,
    title: "সবসময় খোলা — Always Open",
    desc: "কল করুন: 01820-417426 — Call any time",
  },
];

export default function TrustBar({ data }: { data?: TrustBarData | null }) {
  const features = data?.items?.length
    ? data.items.map((item) => ({
        icon: (item.icon && ICON_MAP[item.icon]) || BadgeCheck,
        title: item.title || "",
        desc: item.desc || "",
      }))
    : DEFAULT_FEATURES;

  return (
    <div className="bg-card border-y border-border py-8 md:py-12 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex items-center gap-4 md:gap-5 group cursor-default"
                title={item.title}
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground shadow-sm">
                  <Icon className="w-6 h-6 md:w-7 md:h-7" aria-hidden="true" />
                </div>

                <div>
                  <h3 className="font-bold text-heading text-sm md:text-base group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
