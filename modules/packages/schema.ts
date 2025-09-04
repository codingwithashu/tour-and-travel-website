import z from "zod";

export const createPackageSchema = z.object({
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

export const updatePackageSchema = createPackageSchema.partial().extend({
  id: z.number().int(),
})


export type PackagesFormData = z.infer<typeof createPackageSchema>;