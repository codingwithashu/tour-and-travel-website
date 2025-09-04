// import packagesData from "@/data/packages.json"
// import destinationsData from "@/data/destinations.json"
// import reviewsData from "@/data/reviews.json"
// import type { Package, Destination, Review } from "@/types"

// export const packages: Package[] = packagesData.packages
// export const destinations: Destination[] = destinationsData.destinations
// export const reviews: Review[] = reviewsData.reviews

// // Helper functions for data manipulation
// export const getFeaturedPackages = (): Package[] => {
//   return packages.filter((pkg) => pkg.featured)
// }

// export const getPackagesByCategory = (category: Package["category"]): Package[] => {
//   return packages.filter((pkg) => pkg.category === category)
// }

// export const getPackageById = (id: string): Package | undefined => {
//   return packages.find((pkg) => pkg.id === id)
// }

// export const getReviewsByPackageId = (packageId: string): Review[] => {
//   return reviews.filter((review) => review.packageId === packageId)
// }

// export const searchPackages = (query: string): Package[] => {
//   const lowercaseQuery = query.toLowerCase()
//   return packages.filter(
//     (pkg) =>
//       pkg.title.toLowerCase().includes(lowercaseQuery) ||
//       pkg.destination.toLowerCase().includes(lowercaseQuery) ||
//       pkg.description.toLowerCase().includes(lowercaseQuery),
//   )
// }

// export const filterPackages = (filters: {
//   category?: Package["category"]
//   minPrice?: number
//   maxPrice?: number
//   minRating?: number
// }): Package[] => {
//   return packages.filter((pkg) => {
//     if (filters.category && pkg.category !== filters.category) return false
//     if (filters.minPrice && pkg.price < filters.minPrice) return false
//     if (filters.maxPrice && pkg.price > filters.maxPrice) return false
//     if (filters.minRating && pkg.rating < filters.minRating) return false
//     return true
//   })
// }

// export const sortPackages = (
//   packages: Package[],
//   sortBy: "price-asc" | "price-desc" | "rating" | "popular",
// ): Package[] => {
//   const sorted = [...packages]

//   switch (sortBy) {
//     case "price-asc":
//       return sorted.sort((a, b) => a.price - b.price)
//     case "price-desc":
//       return sorted.sort((a, b) => b.price - a.price)
//     case "rating":
//       return sorted.sort((a, b) => b.rating - a.rating)
//     case "popular":
//       return sorted.sort((a, b) => b.reviewCount - a.reviewCount)
//     default:
//       return sorted
//   }
// }

// export const getAllDestinations = (): Destination[] => {
//   return destinations
// }
