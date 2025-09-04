import React from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CategoryPage } from "@/components/admin/category/category";

export default async function GodownPage() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getAll.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryPage />
    </HydrationBoundary>
  );
}
