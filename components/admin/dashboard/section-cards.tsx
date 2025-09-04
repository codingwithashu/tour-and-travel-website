import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { BookOpen, MapPin, Package, Tag } from "lucide-react";

export function SectionCards() {
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
      footer: "Visitors for the last 6 months",
      change: "+12.5%",
      trend: "up",
    },
    {
      title: "Total Packages",
      value: stats?.packages || 0,
      icon: Package,
      description: "Available packages",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
      footer: "Visitors for the last 6 months",
      change: "+12.5%",
      trend: "up",
    },
    {
      title: "Total Bookings",
      value: stats?.bookings || 0,
      icon: BookOpen,
      description: "Customer bookings",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
      footer: "Visitors for the last 6 months",
      change: "+12.5%",
      trend: "up",
    },
    {
      title: "Categories",
      value: stats?.categories || 0,
      icon: Tag,
      description: "Package categories",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900",
      footer: "Visitors for the last 6 months",
      change: "+12.5%",
      trend: "up",
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((stat, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardDescription>{stat.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stat.value}
            </CardTitle>
            <CardAction>
              <Badge
                variant="outline"
                className={
                  stat.trend === "down" ? "text-red-600" : "text-green-600"
                }
              >
                <stat.icon />
                {stat.change}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {stat.description} <stat.icon className="size-4" />
            </div>
            <div className="text-muted-foreground">{stat.footer}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
