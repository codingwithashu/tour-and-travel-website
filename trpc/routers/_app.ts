import { bookingsRouter } from "@/modules/bookings/bookings";
import { categoriesRouter } from "@/modules/category/categories";
import { destinationsRouter } from "@/modules/destination/destinations";
import { packagesRouter } from "@/modules/packages/packages";
import { createTRPCRouter } from "../init";
import { dashboardRouter } from "@/modules/dashboard/dashboard";
import { packageExclusionsRouter } from "@/modules/exclusions/package-exclusions";
import { packageGalleryRouter } from "@/modules/gallery/package-gallery";
import { packageHighlightsRouter } from "@/modules/highlights/package-highlights";
import { packageInclusionsRouter } from "@/modules/inculsions/package-inclusions";
import { packageItineraryRouter } from "@/modules/itinerary/package-itinerary";
import { reviewsRouter } from "@/modules/reviews/reviews";

export const appRouter = createTRPCRouter({
    packages: packagesRouter,
    categories: categoriesRouter,
    destinations: destinationsRouter,
    bookings: bookingsRouter,
    analytics: dashboardRouter,
    packageExclusions: packageExclusionsRouter,
    packageGallery: packageGalleryRouter,
    packageHighlights: packageHighlightsRouter,
    packageInclusions: packageInclusionsRouter,
    packageItinerary: packageItineraryRouter,
    packageReviews: reviewsRouter,

});
export type AppRouter = typeof appRouter;