import React, { Suspense } from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { BookingsPage } from "@/components/admin/bookings/booking";
import { Loader } from "@/components/loader";

export default async function BookingPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.bookings.getAll.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loader text="Fetching..." />}>
        <BookingsPage />
      </Suspense>
    </HydrationBoundary>
  );
}
