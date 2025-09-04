"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Clock,
  MapPin,
  Heart,
  Search,
  Filter,
  SlidersHorizontal,
  Grid3X3,
  List,
  X,
} from "lucide-react";
import Link from "next/link";
import { formatIndianCurrency } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Package } from "@/types";

interface PackagesPageProps {
  slug?: string;
  isPackage?: boolean;
}

export function PackagesScreen({ slug, isPackage = false }: PackagesPageProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: allPackages } = useSuspenseQuery(
    trpc.packages.getAll.queryOptions(
      slug
        ? isPackage
          ? { packageSlug: slug }
          : { destinationSlug: slug }
        : {}
    )
  );

  const { data: categoryList = [] } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions()
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<
    "price-asc" | "price-desc" | "rating" | "popular"
  >("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort packages
  const filteredPackages = useMemo(() => {
    let result = allPackages;

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkg.destinationSlug?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategoryIds.length > 0) {
      result = result.filter(
        (pkg) =>
          pkg.categoryId && selectedCategoryIds.includes(pkg.categoryId ?? 0)
      );
    }

    result = result.filter(
      (pkg) =>
        Number(pkg.price) >= priceRange[0] &&
        Number(pkg.price) <= priceRange[1] &&
        (pkg.rating ? Number(pkg.rating) >= minRating : true)
    );

    // Sorting
    if (sortBy === "price-asc")
      result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === "price-desc")
      result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    if (sortBy === "rating")
      result = [...result].sort(
        (a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0)
      );

    return result;
  }, [
    allPackages,
    searchQuery,
    selectedCategoryIds,
    priceRange,
    minRating,
    sortBy,
  ]);

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    if (checked) {
      setSelectedCategoryIds((prev) => [...prev, categoryId]);
    } else {
      setSelectedCategoryIds((prev) => prev.filter((id) => id !== categoryId));
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategoryIds([]);
    setPriceRange([0, 200000]);
    setMinRating(0);
    setSortBy("popular");
  };

  const activeFiltersCount =
    selectedCategoryIds.length +
    (priceRange[0] > 0 || priceRange[1] < 200000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (searchQuery ? 1 : 0); // ✅ optional: include search query as a filter

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
            Explore Our Packages
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Discover handpicked destinations and experiences crafted for
            unforgettable adventures
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="sticky top-24">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Filters
                    </h3>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-primary hover:text-primary/80"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Search Packages
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search destinations, activities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Categories */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Categories
                    </Label>
                    <div className="space-y-3">
                      {categoryList.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={category.id.toString()}
                            checked={selectedCategoryIds.includes(category.id)}
                            onCheckedChange={(checked) =>
                              handleCategoryChange(
                                category.id,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={category.id.toString()}
                            className="text-sm cursor-pointer"
                          >
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Price Range */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Price Range: {formatIndianCurrency(priceRange[0])} -{" "}
                      {formatIndianCurrency(priceRange[1])}
                    </Label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={200000}
                      min={0}
                      step={5000}
                      className="w-full [&>[role=slider]]:border [&>[role=slider]]:border-gray-300 [&>[role=slider]]:bg-white [&>[role=slider]]:shadow-sm"
                    />
                  </div>

                  <Separator />

                  {/* Rating */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Minimum Rating
                    </Label>
                    <Select
                      value={minRating.toString()}
                      onValueChange={(value) => setMinRating(Number(value))}
                    >
                      <SelectTrigger className="border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg">
                        <SelectValue placeholder="Any rating" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="0">Any rating</SelectItem>
                        <SelectItem value="3">3+ stars</SelectItem>
                        <SelectItem value="4">4+ stars</SelectItem>
                        <SelectItem value="4.5">4.5+ stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 px-1.5 py-0.5 text-xs"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>

                <p className="text-muted-foreground">
                  {filteredPackages.length} packages found
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select
                  value={sortBy}
                  onValueChange={(value: any) => setSortBy(value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategoryIds.length > 0 ||
              searchQuery ||
              priceRange[0] > 0 ||
              priceRange[1] < 200000 ||
              minRating > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Search: {searchQuery}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setSearchQuery("")}
                    />
                  </Badge>
                )}

                {selectedCategoryIds.map((id) => {
                  const category = categoryList.find((c) => c.id === id);
                  if (!category) return null;

                  return (
                    <Badge
                      key={category.id}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {category.name}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => handleCategoryChange(category.id, false)}
                      />
                    </Badge>
                  );
                })}

                {(priceRange[0] > 0 || priceRange[1] < 200000) && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {formatIndianCurrency(priceRange[0])} -{" "}
                    {formatIndianCurrency(priceRange[1])}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setPriceRange([0, 200000])}
                    />
                  </Badge>
                )}
                {minRating > 0 && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {minRating}+ stars
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setMinRating(0)}
                    />
                  </Badge>
                )}
              </div>
            )}

            {/* Packages Grid/List */}
            {filteredPackages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No packages found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-6"
                }
              >
                {filteredPackages.map((pkg) => (
                  <PackageCard key={pkg.id} package={pkg} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PackageCard({
  package: pkg,
  viewMode,
}: {
  package: Package;
  viewMode: "grid" | "list";
}) {
  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-80 relative">
            <img
              src={pkg.image || "/placeholder.svg"}
              alt={pkg.title}
              className="w-full h-64 md:h-full object-cover"
            />
            <Badge className="absolute top-4 left-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
              {pkg.categoryName}
            </Badge>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-4 right-4 w-10 h-10 rounded-full p-0 bg-white/90 hover:bg-white"
            >
              <Heart className="w-4 h-4 text-gray-700" />
            </Button>
          </div>

          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {pkg.destinationName}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {pkg.title}
                </h3>
                <p className="text-muted-foreground mb-4">{pkg.description}</p>
              </div>

              <div className="text-right">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-primary">
                    {formatIndianCurrency(parseInt(pkg.price!))}
                  </span>
                  {pkg.originalPrice && (
                    <span className="text-lg line-through text-muted-foreground">
                      {formatIndianCurrency(parseInt(pkg.originalPrice))}
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  per person
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
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
              </div>

              <div className="flex gap-3">
                <Button asChild variant="outline" className="bg-transparent">
                  <Link href={`/packages/${pkg.slug}`}>View Details</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
                >
                  <Link href={`/book/${pkg.id}`}>Book Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card">
      <CardHeader className="p-0 relative">
        <div className="relative overflow-hidden">
          <img
            src={pkg.image || "/placeholder.svg"}
            alt={pkg.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white"
          >
            <Heart className="w-3.5 h-3.5 text-gray-700" />
          </Button>

          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs">
            {pkg.categoryName}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs text-muted-foreground">
            {pkg.destinationName}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {pkg.title}
        </h3>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
          {pkg.description}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{pkg.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{pkg.rating}</span>
            <span className="text-xs">({pkg.reviewCount})</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold">
            {formatIndianCurrency(parseInt(pkg.price!))}
          </span>
          {pkg.originalPrice && (
            <span className="text-xs line-through text-muted-foreground">
              {formatIndianCurrency(parseInt(pkg.originalPrice))}
            </span>
          )}
          <span className="text-xs text-muted-foreground">/person</span>
        </div>

        <div className="flex gap-2 w-full">
          <Button
            asChild
            size="sm"
            className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground"
          >
            <Link href={`/packages/package/${pkg.slug}`}>View</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="flex-1">
            <Link href={`/book/${pkg.id}`}>Book</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
