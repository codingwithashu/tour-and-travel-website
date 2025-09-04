import { PageTransition } from "@/components/page-transition";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { QuickEnquiryButton } from "@/components/quick-enquiry-button";
import { AboutPage } from "@/components/about-page";

export const metadata = {
  title: "About Us | Atharv Travels",
  description:
    "Learn about Atharv Travels - your trusted partner for unforgettable journeys across India and around the world.",
};

export default function About() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <AboutPage />
        <Footer />
        <QuickEnquiryButton />
      </div>
    </PageTransition>
  );
}
