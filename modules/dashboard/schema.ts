import z from "zod";

export const createDestinationSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  name: z.string().min(1, "Name is required"),
  country: z.string().optional(),
  region: z.string().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  packageCount: z.number().default(0),
  startingPrice: z.string().optional(),
  categoryId: z.number(),
  rating: z.string().optional(),
  reviewCount: z.number().default(0),
  bestTime: z.string().optional(),
})

export const updateDestinationSchema = createDestinationSchema.partial().extend({
  id: z.number(),
})


export type DestinationFormData = z.infer<typeof createDestinationSchema>;