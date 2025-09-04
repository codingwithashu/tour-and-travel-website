import z from "zod";

export const createReviewSchema = z.object({
  userName: z.string().min(1, "User name is required"),
  userAvatar: z.string().optional(),
  rating: z.number().min(1).max(5),
  title: z.string(),
  comment: z.string(),
  verified: z.boolean().default(false),
})

export const updateReviewSchema = createReviewSchema.partial().extend({
  id: z.number(),
})

export const createReviewWithPackageSchema = createReviewSchema.extend({
  packageId: z.number(),
});

export type ReviewFormData = z.infer<typeof createReviewSchema>;