import { PackagesScreen } from "@/components/packages-page";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function PackagesPage() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.packages.getAll.queryOptions());

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PackagesScreen />
        </HydrationBoundary>
      </main>
      <Footer />
    </div>
  );
}
