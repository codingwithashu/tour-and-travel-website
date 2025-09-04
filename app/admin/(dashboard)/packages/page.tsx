import React from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { PackagesScreen } from "@/components/admin/package/package";

export const dynamic = "force-dynamic";

export default async function PackagesPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.packages.getAll.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PackagesScreen />
    </HydrationBoundary>
  );
}
