import { db } from "@/db"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { categories } from "@/db/schema"
import { createCategorySchema, updateCategorySchema } from "./schema"



export const categoriesRouter = createTRPCRouter({
  getAll: baseProcedure.query(async () => {
    return await db.select().from(categories).orderBy(categories.name)
  }),

  getById: baseProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const [category] = await db.select().from(categories).where(eq(categories.id, input.id))
    return category
  }),

  create: baseProcedure.input(createCategorySchema).mutation(async ({ input }) => {
    const [category] = await db.insert(categories).values(input).returning()
    return category
  }),

  update: baseProcedure.input(updateCategorySchema).mutation(async ({ input }) => {
    const { id, ...data } = input
    const [category] = await db.update(categories).set(data).where(eq(categories.id, id)).returning()
    return category
  }),

  delete: baseProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await db.delete(categories).where(eq(categories.id, input.id))
    return { success: true }
  }),
})



