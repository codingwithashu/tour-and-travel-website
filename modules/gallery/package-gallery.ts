import { db } from "@/db"
import { packageGallery } from "@/db/schema"
import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { createPackageGallerySchema, updatePackageGallerySchema } from "./schema"



export const packageGalleryRouter = createTRPCRouter({
  getAll: baseProcedure.query(async ({ ctx }) => {
    return await db.select().from(packageGallery).orderBy(packageGallery.id)
  }),

  getByPackageId: baseProcedure.input(z.object({ packageId: z.number() })).query(async ({ ctx, input }) => {
    return await db.select().from(packageGallery).where(eq(packageGallery.packageId, input.packageId))
  }),

  getById: baseProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const [gallery] = await db.select().from(packageGallery).where(eq(packageGallery.id, input.id))
    return gallery
  }),

  create: baseProcedure.input(createPackageGallerySchema).mutation(async ({ ctx, input }) => {
    const [gallery] = await db.insert(packageGallery).values(input).returning()
    return gallery
  }),

  update: baseProcedure.input(updatePackageGallerySchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input
    const [gallery] = await db.update(packageGallery).set(data).where(eq(packageGallery.id, id)).returning()
    return gallery
  }),

  delete: baseProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await db.delete(packageGallery).where(eq(packageGallery.id, input.id))
    return { success: true }
  }),
})
