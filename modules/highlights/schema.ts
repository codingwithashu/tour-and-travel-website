import z from "zod";

export const createPackageHighlightSchema = z.object({
  packageId: z.number(),
  highlight: z.string().min(1, "Highlight is required"),
})

export const updatePackageHighlightSchema = createPackageHighlightSchema.partial().extend({
  id: z.number(),
})


export type DPackageHighlightFormData = z.infer<typeof createPackageHighlightSchema>;