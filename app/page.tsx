import { HeroSection } from "@/components/hero-section";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";

export default function HomePage() {
  // const queryClient = getQueryClient();
  // await queryClient.prefetchQuery(trpc.packages.getAll.queryOptions());

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <HeroSection />
          {/* <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<Loader text="Fetching packages..." />}>
              <FeaturedPackages />
            </Suspense>
          </HydrationBoundary>
          <WhyChooseUs /> */}
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
