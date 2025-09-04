import type { Metadata } from "next";
import { PageTransition } from "@/components/page-transition";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Terms & Conditions | Atharv Travels",
  description:
    "Terms and Conditions for Atharv Travels - Rules and guidelines for using our services.",
};

export default function TermsConditionsPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-foreground mb-8">
              Terms & Conditions
            </h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-6">
                Last updated: {new Date().toLocaleDateString("en-IN")}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Acceptance of Terms
                </h2>
                <p className="mb-4">
                  By accessing and using Atharv Travels services, you accept and
                  agree to be bound by the terms and provision of this
                  agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Booking and Payment
                </h2>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    All bookings are subject to availability and confirmation
                  </li>
                  <li>
                    Full payment is required at the time of booking unless
                    otherwise specified
                  </li>
                  <li>
                    Prices are subject to change without notice until booking is
                    confirmed
                  </li>
                  <li>
                    Additional charges may apply for special requests or
                    services
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Cancellation Policy
                </h2>
                <ul className="list-disc pl-6 mb-4">
                  <li>Cancellations must be made in writing</li>
                  <li>
                    Cancellation charges apply as per the specific tour package
                    terms
                  </li>
                  <li>No refund for no-shows or unused services</li>
                  <li>
                    Travel insurance is recommended to cover unforeseen
                    circumstances
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Travel Documents
                </h2>
                <p className="mb-4">
                  Travelers are responsible for ensuring they have valid
                  passports, visas, and other required travel documents. Yatra
                  Dreams Travels is not responsible for any issues arising from
                  invalid or missing documentation.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Limitation of Liability
                </h2>
                <p className="mb-4">
                  Atharv Travels acts as an intermediary between travelers and
                  service providers. We are not liable for any loss, damage, or
                  injury arising from services provided by third parties.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Force Majeure</h2>
                <p className="mb-4">
                  Atharv Travels shall not be liable for any failure to perform
                  due to circumstances beyond our control, including but not
                  limited to natural disasters, government actions, or travel
                  restrictions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Contact Information
                </h2>
                <div className="bg-muted p-4 rounded-lg">
                  <p>
                    <strong>Email:</strong> legal@Atharv.in
                  </p>
                  <p>
                    <strong>Phone:</strong> +91 98765 43210
                  </p>
                  <p>
                    <strong>Address:</strong> 123 Travel Street, Mumbai,
                    Maharashtra 400001
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
