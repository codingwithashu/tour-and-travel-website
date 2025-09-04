"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const bookingSchema = z.object({
  packageId: z.number({ required_error: "Package is required" }),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  returnDate: z.string().min(1, "Return date is required"),
  travelers: z.number().min(1, "Number of travelers is required"),
  roomType: z.string().min(1, "Room type is required"),
  status: z.string().default("pending"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: any;
  onSuccess: () => void;
}

export function BookingForm({
  open,
  onOpenChange,
  booking,
  onSuccess,
}: BookingFormProps) {
  const trpc = useTRPC();
  const { data: packages = [] } = useSuspenseQuery(
    trpc.packages.getAll.queryOptions()
  );

  const createMutation = useMutation(
    trpc.bookings.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Booking created successfully");
        onSuccess();
        onOpenChange(false);
        form.reset();
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const updateMutation = useMutation(
    trpc.bookings.update.mutationOptions({
      onSuccess: async () => {
        toast.success("Booking update successfully");
        onSuccess();
        onOpenChange(false);
        form.reset();
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      packageId: undefined,
      fullName: "",
      email: "",
      phone: "",
      departureDate: "",
      returnDate: "",
      travelers: 1,
      roomType: "",
      status: "pending",
    },
  });

  useEffect(() => {
    if (booking) {
      form.reset({
        packageId: booking.package_id,
        fullName: booking.full_name || "",
        email: booking.email || "",
        phone: booking.phone || "",
        departureDate: booking.departure_date || "",
        returnDate: booking.return_date || "",
        travelers: booking.travelers || 1,
        roomType: booking.room_type || "",
        status: booking.status || "pending",
      });
    } else {
      form.reset();
    }
  }, [booking, form]);

  const onSubmit = async (data: BookingFormData) => {
    if (booking) {
      await updateMutation.mutateAsync({
        id: booking.id,
        ...data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const roomTypes = [
    "Single Room",
    "Double Room",
    "Twin Room",
    "Triple Room",
    "Family Room",
    "Suite",
    "Deluxe Room",
    "Standard Room",
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {booking ? "Edit Booking" : "Add New Booking"}
          </DialogTitle>
          <DialogDescription>
            {booking
              ? "Update the booking information below."
              : "Fill in the details to create a new booking."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="packageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a package" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {packages.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.id.toString()}>
                          {pkg.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
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
                        type="email"
                        placeholder="Enter email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departureDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="travelers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Travelers</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roomTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {booking ? "Update" : "Create"} Booking
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
