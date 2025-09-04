import { HeroSection } from "@/components/hero-section";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";

export default function HomePage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <HeroSection />
        
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
