import { db } from "@/db"
import { destinations, categories, packages } from "@/db/schema"
import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { createDestinationSchema, updateDestinationSchema } from "./schema"

export const destinationsRouter = createTRPCRouter({
  getAll: baseProcedure.query(async () => {
    const data = await db
      .select({
        id: destinations.id,
        name: destinations.name,
        country: destinations.country,
        region: destinations.region,
        image: destinations.image,
        description: destinations.description,
        packageCount: destinations.packageCount,
        startingPrice: destinations.startingPrice,
        rating: destinations.rating,
        slug: destinations.slug,
        reviewCount: destinations.reviewCount,
        bestTime: destinations.bestTime,
        category: categories.name,
        categorySlug: categories.slug,
        categoryId: categories.id,
      })
      .from(destinations)
      .leftJoin(categories, eq(destinations.categoryId, categories.id));

    return data;
  }),

  getById: baseProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const [destination] = await db
        .select({
          id: destinations.id,
          slug: destinations.slug,
          name: destinations.name,
          country: destinations.country,
          region: destinations.region,
          image: destinations.image,
          description: destinations.description,
          packageCount: destinations.packageCount,
          startingPrice: destinations.startingPrice,
          rating: destinations.rating,
          reviewCount: destinations.reviewCount,
          bestTime: destinations.bestTime,
          category: categories.name,
          categoryId: categories.id,
          categorySlug: categories.slug,
        })
        .from(destinations)
        .leftJoin(categories, eq(destinations.categoryId, categories.id))
        .where(eq(destinations.id, input.id));

      if (!destination) return null;

      // const relatedPackages = await db
      //   .select({
      //     id: packages.id,
      //     title: packages.title,
      //     image: packages.image,
      //     price: packages.price,
      //     duration: packages.duration,
      //     featured: packages.featured,
      //     rating: packages.rating,
      //   })
      //   .from(packages)
      //   .where(eq(packages.destinationId, input.id));

      // return {
      //   ...destination,
      //   packages: relatedPackages,
      // };
      return destination;

    }),

  create: baseProcedure.input(createDestinationSchema).mutation(async ({ ctx, input }) => {
    const [destination] = await db.insert(destinations).values(input).returning()
    return destination
  }),

  update: baseProcedure.input(updateDestinationSchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input
    const [destination] = await db.update(destinations).set(data).where(eq(destinations.id, id)).returning()
    return destination
  }),

  delete: baseProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await db.delete(destinations).where(eq(destinations.id, input.id))
    return { success: true }
  }),
})
