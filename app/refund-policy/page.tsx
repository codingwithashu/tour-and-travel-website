import type { Metadata } from "next";
import { PageTransition } from "@/components/page-transition";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Refund Policy | Atharv Travels",
  description:
    "Refund Policy for Atharv Travels - Information about cancellations and refunds.",
};

export default function RefundPolicyPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-foreground mb-8">
              Refund Policy
            </h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-6">
                Last updated: {new Date().toLocaleDateString("en-IN")}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Cancellation Timeline
                </h2>
                <div className="bg-muted p-6 rounded-lg mb-4">
                  <h3 className="text-lg font-semibold mb-3">
                    Domestic Packages
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>45+ days before travel:</strong> 10% cancellation
                      charges
                    </li>
                    <li>
                      <strong>30-44 days before travel:</strong> 25%
                      cancellation charges
                    </li>
                    <li>
                      <strong>15-29 days before travel:</strong> 50%
                      cancellation charges
                    </li>
                    <li>
                      <strong>7-14 days before travel:</strong> 75% cancellation
                      charges
                    </li>
                    <li>
                      <strong>Less than 7 days:</strong> 100% cancellation
                      charges (No refund)
                    </li>
                  </ul>
                </div>

                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">
                    International Packages
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>60+ days before travel:</strong> 15% cancellation
                      charges
                    </li>
                    <li>
                      <strong>45-59 days before travel:</strong> 30%
                      cancellation charges
                    </li>
                    <li>
                      <strong>30-44 days before travel:</strong> 50%
                      cancellation charges
                    </li>
                    <li>
                      <strong>15-29 days before travel:</strong> 75%
                      cancellation charges
                    </li>
                    <li>
                      <strong>Less than 15 days:</strong> 100% cancellation
                      charges (No refund)
                    </li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    Refunds will be processed within 7-10 working days after
                    cancellation
                  </li>
                  <li>
                    Refunds will be credited to the original payment method
                  </li>
                  <li>
                    Bank processing charges may apply and will be deducted from
                    the refund amount
                  </li>
                  <li>
                    Cancellation requests must be submitted in writing via email
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Non-Refundable Items
                </h2>
                <ul className="list-disc pl-6 mb-4">
                  <li>Visa fees and processing charges</li>
                  <li>Travel insurance premiums</li>
                  <li>Flight tickets (subject to airline policies)</li>
                  <li>Special event tickets or reservations</li>
                  <li>Third-party service charges</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Emergency Cancellations
                </h2>
                <p className="mb-4">
                  In case of medical emergencies or other unforeseen
                  circumstances, cancellation charges may be waived subject to
                  proper documentation and management approval.
                </p>
                <p className="mb-4">
                  <strong>Required Documents:</strong>
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Medical certificate from registered practitioner</li>
                  <li>Death certificate (in case of family emergency)</li>
                  <li>
                    Official government notifications (for travel restrictions)
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Modification Policy
                </h2>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    Date changes are subject to availability and additional
                    charges
                  </li>
                  <li>Name changes may incur airline and hotel penalties</li>
                  <li>
                    Package modifications are treated as cancellation and
                    rebooking
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Contact for Cancellations
                </h2>
                <div className="bg-muted p-4 rounded-lg">
                  <p>
                    <strong>Email:</strong> cancellations@Atharv.in
                  </p>
                  <p>
                    <strong>Phone:</strong> +91 98765 43210
                  </p>
                  <p>
                    <strong>WhatsApp:</strong> +91 98765 43210
                  </p>
                  <p>
                    <strong>Office Hours:</strong> Monday to Saturday, 9:00 AM
                    to 7:00 PM IST
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
