import { HeroSection } from "@/components/hero-section";
import { FeaturedPackages } from "@/components/featured-packages";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";

export const dymanic = "force-dynamic";

export default async function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.packages.getAll.queryOptions());

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <HeroSection />
          <HydrationBoundary state={dehydrate(queryClient)}>
            <FeaturedPackages />
          </HydrationBoundary>
          <WhyChooseUs />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
