import z from "zod";

export const createPackageInclusionSchema = z.object({
  packageId: z.number(),
  inclusion: z.string().min(1, "Inclusion is required"),
})

export const updatePackageInclusionSchema = createPackageInclusionSchema.partial().extend({
  id: z.number(),
})

export const bulkCreatePackageInclusionSchema = z.object({
  inclusions: z.array(createPackageInclusionSchema),
});

export type PackageInclusionFormData = z.infer<typeof createPackageInclusionSchema>;