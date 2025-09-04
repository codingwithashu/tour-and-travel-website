"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  DestinationFormData,
  createDestinationSchema,
} from "@/modules/destination/schema";
import { DestinationGetOne } from "@/modules/destination/types";
import { uploadToSupabase } from "@/lib/storage/upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePreview } from "@/components/ui/image-preview";
import { FileUpload } from "@/components/ui/upload";
import {
  Calendar,
  FileText,
  Image,
  Info,
  Loader2,
  Star,
  MapPin,
  DollarSign,
  Users,
  Clock,
} from "lucide-react";
import { Rating, RatingButton } from "@/components/ui/rating";

interface DestinationFormProps {
  intialValues?: DestinationGetOne;
  onSubmit: () => void;
  onCancel: () => void;
}

export function DestinationForm({
  intialValues,
  onSubmit,
  onCancel,
}: DestinationFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions()
  );

  const [formData, setFormData] = useState({ imageUrl: "" });

  const createDestination = useMutation(
    trpc.destinations.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.destinations.getAll.queryOptions()
        );
        toast.success("Destination created successfully");
        onSubmit?.();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const updateDestination = useMutation(
    trpc.destinations.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.destinations.getAll.queryOptions()
        );
        if (intialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.destinations.getById.queryOptions({ id: intialValues.id })
          );
        }
        toast.success("Destination updated successfully");
        onSubmit?.();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const form = useForm<DestinationFormData>({
    resolver: zodResolver(createDestinationSchema),
    defaultValues: {
      slug: intialValues?.slug || "",
      name: intialValues?.name || "",
      country: intialValues?.country || "",
      region: intialValues?.region || "",
      image: intialValues?.image || "",
      description: intialValues?.description || "",
      packageCount: intialValues?.packageCount || 0,
      startingPrice: intialValues?.startingPrice || "",
      categoryId: intialValues?.categoryId || undefined,
      rating: intialValues?.rating || "",
      reviewCount: intialValues?.reviewCount || 0,
      bestTime: intialValues?.bestTime || "",
    },
  });

  useEffect(() => {
    if (intialValues?.image) {
      setFormData({ imageUrl: intialValues.image });
    }
  }, [intialValues]);

  useEffect(() => {
    if (!intialValues?.categoryId && categories.length > 0) {
      form.setValue("categoryId", categories[0].id);
    }
  }, [categories, intialValues, form]);

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (!intialValues && name === "name" && value.name) {
        form.setValue("slug", generateSlug(value.name));
      }
    });
    return () => subscription.unsubscribe();
  }, [form, intialValues]);

  const isEdit = !!intialValues?.id;
  const isLoading =
    form.formState.isSubmitting ||
    createDestination.isPending ||
    updateDestination.isPending;

  const handleSubmit = (data: DestinationFormData) => {
    const payload = { ...data, image: formData.imageUrl };

    if (isEdit) {
      updateDestination.mutate({ id: intialValues.id, ...payload });
    } else {
      createDestination.mutate(payload);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    return await uploadToSupabase(files);
  };

  const handleImageUrlsChange = (urls: string[]) => {
    if (urls.length > 0) {
      setFormData({ imageUrl: urls[0] });
      form.setValue("image", urls[0]);
    }
  };

  return (
    <div className="flex h-[75vh] bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex w-full h-full"
        >
          <Tabs
            orientation="vertical"
            defaultValue="image"
            className="w-full flex flex-row h-full"
          >
            <div className="w-64 bg-gray-50 border-r border-gray-200">
              <TabsList className="flex flex-col w-full bg-transparent p-2 h-auto space-y-1">
                <TabsTrigger
                  value="image"
                  className="w-full justify-start gap-3 px-4 py-3 text-left data-[state=active]:bg-gray-200 transition-all rounded-lg"
                >
                  <Image className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Image Upload</span>
                </TabsTrigger>
                <TabsTrigger
                  value="basic"
                  className="w-full justify-start gap-3 px-4 py-3 text-left data-[state=active]:bg-gray-200 transition-all rounded-lg"
                >
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Basic Details</span>
                </TabsTrigger>
                <TabsTrigger
                  value="metrics"
                  className="w-full justify-start gap-3 px-4 py-3 text-left data-[state=active]:bg-gray-200 transition-all rounded-lg"
                >
                  <DollarSign className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Pricing & Metrics</span>
                </TabsTrigger>
                <TabsTrigger
                  value="besttime"
                  className="w-full justify-start gap-3 px-4 py-3 text-left data-[state=active]:bg-gray-200 transition-all rounded-lg"
                >
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Best Time</span>
                </TabsTrigger>
                <TabsTrigger
                  value="description"
                  className="w-full justify-start gap-3 px-4 py-3 text-left data-[state=active]:bg-gray-200 transition-all rounded-lg"
                >
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Description</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 flex flex-col bg-white">
              <div className="flex-1 overflow-y-auto p-2">
                <TabsContent value="image" className="m-0">
                  <div className="max-w-2xl space-y-6">
                    <div className="pb-4 border-b border-gray-100">
                      <h4 className="text-2xl font-bold">Destination Image</h4>
                      <p className="text-gray-500">
                        Upload a high-quality image of this destination.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      {formData.imageUrl ? (
                        <ImagePreview
                          src={formData.imageUrl}
                          alt="Destination image"
                          onRemove={() => {
                            setFormData({ imageUrl: "" });
                            form.setValue("image", "");
                          }}
                        />
                      ) : (
                        <FileUpload
                          onUpload={handleFileUpload}
                          onUrlsChange={handleImageUrlsChange}
                          maxFiles={1}
                          multiple={false}
                          existingUrls={
                            formData.imageUrl ? [formData.imageUrl] : []
                          }
                        />
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="basic" className="m-0">
                  <div className="max-w-4xl space-y-8">
                    <div className="pb-4 border-b border-gray-100">
                      <h4 className="text-2xl font-bold">Basic Information</h4>
                      <p className="text-gray-500">
                        Enter the essential details about this destination.
                      </p>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h5 className="text-lg font-semibold mb-4">
                          Primary Details
                        </h5>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Destination Name *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Santorini, Greece"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>URL Slug *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="santorini-greece"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h5 className="text-lg font-semibold mb-4">
                          Location Details
                        </h5>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Greece" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="region"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Region</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Cyclades Islands"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category *</FormLabel>
                                <Select
                                  onValueChange={(value) =>
                                    field.onChange(parseInt(value))
                                  }
                                  value={field.value?.toString()}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {categories.map((cat) => (
                                      <SelectItem
                                        key={cat.id}
                                        value={cat.id.toString()}
                                      >
                                        {cat.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="metrics" className="m-0">
                  <div className="max-w-4xl space-y-8">
                    <div className="pb-4 border-b border-gray-100">
                      <h4 className="text-2xl font-bold">Pricing & Metrics</h4>
                      <p className="text-gray-500">
                        Set pricing and performance indicators.
                      </p>
                    </div>
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <FormField
                            control={form.control}
                            name="startingPrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Starting Price</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="999"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rating</FormLabel>
                                <FormControl>
                                  <Rating
                                    {...field}
                                    defaultValue={3}
                                    value={
                                      field.value ? Number(field.value) : 0
                                    }
                                    onValueChange={(value) =>
                                      field.onChange(String(value))
                                    }
                                  >
                                    {Array.from({ length: 5 }).map(
                                      (_, index) => (
                                        <RatingButton
                                          className="text-yellow-500"
                                          key={index}
                                        />
                                      )
                                    )}
                                  </Rating>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <FormField
                            control={form.control}
                            name="packageCount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Packages</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="5"
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <FormField
                            control={form.control}
                            name="reviewCount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Reviews</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="250"
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="besttime" className="m-0">
                  <div className="max-w-2xl space-y-6">
                    <div className="pb-4 border-b border-gray-100">
                      <h4 className="text-2xl font-bold">Best Time to Visit</h4>
                      <p className="text-gray-500">
                        Help travelers plan their perfect trip.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <FormField
                        control={form.control}
                        name="bestTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Best Visiting Period</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., April - October"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="description" className="m-0">
                  <div className="max-w-3xl space-y-6">
                    <div className="pb-4 border-b border-gray-100">
                      <h4 className="text-2xl font-bold">
                        Destination Description
                      </h4>
                      <p className="text-gray-500">
                        Tell the story of what makes this destination
                        extraordinary.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination Story</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Paint a vivid picture of this destination..."
                                className="min-h-[250px] resize-none border-gray-150"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isEdit ? "Update Destination" : "Create"}
                  </Button>
                </div>
              </div>
            </div>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
