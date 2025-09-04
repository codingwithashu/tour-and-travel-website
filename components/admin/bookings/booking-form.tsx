"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { toast } from "sonner";
import { BookingsGetOne } from "@/modules/bookings/types";
import {
  BookingsFormData,
  createBookingSchema,
} from "@/modules/bookings/schema";

interface BookingsFormProps {
  intialValues?: BookingsGetOne;
  onSubmit: () => void;
  onCancel: () => void;
}

export function BookingsForm({
  intialValues,
  onSubmit,
  onCancel,
}: BookingsFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createBooking = useMutation(
    trpc.bookings.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.bookings.getAll.queryOptions()
        );
        onSubmit?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const updateBooking = useMutation(
    trpc.bookings.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.bookings.getAll.queryOptions()
        );
        if (intialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.bookings.getById.queryOptions({ id: intialValues.id })
          );
        }
        onSubmit?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const form = useForm<BookingsFormData>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      fullName: intialValues?.fullName || "",
      email: intialValues?.email || "",
      phone: intialValues?.phone || "",
      packageId: intialValues?.packageId || 0,
      departureDate: intialValues?.departureDate || "",
      returnDate: intialValues?.returnDate || "",
      travelers: intialValues?.travelers || 1,
      roomType: intialValues?.roomType || "",
      status: intialValues?.status || "pending",
    },
    values: {
      fullName: intialValues?.fullName || "",
      email: intialValues?.email || "",
      phone: intialValues?.phone || "",
      packageId: intialValues?.packageId || 0,
      departureDate: intialValues?.departureDate || "",
      returnDate: intialValues?.returnDate || "",
      travelers: intialValues?.travelers || 1,
      roomType: intialValues?.roomType || "",
      status: intialValues?.status || "pending",
    },
  });

  const isEdit = !!intialValues?.id;
  const isLoading =
    form.formState.isSubmitting ||
    createBooking.isPending ||
    updateBooking.isPending;

  const handleSubmit = (data: BookingsFormData) => {
    if (isEdit) {
      updateBooking.mutate({ ...data, id: intialValues.id });
    } else {
      createBooking.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter customer name"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter email"
                    type="email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter phone number"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departure Date</FormLabel>
                <FormControl>
                  <Input type="date" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="returnDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Return Date</FormLabel>
                <FormControl>
                  <Input type="date" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="travelers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Travelers</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roomType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Type</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Deluxe, Suite"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Input
                    placeholder="pending / confirmed / cancelled"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : isEdit
              ? "Update Booking"
              : "Create Booking"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
