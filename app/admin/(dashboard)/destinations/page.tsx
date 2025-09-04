import React, { Suspense } from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { DestinationPage } from "@/components/admin/destination/destination";
import { Loader } from "@/components/loader";

export default async function DestinationsPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.destinations.getAll.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loader text="Fetching..." />}>
        <DestinationPage />
      </Suspense>
    </HydrationBoundary>
  );
}
