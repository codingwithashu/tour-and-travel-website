import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { packageHighlights } from "@/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { createPackageHighlightSchema, updatePackageHighlightSchema } from "./schema"



export const packageHighlightsRouter = createTRPCRouter({
  getAll: baseProcedure.query(async ({ ctx }) => {
    return await db.select().from(packageHighlights).orderBy(packageHighlights.id)
  }),

  getByPackageId: baseProcedure.input(z.object({ packageId: z.number() })).query(async ({ ctx, input }) => {
    return await db.select().from(packageHighlights).where(eq(packageHighlights.packageId, input.packageId))
  }),

  getById: baseProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const [highlight] = await db.select().from(packageHighlights).where(eq(packageHighlights.id, input.id))
    return highlight
  }),

  create: baseProcedure.input(createPackageHighlightSchema).mutation(async ({ ctx, input }) => {
    const [highlight] = await db.insert(packageHighlights).values(input).returning()
    return highlight
  }),

  update: baseProcedure.input(updatePackageHighlightSchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input
    const [highlight] = await db.update(packageHighlights).set(data).where(eq(packageHighlights.id, id)).returning()
    return highlight
  }),

  delete: baseProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await db.delete(packageHighlights).where(eq(packageHighlights.id, input.id))
    return { success: true }
  }),
})
