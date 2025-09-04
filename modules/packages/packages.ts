import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { packages, destinations, categories, packageGallery, packageExclusions, packageHighlights, packageInclusions, packageItinerary, reviews } from "@/db/schema"
import { asc, eq, or } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"

const createPackageSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  destinationId: z.number(),
  categoryId: z.number(),
  duration: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  originalPrice: z.string().optional(),
  rating: z.string().optional(),
  reviewCount: z.number().default(0),
  image: z.string().optional(),
  featured: z.boolean().default(false),
  description: z.string().optional(),
})

const updatePackageSchema = createPackageSchema.partial().extend({
  id: z.number().int(),
})

export const packagesRouter = createTRPCRouter({
  getById: baseProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const [pkg] = await db
        .select({
          id: packages.id,
          slug: packages.slug,
          title: packages.title,
          description: packages.description,
          price: packages.price,
          originalPrice: packages.originalPrice,
          rating: packages.rating,
          reviewCount: packages.reviewCount,
          image: packages.image,
          featured: packages.featured,
          duration: packages.duration,
          destinationId: destinations.id,
          destinationSlug: destinations.slug,
          destinationName: destinations.name,
          categoryId: categories.id,
          categoryName: categories.name,
          categorySlug: categories.slug,
        })
        .from(packages)
        .leftJoin(destinations, eq(packages.destinationId, destinations.id))
        .leftJoin(categories, eq(packages.categoryId, categories.id))
        .where(eq(packages.id, input.id));

      return pkg;
    }),

  getBySlug: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const [pkg] = await db
        .select({
          id: packages.id,
          slug: packages.slug,
          title: packages.title,
          description: packages.description,
          price: packages.price,
          originalPrice: packages.originalPrice,
          rating: packages.rating,
          reviewCount: packages.reviewCount,
          image: packages.image,
          featured: packages.featured,
          duration: packages.duration,
          destination: destinations.name,
          category: categories.name,
        })
        .from(packages)
        .leftJoin(destinations, eq(packages.destinationId, destinations.id))
        .leftJoin(categories, eq(packages.categoryId, categories.id))
        .where(eq(packages.slug, input.slug));

      if (!pkg) return null;

      const [
        gallery,
        inclusions,
        exclusions,
        highlights,
        itinerary,
        pkgReviews,
      ] = await Promise.all([
        db
          .select()
          .from(packageGallery)
          .where(eq(packageGallery.packageId, pkg.id)),
        db
          .select()
          .from(packageInclusions)
          .where(eq(packageInclusions.packageId, pkg.id)),
        db
          .select()
          .from(packageExclusions)
          .where(eq(packageExclusions.packageId, pkg.id)),
        db
          .select()
          .from(packageHighlights)
          .where(eq(packageHighlights.packageId, pkg.id)),
        db
          .select()
          .from(packageItinerary)
          .where(eq(packageItinerary.packageId, pkg.id))
          .orderBy(asc(packageItinerary.dayNumber)),
        db.select().from(reviews).where(eq(reviews.packageId, pkg.id)),
      ]);

      return {
        ...pkg,
        gallery,
        inclusions,
        exclusions,
        highlights,
        itinerary,
        reviews: pkgReviews,
      };
    }),
  // -------------------------
  // Get Featured Packages
  // -------------------------
  getFeaturedAll: baseProcedure.query(async () => {
    const data = await db
      .select({
        id: packages.id,
        slug: packages.slug,
        title: packages.title,
        description: packages.description,
        price: packages.price,
        originalPrice: packages.originalPrice,
        rating: packages.rating,
        reviewCount: packages.reviewCount,
        image: packages.image,
        featured: packages.featured,
        duration: packages.duration,
        destination: destinations.name,
        categoryId: categories.id,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(packages)
      .leftJoin(destinations, eq(packages.destinationId, destinations.id))
      .leftJoin(categories, eq(packages.categoryId, categories.id))
      .where(eq(packages.featured, true));

    return data.map((pkg) => ({
      ...pkg,
      category: {
        id: pkg.categoryId,
        name: pkg.categoryName,
        slug: pkg.categorySlug,
      },
    }));
  }),

  // -------------------------
  // Get All (with optional filter)
  // -------------------------
  getAll: baseProcedure
    .input(
      z
        .object({
          destinationSlug: z.string().optional(),
          packageSlug: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const conditions = [];

      if (input?.destinationSlug) {
        conditions.push(eq(destinations.slug, input.destinationSlug));
      }

      if (input?.packageSlug) {
        conditions.push(eq(packages.slug, input.packageSlug));
      }

      const whereClause =
        conditions.length > 1
          ? or(...conditions)
          : conditions.length === 1
            ? conditions[0]
            : undefined;

      let query = db
        .select({
          id: packages.id,
          slug: packages.slug,
          title: packages.title,
          description: packages.description,
          price: packages.price,
          originalPrice: packages.originalPrice,
          rating: packages.rating,
          reviewCount: packages.reviewCount,
          image: packages.image,
          featured: packages.featured,
          duration: packages.duration,
          destinationId: destinations.id,
          destinationSlug: destinations.slug,
          destinationName: destinations.name,
          categoryId: categories.id,
          categoryName: categories.name,
          categorySlug: categories.slug,
        })
        .from(packages)
        .leftJoin(destinations, eq(packages.destinationId, destinations.id))
        .leftJoin(categories, eq(packages.categoryId, categories.id))
        .where(whereClause ?? undefined);

      const data = await query;
      return data;
    }),
  create: baseProcedure.input(createPackageSchema).mutation(async ({ ctx, input }) => {
    const [pkg] = await db.insert(packages).values(input).returning()
    return pkg
  }),

  update: baseProcedure.input(updatePackageSchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input
    const [pkg] = await db.update(packages).set(data).where(eq(packages.id, id)).returning()
    return pkg
  }),

  delete: baseProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await db.delete(packages).where(eq(packages.id, input.id))
    return { success: true }
  }),
})
