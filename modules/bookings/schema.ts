import z from "zod";

export const bookingStatusSchema = z.enum([
  "pending",
  "confirmed",
  "cancelled",
  "completed",
]);



export const createBookingSchema = z.object({
  packageId: z.number(),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  returnDate: z.string().min(1, "Return date is required"),
  travelers: z.number().min(1, "Number of travelers is required"),
  roomType: z.string().min(1, "Room type is required"),
  status: bookingStatusSchema.default("pending"),
})

export const updateBookingSchema = createBookingSchema.partial().extend({
  id: z.number(),
})


export type BookingsFormData = z.infer<typeof createBookingSchema>;