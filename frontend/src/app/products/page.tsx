import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "আমাদের সম্পূর্ণ সংগ্রহ দেখুন — browse the full Ische Ghuree collection of handmade jute bags and hair accessories.",
  alternates: { canonical: "/shop" },
};

export default function ProductsIndexPage() {
  redirect("/shop");
}
