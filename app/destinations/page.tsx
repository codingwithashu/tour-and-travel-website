import { PageTransition } from "@/components/page-transition";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { QuickEnquiryButton } from "@/components/quick-enquiry-button";
import { DestinationsPage } from "@/components/destinations-page";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { Loader } from "@/components/loader";

export const metadata = {
  title: "Popular Destinations | Atharv Travels",
  description:
    "Explore amazing destinations across India and around the world. From Kerala backwaters to Dubai skylines, find your perfect getaway.",
};

export default async function Destinations() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.destinations.getAll.queryOptions());

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<Loader text="Fetching..." />}>
            <DestinationsPage />
          </Suspense>
        </HydrationBoundary>
        <Footer />
        <QuickEnquiryButton />
      </div>
    </PageTransition>
  );
}
