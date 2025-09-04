import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { packageItinerary } from "@/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { createPackageItinerarySchema, updatePackageItinerarySchema } from "./schema"



export const packageItineraryRouter = createTRPCRouter({
  getAll: baseProcedure.query(async ({ ctx }) => {
    return await db.select().from(packageItinerary).orderBy(packageItinerary.dayNumber)
  }),

  getByPackageId: baseProcedure.input(z.object({ packageId: z.number() })).query(async ({ ctx, input }) => {
    return await db
      .select()
      .from(packageItinerary)
      .where(eq(packageItinerary.packageId, input.packageId))
      .orderBy(packageItinerary.dayNumber)
  }),

  getById: baseProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const [itinerary] = await db.select().from(packageItinerary).where(eq(packageItinerary.id, input.id))
    return itinerary
  }),

  create: baseProcedure.input(createPackageItinerarySchema).mutation(async ({ ctx, input }) => {
    const [itinerary] = await db.insert(packageItinerary).values(input).returning()
    return itinerary
  }),

  update: baseProcedure.input(updatePackageItinerarySchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input
    const [itinerary] = await db.update(packageItinerary).set(data).where(eq(packageItinerary.id, id)).returning()
    return itinerary
  }),

  delete: baseProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await db.delete(packageItinerary).where(eq(packageItinerary.id, input.id))
    return { success: true }
  }),
})
