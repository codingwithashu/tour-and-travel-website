import { PackagesScreen } from "@/components/packages-page";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Travel Packages - Atharv Travel",
  description:
    "Discover our curated collection of travel packages to amazing destinations worldwide. Find your perfect adventure with flexible booking options.",
  keywords:
    "travel packages, vacation deals, holiday packages, adventure tours, luxury travel",
};

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
