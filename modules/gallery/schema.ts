import z from "zod";

export const createPackageGallerySchema = z.object({
  packageId: z.number(),
  imageUrl: z.string().min(1, "Image URL is required"),
})

export const updatePackageGallerySchema = createPackageGallerySchema.partial().extend({
  id: z.number(),
})


export type PackageGalleryFormData = z.infer<typeof createPackageGallerySchema>;