import type { Metadata } from "next";
import OrderForm from "./_OrderForm";
import OrderHero, { type OrderHeroData } from "./_OrderHero";
import { getHomepageConfig, getGlobalSettings } from "@/lib/getSettings";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Order Now",
  description:
    "কাস্টম অর্ডার দিন — পাটের ব্যাগ ও হেয়ার অ্যাক্সেসরিজ, খুচরা বা পাইকারী। Place a custom order for jute bags & hair accessories — retail or wholesale, pick up or home delivery.",
  alternates: { canonical: "/order-now" },
};

export default async function OrderNowPage() {
  const [hp, settings] = await Promise.all([getHomepageConfig(), getGlobalSettings()]);
  const heroConfig = ((hp as { orderHero?: Partial<OrderHeroData> } | null)?.orderHero || {}) as Partial<OrderHeroData>;

  const hero: OrderHeroData = {
    title: heroConfig.title || null,
    subtitle: heroConfig.subtitle || null,
    personName: heroConfig.personName || null,
    phone: heroConfig.phone || settings?.supportPhone || settings?.contactPhone || null,
    email: heroConfig.email || settings?.supportEmail || settings?.contactEmail || null,
    instructions: heroConfig.instructions || null,
    badgeText: heroConfig.badgeText || null,
    imageUrl:
      heroConfig.imageUrl ||
      settings?.logo?.originalUrl ||
      settings?.logo?.thumbUrl ||
      null,
    bottomImageUrl: heroConfig.bottomImageUrl || null,
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background p-3 md:p-6">
      <div className="max-w-[880px] mx-auto rounded-3xl border border-border overflow-hidden bg-card shadow-theme-lg">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <OrderHero hero={hero} />
          <div className="bg-card flex items-stretch border-t md:border-t-0 md:border-l border-border">
            <div className="w-full">
              <OrderForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
