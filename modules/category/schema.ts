import z from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
})

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.number(),
})


export type CategoryFormData = z.infer<typeof createCategorySchema>;