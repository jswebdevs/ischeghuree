import type { Metadata } from "next";
import ShopClient from "./_ShopClient";

export const metadata: Metadata = {
  title: "Shop the Catalog",
  description:
    "আমাদের হস্তনির্মিত সংগ্রহ ব্রাউজ করুন — browse our eco-friendly jute bags, scrunchies, headbands, and custom pieces from Dhaka.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return <ShopClient />;
}
