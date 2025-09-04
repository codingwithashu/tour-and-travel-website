"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export function PackagesByCategoryChart() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: categoryData } = useSuspenseQuery(
    trpc.analytics.getPackagesByCategory.queryOptions()
  );

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Packages by Category</CardTitle>
        <CardDescription>
          Distribution of packages across different categories
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CategoryDistributionChart() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: categoryData } = useSuspenseQuery(
    trpc.analytics.getPackagesByCategory.queryOptions()
  );

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
        <CardDescription>
          Percentage breakdown of packages by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function RevenueChart() {
  // Mock data for revenue chart
  const revenueData = [
    { month: "Jan", revenue: 12000, bookings: 45 },
    { month: "Feb", revenue: 15000, bookings: 52 },
    { month: "Mar", revenue: 18000, bookings: 61 },
    { month: "Apr", revenue: 22000, bookings: 73 },
    { month: "May", revenue: 25000, bookings: 84 },
    { month: "Jun", revenue: 28000, bookings: 92 },
  ];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
        <CardDescription>Monthly revenue and booking trends</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Bar yAxisId="right" dataKey="bookings" fill="#82ca9d" />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function BookingTrendsChart() {
  // Mock data for booking trends
  const bookingData = [
    { month: "Jan", bookings: 45, cancellations: 5 },
    { month: "Feb", bookings: 52, cancellations: 7 },
    { month: "Mar", bookings: 61, cancellations: 4 },
    { month: "Apr", bookings: 73, cancellations: 8 },
    { month: "May", bookings: 84, cancellations: 6 },
    { month: "Jun", bookings: 92, cancellations: 9 },
  ];

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Booking Trends</CardTitle>
        <CardDescription>Monthly bookings vs cancellations</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={bookingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="bookings"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              dataKey="cancellations"
              stackId="2"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function TopDestinationsChart() {
  // Mock data for top destinations
  const destinationData = [
    { name: "Bali", packages: 15, bookings: 234 },
    { name: "Thailand", packages: 12, bookings: 198 },
    { name: "Japan", packages: 8, bookings: 156 },
    { name: "Maldives", packages: 6, bookings: 134 },
    { name: "Dubai", packages: 10, bookings: 112 },
  ];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Top Destinations</CardTitle>
        <CardDescription>Most popular destinations by bookings</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={destinationData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={80} />
            <Tooltip />
            <Bar dataKey="bookings" fill="#8884d8" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
