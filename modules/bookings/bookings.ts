import { db } from "@/db"
import { bookings, packages } from "@/db/schema"
import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { bookingStatusSchema, createBookingSchema, updateBookingSchema } from "./schema"
import { Resend } from "resend";
import BookingConfirmationEmail from "@/content/emails/BookingConfirmationEmail"

const resend = new Resend(process.env.RESEND_API_KEY);

export const bookingsRouter = createTRPCRouter({
  getAll: baseProcedure.query(async ({ ctx }) => {
    return await db
      .select({
        id: bookings.id,
        packageId: bookings.packageId,
        fullName: bookings.fullName,
        email: bookings.email,
        phone: bookings.phone,
        departureDate: bookings.departureDate,
        returnDate: bookings.returnDate,
        travelers: bookings.travelers,
        roomType: bookings.roomType,
        status: bookings.status,
        createdAt: bookings.createdAt,
        packageTitle: packages.title,
      })
      .from(bookings)
      .leftJoin(packages, eq(bookings.packageId, packages.id))
      .orderBy(bookings.createdAt)
  }),

  getById: baseProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const [booking] = await db
        .select({
          id: bookings.id,
          packageId: bookings.packageId,
          fullName: bookings.fullName,
          email: bookings.email,
          phone: bookings.phone,
          departureDate: bookings.departureDate,
          returnDate: bookings.returnDate,
          travelers: bookings.travelers,
          roomType: bookings.roomType,
          status: bookings.status,
          createdAt: bookings.createdAt,
          packageTitle: packages.title,
        })
        .from(bookings)
        .leftJoin(packages, eq(bookings.packageId, packages.id))
        .where(eq(bookings.id, input.id));

      return booking;
    }),


  create: baseProcedure.input(createBookingSchema).mutation(async ({ ctx, input }) => {
    const [booking] = await db.insert(bookings).values(input).returning();
    try {
      await resend.emails.send({
        from: "Tours & Travels <bookings@geleza.app>",
        to: booking.email,
        subject: "Your Booking Confirmation",
        react: BookingConfirmationEmail({ booking }),
      });
    } catch (error) {
      console.error("Email send error:", error);
    }
    return booking
  }),

  update: baseProcedure.input(updateBookingSchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input
    const [booking] = await db.update(bookings).set(data).where(eq(bookings.id, id)).returning()
    return booking
  }),

  delete: baseProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await db.delete(bookings).where(eq(bookings.id, input.id))
    return { success: true }
  }),
  updateStatus: baseProcedure
    .input(
      z.object({
        id: z.number(),
        status: bookingStatusSchema,
      })
    )
    .mutation(async ({ input }) => {
      const [booking] = await db
        .update(bookings)
        .set({ status: input.status })
        .where(eq(bookings.id, input.id))
        .returning()
      return booking
    }),
})
