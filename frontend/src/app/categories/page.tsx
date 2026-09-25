import type { Metadata } from "next";
import { LuLayoutGrid } from "react-icons/lu";
import CollectionTiles from "@/components/home/collections/CollectionTiles";
import { getCategoriesFlat } from "@/lib/getSettings";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Browse Categories",
  description:
    "পাটের ব্যাগ ও হেয়ার অ্যাক্সেসরিজ ক্যাটাগরি অনুযায়ী দেখুন — explore our jute bags and hair accessories organized by category.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const categories = await getCategoriesFlat();

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="bg-gradient-theme border-b border-border py-12 md:py-16">
        <div className="container mx-auto px-4 text-center md:text-left">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-heading mb-4 tracking-tight">
            ক্যাটাগরি — Shop by <span className="text-primary">Collection</span>
          </h1>
          <p className="text-subheading max-w-2xl mx-auto md:mx-0 text-base md:text-lg">
            Explore our wide range of premium products organized just for you.
          </p>
        </div>
      </div>

      {categories.length > 0 ? (
        // The index lists every collection, including ones still being stocked,
        // so onlyWithProducts is off here (the homepage tiles filter them out).
        <CollectionTiles categories={categories} title={null} onlyWithProducts={false} />
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <LuLayoutGrid className="w-10 h-10 text-muted-foreground opacity-50" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No Categories Found</h2>
        </div>
      )}
    </div>
  );
}
