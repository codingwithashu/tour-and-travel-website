"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Calendar, Users } from "lucide-react";
import { getAllDestinations } from "@/lib/data";
import { formatIndianCurrency } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function DestinationsPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: destinations } = useSuspenseQuery(
    trpc.destinations.getAll.queryOptions()
  );

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover Amazing{" "}
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Destinations
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              From the serene backwaters of Kerala to the bustling streets of
              Dubai, explore handpicked destinations that promise unforgettable
              experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 p-0">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant="secondary"
                        className="bg-white/90 text-gray-900"
                      >
                        {destination.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-gray-600">
                        {destination.name}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {destination.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {destination.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">
                          {destination.rating}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({destination.reviewCount} reviews)
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Starting from</p>
                        <p className="text-lg font-bold text-amber-600">
                          {formatIndianCurrency(
                            Number(destination.startingPrice)
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{destination.bestTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{destination.packageCount} packages</span>
                      </div>
                    </div>

                    <Link href={`/destinations/${destination.slug}/packages`}>
                      <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                        View Packages
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
