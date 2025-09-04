import React, { Suspense } from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CategoryPage } from "@/components/admin/category/category";
import { Loader } from "@/components/loader";

export default async function GodownPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.categories.getAll.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loader text="Fetching..." />}>
        <CategoryPage />
      </Suspense>
    </HydrationBoundary>
  );
}
