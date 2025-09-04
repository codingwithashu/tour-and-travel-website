import { EnquiryPage } from "@/components/enquiry-page";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Send Enquiry - Atharv Travel",
  description:
    "Send us an enquiry about your travel plans. Our experts will help you create the perfect itinerary.",
};

export default function EnquiryPageRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <EnquiryPage />
      </main>
      <Footer />
    </div>
  );
}
