import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";

export default function HomePage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <Footer />
      </div>
    </PageTransition>
  );
}
