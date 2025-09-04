import type { Metadata } from "next";
import { PageTransition } from "@/components/page-transition";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Atharv Travels",
  description:
    "Privacy Policy for Atharv Travels - How we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-foreground mb-8">
              Privacy Policy
            </h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-6">
                Last updated: {new Date().toLocaleDateString("en-IN")}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Information We Collect
                </h2>
                <p className="mb-4">
                  We collect information you provide directly to us, such as
                  when you create an account, make a booking, or contact us for
                  support. This may include:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    Personal information (name, email address, phone number)
                  </li>
                  <li>Travel preferences and booking details</li>
                  <li>
                    Payment information (processed securely through our payment
                    partners)
                  </li>
                  <li>Communication records when you contact us</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  How We Use Your Information
                </h2>
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Process your bookings and provide travel services</li>
                  <li>Send you booking confirmations and travel updates</li>
                  <li>
                    Respond to your inquiries and provide customer support
                  </li>
                  <li>Improve our services and website functionality</li>
                  <li>Send promotional offers (with your consent)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Information Sharing
                </h2>
                <p className="mb-4">
                  We do not sell, trade, or rent your personal information to
                  third parties. We may share your information with:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    Travel service providers (hotels, airlines, tour operators)
                  </li>
                  <li>Payment processors for secure transaction processing</li>
                  <li>Legal authorities when required by law</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                <p className="mb-4">
                  We implement appropriate security measures to protect your
                  personal information against unauthorized access, alteration,
                  disclosure, or destruction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>File a complaint with relevant authorities</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about this Privacy Policy, please
                  contact us at:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p>
                    <strong>Email:</strong> privacy@Atharv.in
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
