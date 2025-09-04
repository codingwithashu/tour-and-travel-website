import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";


export default async function Page() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          csacasalk
          {/* <HeroSection />
          <HydrationBoundary state={dehydrate(queryClient)}>
            <FeaturedPackages />
          </HydrationBoundary>
          <WhyChooseUs /> */}
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
