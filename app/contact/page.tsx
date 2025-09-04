import { PageTransition } from "@/components/page-transition";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { QuickEnquiryButton } from "@/components/quick-enquiry-button";
import { ContactPage } from "@/components/contact-page";

export const metadata = {
  title: "Contact Us | Atharv Travels",
  description:
    "Get in touch with Atharv Travels. Visit our offices in Mumbai, Delhi, and Bangalore or contact us for your next adventure.",
};

export default function Contact() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <ContactPage />
        <Footer />
        <QuickEnquiryButton />
      </div>
    </PageTransition>
  );
}
