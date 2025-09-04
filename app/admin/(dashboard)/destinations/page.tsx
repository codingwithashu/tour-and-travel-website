import React from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { DestinationPage } from "@/components/admin/destination/destination";

export default async function DestinationsPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.destinations.getAll.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DestinationPage />
    </HydrationBoundary>
  );
}
