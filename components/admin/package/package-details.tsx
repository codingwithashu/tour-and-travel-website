"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Edit,
  MapPin,
  Tag,
  Calendar,
  Users,
  DollarSign,
  Star,
  IndianRupeeIcon,
} from "lucide-react";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { PackageGalleryManager } from "@/components/admin/package/package-gallery-manager";
import { PackageInclusionsManager } from "@/components/admin/package/package-inclusions-manager";
import { PackageExclusionsManager } from "@/components/admin/package/package-exclusions-manager";
import { PackageHighlightsManager } from "@/components/admin/package/package-highlights-manager";
import { PackageItineraryManager } from "@/components/admin/package/package-itinerary-manager";
import { PackageReviewsManager } from "./package-review-manager";

interface PackagesPageProps {
  packageId: string;
}

export default function PackageDetailScreen({ packageId }: PackagesPageProps) {
  const params = useParams();
  const router = useRouter();
  const trpc = useTRPC();

  const { data: pkg, isLoading } = useSuspenseQuery(
    trpc.packages.getById.queryOptions({ id: Number(packageId) })
  );

  const cards = [
    {
      title: "Price",
      value: `₹ ${pkg.price}`,
      icon: IndianRupeeIcon,
      description: pkg.originalPrice
        ? `Original: ₹ ${pkg.originalPrice}`
        : "Current price",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
      footer: "Package price details",
      change: pkg.originalPrice ? "-10%" : "+0%",
      trend: pkg.originalPrice ? "down" : "up",
    },
    {
      title: "Duration",
      value: pkg.duration,
      icon: Calendar,
      description: "Package duration",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
      footer: "Measured in days",
      change: "+0%",
      trend: "up",
    },
    {
      title: "Rating",
      value: pkg.rating || "N/A",
      icon: Users,
      description: `${pkg.reviewCount || 0} reviews`,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
      footer: "Customer ratings",
      change: "+12.5%",
      trend: "up",
    },
    {
      title: "Status",
      value: pkg.featured ? "Featured" : "Active",
      icon: Star,
      description: pkg.featured ? "Highlighted package" : "Currently listed",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
      footer: "Availability status",
      change: "+0%",
      trend: "up",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/packages">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/packages">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Package not found</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/packages">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-balance">{pkg.title}</h1>
            <p className="text-muted-foreground">
              Package details and management
            </p>
          </div>
        </div>
      </div>

      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          {cards.map((stat, index) => (
            <Card key={index} className="@container/card">
              <CardHeader>
                <CardDescription>{stat.title}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {stat.value}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={
                    stat.trend === "down" ? "text-red-600" : "text-green-600"
                  }
                >
                  <stat.icon className="mr-1 h-4 w-4" />
                  {stat.change}
                </Badge>
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Package Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Destination</h4>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{pkg.destinationName || "No destination"}</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Category</h4>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span>{pkg.categoryName || "No category"}</span>
              </div>
            </div>
          </div>
          {pkg.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-muted-foreground">{pkg.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="gallery" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
          <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
          <TabsTrigger value="highlights">Highlights</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery">
          <PackageGalleryManager packageId={packageId} />
        </TabsContent>

        <TabsContent value="inclusions">
          <PackageInclusionsManager packageId={packageId} />
        </TabsContent>

        <TabsContent value="exclusions">
          <PackageExclusionsManager packageId={packageId} />
        </TabsContent>

        <TabsContent value="highlights">
          <PackageHighlightsManager packageId={packageId} />
        </TabsContent>

        <TabsContent value="itinerary">
          <PackageItineraryManager packageId={packageId} />
        </TabsContent>
        <TabsContent value="review">
          <PackageReviewsManager packageId={packageId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
