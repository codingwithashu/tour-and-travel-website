import z from "zod";

export const createPackageExclusionSchema = z.object({
  packageId: z.number(),
  exclusion: z.string().min(1, "Exclusion is required"),
})

export const updatePackageExclusionSchema = createPackageExclusionSchema.partial().extend({
  id: z.number(),
})

export const bulkCreatePackageExclusionSchema = z.object({
  exclusions: z.array(createPackageExclusionSchema),
});

export type PackageExclusionFormData = z.infer<typeof createPackageExclusionSchema>;