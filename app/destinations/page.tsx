import { PageTransition } from "@/components/page-transition";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { DestinationsPage } from "@/components/destinations-page";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Destinations() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.destinations.getAll.queryOptions());

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <DestinationsPage />
        </HydrationBoundary>
        <Footer />
      </div>
    </PageTransition>
  );
}
