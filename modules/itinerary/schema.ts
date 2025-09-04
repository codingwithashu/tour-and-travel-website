import z from "zod";

export const createPackageItinerarySchema = z.object({
  packageId: z.number(),
  dayNumber: z.number(),
  title: z.string(),
  description: z.string(),
})

export const updatePackageItinerarySchema = createPackageItinerarySchema.partial().extend({
  id: z.number(),
})


export type PackageItineraryFormData = z.infer<typeof createPackageItinerarySchema>;