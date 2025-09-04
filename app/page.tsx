import { HeroSection } from "@/components/hero-section";
import { FeaturedPackages } from "@/components/featured-packages";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { Loader } from "@/components/loader";

export default async function HomePage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.packages.getFeaturedAll.queryOptions());

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <HeroSection />
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<Loader text="Fetching packages..." />}>
              <FeaturedPackages />
            </Suspense>
          </HydrationBoundary>
          <WhyChooseUs />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
