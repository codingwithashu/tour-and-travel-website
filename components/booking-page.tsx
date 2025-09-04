"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Clock,
  CreditCard,
  CheckCircle,
  Shield,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { cn, formatIndianCurrency } from "@/lib/utils";
import type { Package, BookingForm } from "@/types";
import { DatePicker } from "./ui/date-picker";
import { useTRPC } from "@/trpc/client";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  BookingsFormData,
  createBookingSchema,
} from "@/modules/bookings/schema";

interface PackageDetailPageProps {
  id: string;
}

export function BookingPage({ id }: PackageDetailPageProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: pkg } = useSuspenseQuery(
    trpc.packages.getById.queryOptions({ id: Number(id) })
  );

  if (!pkg) return <div>Package not found</div>;

  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<BookingsFormData>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      packageId: Number(id),
      fullName: "",
      email: "",
      phone: "",
      departureDate: "",
      returnDate: "",
      travelers: 2,
      roomType: "double",
    },
  });

  const createMutation = useMutation(
    trpc.bookings.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Booking created successfully");
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();

  const steps = [
    { number: 1, title: "Contact Info", description: "Your basic details" },
    {
      number: 2,
      title: "Trip Details",
      description: "Travel dates & preferences",
    },
    { number: 3, title: "Review & Book", description: "Confirm and Book" },
  ];

  const nextStep = () => currentStep < 3 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);
  const isLoading = createMutation.isPending;

  const handleSubmit = (data: BookingsFormData) => {
    console.log(data);

    createMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-secondary py-12">
        <div className="max-w-7xl mx-auto text-center text-primary-foreground px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Complete Your Booking
          </h1>
          <p className="text-lg opacity-90">Just a few quick steps</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Progress */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg border-0 mb-6">
                <CardHeader>
                  <CardTitle>Booking Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {steps.map((step) => (
                      <motion.div
                        key={step.number}
                        className={`flex items-start gap-4 p-3 rounded-lg ${
                          step.number === currentStep
                            ? "bg-primary/10 border border-primary/20"
                            : step.number < currentStep
                            ? "bg-green-50 border border-green-200"
                            : "bg-muted/50"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            step.number === currentStep
                              ? "bg-primary text-primary-foreground"
                              : step.number < currentStep
                              ? "bg-green-500 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step.number < currentStep ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            step.number
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Package Summary */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Package Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <img
                      src={pkg.image || "/placeholder.svg"}
                      alt={pkg.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{pkg.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {pkg.destinationName}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {pkg.duration}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Package Price</span>
                      <span>{formatIndianCurrency(Number(pkg.price))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span>{formatIndianCurrency(2999)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>
                        {formatIndianCurrency(
                          Number(pkg.price) * Number(form.watch("travelers")) +
                            2999
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit, (errors) => {
                      console.log("❌ Validation errors:", errors);
                    })}
                  >
                    {/* Step 1: Contact Info */}
                    {currentStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <h2 className="text-2xl font-bold">
                          Contact Information
                        </h2>

                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
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
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="john@example.com"
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
                              <FormLabel>Phone *</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="9999999999"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    {/* Step 2: Trip Details */}
                    {currentStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <h2 className="text-2xl font-bold">Trip Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Departure Date */}
                          <FormField
                            control={form.control}
                            name="departureDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Departure Date *</FormLabel>
                                <FormControl>
                                  <DatePicker
                                    value={
                                      field.value
                                        ? new Date(field.value)
                                        : undefined
                                    }
                                    onChange={(date) =>
                                      field.onChange(
                                        date ? format(date, "yyyy-MM-dd") : ""
                                      )
                                    }
                                    placeholder="Select departure date"
                                    disabled={(date) => date < new Date()}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Return Date */}
                          <FormField
                            control={form.control}
                            name="returnDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Return Date *</FormLabel>
                                <FormControl>
                                  <DatePicker
                                    value={
                                      field.value
                                        ? new Date(field.value)
                                        : undefined
                                    }
                                    onChange={(date) =>
                                      field.onChange(
                                        date ? format(date, "yyyy-MM-dd") : ""
                                      )
                                    }
                                    placeholder="Select return date"
                                    disabled={(date) =>
                                      date < new Date() ||
                                      (form.getValues("departureDate") &&
                                        date <=
                                          new Date(
                                            form.getValues("departureDate")
                                          ))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="travelers"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Travelers *</FormLabel>
                                <Select
                                  // Convert string -> number before passing to form
                                  onValueChange={(val) =>
                                    field.onChange(Number(val))
                                  }
                                  defaultValue={field.value?.toString()}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                      <SelectItem key={n} value={n.toString()}>
                                        {n} {n === 1 ? "Person" : "People"}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="roomType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Room Type *</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="single">
                                      Single Room
                                    </SelectItem>
                                    <SelectItem value="double">
                                      Double Room
                                    </SelectItem>
                                    <SelectItem value="suite">Suite</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Review & Payment */}
                    {/* Step 3: Review & Book */}
                    {currentStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <h2 className="text-2xl font-bold">Review & Book</h2>

                        <Card className="bg-muted/50">
                          <CardContent className="p-6 space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Name:</span>
                              <span>{form.watch("fullName")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Email:</span>
                              <span>{form.watch("email")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Phone:</span>
                              <span>{form.watch("phone")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Departure:</span>
                              <span>{form.watch("departureDate")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Return:</span>
                              <span>{form.watch("returnDate")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Travelers:</span>
                              <span>{form.watch("travelers")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Room:</span>
                              <span>{form.watch("roomType")}</span>
                            </div>
                          </CardContent>
                        </Card>

                        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <CheckCircle className="w-8 h-8 text-blue-600" />
                          <div>
                            <h4 className="font-semibold text-blue-800">
                              Confirm Your Booking
                            </h4>
                            <p className="text-sm text-blue-700">
                              Please review your details before final
                              confirmation.
                            </p>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-primary to-secondary text-white cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Booking...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5 mr-2" />
                              Confirm Booking (
                              {formatIndianCurrency(
                                Number(pkg.price) *
                                  Number(form.watch("travelers")) +
                                  2999
                              )}
                              )
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                      >
                        Previous
                      </Button>
                      {currentStep < 3 && (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-gradient-to-r from-primary to-secondary text-white"
                        >
                          Next Step
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
