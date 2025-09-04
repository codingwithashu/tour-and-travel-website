"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MapPin, Package, Tag, TrendingUp, BookOpen } from "lucide-react";

export function StatsCards() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: stats } = useSuspenseQuery(
    trpc.analytics.getDashboardStats.queryOptions()
  );

  const cards = [
    {
      title: "Total Destinations",
      value: stats?.destinations || 0,
      icon: MapPin,
      description: "Active destinations",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Total Packages",
      value: stats?.packages || 0,
      icon: Package,
      description: "Available packages",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Total Bookings",
      value: stats?.bookings || 0,
      icon: BookOpen,
      description: "Customer bookings",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
    {
      title: "Categories",
      value: stats?.categories || 0,
      icon: Tag,
      description: "Package categories",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
