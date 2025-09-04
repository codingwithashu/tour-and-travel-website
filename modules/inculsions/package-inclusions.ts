import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { packageInclusions } from "@/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { bulkCreatePackageInclusionSchema, createPackageInclusionSchema, updatePackageInclusionSchema } from "./schema"


export const packageInclusionsRouter = createTRPCRouter({
  getAll: baseProcedure.query(async ({ ctx }) => {
    return await db.select().from(packageInclusions).orderBy(packageInclusions.id)
  }),

  getByPackageId: baseProcedure.input(z.object({ packageId: z.number() })).query(async ({ ctx, input }) => {
    return await db.select().from(packageInclusions).where(eq(packageInclusions.packageId, input.packageId))
  }),

  getById: baseProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const [inclusion] = await db.select().from(packageInclusions).where(eq(packageInclusions.id, input.id))
    return inclusion
  }),

  create: baseProcedure.input(createPackageInclusionSchema).mutation(async ({ ctx, input }) => {
    const [inclusion] = await db.insert(packageInclusions).values(input).returning()
    return inclusion
  }),

  update: baseProcedure.input(updatePackageInclusionSchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input
    const [inclusion] = await db.update(packageInclusions).set(data).where(eq(packageInclusions.id, id)).returning()
    return inclusion
  }),

  delete: baseProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await db.delete(packageInclusions).where(eq(packageInclusions.id, input.id))
    return { success: true }
  }),
  bulkCreate: baseProcedure
    .input(bulkCreatePackageInclusionSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await db
        .insert(packageInclusions)
        .values(input.inclusions)
        .returning();
      return result;
    }),
})
