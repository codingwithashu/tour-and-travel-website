"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Clock,
  MapPin,
  Heart,
  Share2,
  Users,
  Calendar,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  BookOpen,
  Camera,
} from "lucide-react";
import Link from "next/link";
import { getReviewsByPackageId } from "@/lib/data";
import { formatIndianCurrency } from "@/lib/utils";
import type { Package } from "@/types";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { trpc } from "@/trpc/server";
import { useTRPC } from "@/trpc/client";

interface PackageDetailPageProps {
  slug: string;
}

export function PackageDetailPage({ slug }: PackageDetailPageProps) {
  console.log(slug);
  const trpc = useTRPC();
  const { data: pkg } = useSuspenseQuery(
    trpc.packages.getBySlug.queryOptions({ slug: slug })
  );

  if (!pkg) return <div>Package not found</div>;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const reviews = pkg.reviews;
  const gallery = pkg.gallery?.map((g) => g.imageUrl) ?? [
    pkg.image ?? "/placeholder.svg",
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + gallery.length) % gallery.length
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: pkg.title,
          text: pkg.description ?? "",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-[70vh] overflow-hidden">
        <div className="relative w-full h-full">
          <img
            src={gallery[currentImageIndex] || "/placeholder.svg"}
            alt={pkg.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Gallery Navigation */}
          {gallery.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full p-0 bg-white/90 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full p-0 bg-white/90 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </Button>

              {/* Gallery Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {gallery.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="w-10 h-10 rounded-full p-0 bg-white/90 hover:bg-white"
              onClick={() => setIsSaved(!isSaved)}
            >
              <Heart
                className={`w-4 h-4 ${
                  isSaved ? "fill-red-500 text-red-500" : "text-gray-700"
                }`}
              />
            </Button>
            <Button
              size="icon"
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md transition-transform hover:scale-105"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5 text-gray-700" />
            </Button>
          </div>

          {/* Package Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{pkg.destination}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {pkg.title}
              </h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-lg">{pkg.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-medium">{pkg.rating}</span>
                  <span className="text-white/80">
                    ({pkg.reviewCount} reviews)
                  </span>
                </div>
                <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-lg px-4 py-2">
                  {pkg.category}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="flex w-full justify-between rounded-full bg-muted/30 p-1">
                {[
                  { value: "overview", label: "Overview", icon: BookOpen },
                  { value: "itinerary", label: "Itinerary", icon: Calendar },
                  { value: "inclusions", label: "Inclusions", icon: Check },
                  { value: "reviews", label: "Reviews", icon: MessageCircle },
                ].map(({ value, label, icon: Icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="flex items-center gap-2 rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      About This Package
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {pkg.description && (
                      <ul className="list-disc pl-5 space-y-2 text-lg text-muted-foreground leading-relaxed">
                        {pkg.description
                          .split("\n")
                          .map((line, idx) =>
                            line.trim() ? <li key={idx}>{line}</li> : null
                          )}
                      </ul>
                    )}

                    {pkg.highlights && pkg.highlights.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">
                          Highlights
                        </h3>
                        <ul className="space-y-2">
                          {pkg.highlights.map((h) => (
                            <li key={h.id} className="flex items-start gap-3">
                              <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">
                                {h.highlight}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Gallery Thumbnails */}
                    {gallery.length > 1 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <Camera className="w-5 h-5" />
                          Photo Gallery
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {gallery.map((image, index) => (
                            <button
                              key={index}
                              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                index === currentImageIndex
                                  ? "border-primary"
                                  : "border-transparent"
                              }`}
                              onClick={() => setCurrentImageIndex(index)}
                            >
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="itinerary" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Day-by-Day Itinerary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pkg.itinerary && pkg.itinerary.length > 0 ? (
                      <div className="space-y-6">
                        {pkg.itinerary.map((day) => (
                          <div key={day.id} className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                              {day.dayNumber}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold mb-2">
                                {day.title}
                              </h4>
                              {day.description && (
                                <div className="space-y-3">
                                  {day.description
                                    .split("\n")
                                    .map((line, idx) =>
                                      line.trim() ? (
                                        <div
                                          key={idx}
                                          className="flex items-start gap-3"
                                        >
                                          {/* You can swap Check for any Lucide/Tabler icon */}
                                          <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                          <span className="text-lg text-muted-foreground leading-relaxed">
                                            {line}
                                          </span>
                                        </div>
                                      ) : null
                                    )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        Detailed itinerary will be provided upon booking.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inclusions" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600 flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        What's Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {pkg.inclusions.map((inc, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{inc.inclusion}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-600 flex items-center gap-2">
                        <X className="w-5 h-5" />
                        What's Not Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {pkg.exclusions.map((exclusion, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">
                              {exclusion.exclusion}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Customer Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="border-b border-border pb-6 last:border-b-0"
                          >
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage
                                  src={review.userAvatar || "/placeholder.svg"}
                                />
                                <AvatarFallback>
                                  {review.userName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold">
                                    {review.userName}
                                  </h4>
                                  {review.verified && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      Verified
                                    </Badge>
                                  )}
                                  <span className="text-sm text-muted-foreground">
                                    {review.date}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 mb-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <h5 className="font-medium mb-2">
                                  {review.title}
                                </h5>
                                <p className="text-muted-foreground">
                                  {review.comment}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No reviews yet. Be the first to review this package!
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-0 shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary">
                      {formatIndianCurrency(Number(pkg.price))}
                    </span>
                    {pkg.originalPrice && (
                      <span className="text-lg line-through text-muted-foreground">
                        {formatIndianCurrency(Number(pkg.originalPrice))}
                      </span>
                    )}
                  </div>
                  <span className="text-muted-foreground">per person</span>
                  {pkg.originalPrice && (
                    <Badge variant="secondary" className="w-fit mt-2">
                      Save{" "}
                      {formatIndianCurrency(
                        Number(pkg.originalPrice) - Number(pkg.price)
                      )}
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>2-8 people</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Flexible dates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{pkg.rating} rating</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button
                      asChild
                      size="lg"
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
                    >
                      <Link href={`/book/${pkg.id}`}>Book Now</Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full bg-transparent"
                    >
                      <Link href={`/enquiry?package=${pkg.id}`}>
                        Send Enquiry
                      </Link>
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => setIsSaved(!isSaved)}
                      >
                        <Heart
                          className={`w-4 h-4 mr-2 ${
                            isSaved ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                        {isSaved ? "Saved" : "Save"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={handleShare}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-center text-sm text-muted-foreground">
                    <p>Free cancellation up to 24 hours before departure</p>
                    <p className="mt-1">Instant confirmation</p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card className="mt-6 border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our travel experts are here to help you plan the perfect
                    trip.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat with Expert
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
