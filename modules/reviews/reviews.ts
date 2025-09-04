import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { reviews, packages } from "@/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { createReviewSchema, createReviewWithPackageSchema, updateReviewSchema } from "./schema"

export const reviewsRouter = createTRPCRouter({
  getAll: baseProcedure.query(async ({ ctx }) => {
    return await db
      .select({
        id: reviews.id,
        packageId: reviews.packageId,
        userName: reviews.userName,
        userAvatar: reviews.userAvatar,
        rating: reviews.rating,
        title: reviews.title,
        comment: reviews.comment,
        date: reviews.date,
        verified: reviews.verified,
        packageTitle: packages.title,
      })
      .from(reviews)
      .leftJoin(packages, eq(reviews.packageId, packages.id))
      .orderBy(reviews.date)
  }),

  getByPackageId: baseProcedure.input(z.object({ packageId: z.number() })).query(async ({ ctx, input }) => {
    return await db.select().from(reviews).where(eq(reviews.packageId, input.packageId)).orderBy(reviews.date)
  }),

  getById: baseProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, input.id))
    return review
  }),

  create: baseProcedure.input(createReviewWithPackageSchema).mutation(async ({ ctx, input }) => {
    const [review] = await db.insert(reviews).values(input).returning()
    return review
  }),

  update: baseProcedure.input(updateReviewSchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input
    const [review] = await db.update(reviews).set(data).where(eq(reviews.id, id)).returning()
    return review
  }),

  delete: baseProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await db.delete(reviews).where(eq(reviews.id, input.id))
    return { success: true }
  }),
})
