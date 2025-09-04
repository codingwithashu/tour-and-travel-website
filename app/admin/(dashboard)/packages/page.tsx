import React, { Suspense } from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { PackagesScreen } from "@/components/admin/package/package";
import { Loader } from "@/components/loader";

export const dynamic = "force-dynamic";

export default async function PackagesPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.packages.getAll.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loader text="Fetching..." />}>
        <PackagesScreen />
      </Suspense>
    </HydrationBoundary>
  );
}
