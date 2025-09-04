import React from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { BookingsPage } from "@/components/admin/bookings/booking";

export default async function BookingPage() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.bookings.getAll.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BookingsPage />
    </HydrationBoundary>
  );
}
