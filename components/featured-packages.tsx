"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getFeaturedPackages } from "@/lib/data";
import { formatIndianCurrency } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

export function FeaturedPackages() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: featuredPackages } = useSuspenseQuery(
    trpc.packages.getFeaturedAll.queryOptions()
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-2 text-sm font-medium"
            >
              Featured Destinations
            </Badge>
          </motion.div>
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Handpicked Adventures
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Discover our most popular destinations, carefully curated to provide
            you with extraordinary experiences and unforgettable memories at
            unbeatable prices.
          </motion.p>
        </motion.div>

        {/* Packages Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featuredPackages.map((pkg, index) => (
            <motion.div key={pkg.id} variants={itemVariants}>
              <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-card">
                <CardHeader className="p-0 relative">
                  <motion.div
                    className="relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.img
                      src={pkg.image || "/placeholder.svg"}
                      alt={pkg.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-4 right-4 w-10 h-10 rounded-full p-0 bg-white/90 hover:bg-white"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                      <Badge className="absolute top-4 left-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                        {pkg.category?.name}
                      </Badge>
                    </motion.div>

                    <motion.div
                      className="absolute bottom-4 left-4 text-white"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">
                          {formatIndianCurrency(Number(pkg.price))}
                        </span>
                        {pkg.originalPrice && (
                          <span className="text-sm line-through text-white/70">
                            {formatIndianCurrency(Number(pkg.originalPrice))}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-white/90">per person</span>
                    </motion.div>
                  </motion.div>
                </CardHeader>

                <CardContent className="p-6">
                  <motion.div
                    className="flex items-center gap-2 mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                  >
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {pkg.destination}
                    </span>
                  </motion.div>

                  <motion.h3
                    className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.6 }}
                  >
                    {pkg.title}
                  </motion.h3>

                  <motion.p
                    className="text-muted-foreground mb-4 line-clamp-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.7 }}
                  >
                    {pkg.description}
                  </motion.p>

                  <motion.div
                    className="flex items-center justify-between mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.8 }}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {pkg.duration}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{pkg.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({pkg.reviewCount})
                      </span>
                    </div>
                  </motion.div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <motion.div
                    className="flex gap-3 w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.9 }}
                  >
                    <motion.div
                      className="flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
                      >
                        <Link href={`/packages/package/${pkg.slug}`}>
                          View Details
                        </Link>
                      </Button>
                    </motion.div>
                    <motion.div
                      className="flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        asChild
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        <Link href={`/book/${pkg.id}`}>Book Now</Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className="px-8 py-3 text-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              <Link href="/packages">View All Packages</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
