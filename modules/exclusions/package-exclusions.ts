import { db } from "@/db"
import { packageExclusions } from "@/db/schema"
import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { bulkCreatePackageExclusionSchema, createPackageExclusionSchema, updatePackageExclusionSchema } from "./schema"


export const packageExclusionsRouter = createTRPCRouter({
  getAll: baseProcedure.query(async ({ ctx }) => {
    return await db.select().from(packageExclusions).orderBy(packageExclusions.id)
  }),

  getByPackageId: baseProcedure.input(z.object({ packageId: z.number() })).query(async ({ ctx, input }) => {
    return await db.select().from(packageExclusions).where(eq(packageExclusions.packageId, input.packageId))
  }),

  getById: baseProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const [exclusion] = await db.select().from(packageExclusions).where(eq(packageExclusions.id, input.id))
    return exclusion
  }),

  create: baseProcedure.input(createPackageExclusionSchema).mutation(async ({ ctx, input }) => {
    const [exclusion] = await db.insert(packageExclusions).values(input).returning()
    return exclusion
  }),

  update: baseProcedure.input(updatePackageExclusionSchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input
    const [exclusion] = await db.update(packageExclusions).set(data).where(eq(packageExclusions.id, id)).returning()
    return exclusion
  }),

  delete: baseProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await db.delete(packageExclusions).where(eq(packageExclusions.id, input.id))
    return { success: true }
  }),
  bulkCreate: baseProcedure
    .input(bulkCreatePackageExclusionSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await db
        .insert(packageExclusions)
        .values(input.exclusions)
        .returning();
      return result;
    }),

})
