"use client";

import {
  PackagesByCategoryChart,
  CategoryDistributionChart,
  RevenueChart,
  BookingTrendsChart,
  TopDestinationsChart,
} from "@/components/admin/dashboard/charts";
import { SectionCards } from "@/components/admin/dashboard/section-cards";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <PackagesByCategoryChart />
        <CategoryDistributionChart />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RevenueChart />
        <BookingTrendsChart />
      </div>

      <div className="grid gap-4">
        <TopDestinationsChart />
      </div>
    </div>
  );
}
