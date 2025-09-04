"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Loader2,
  Package,
  DollarSign,
  Settings,
  Activity,
  ImageIcon,
} from "lucide-react";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createPackageSchema,
  PackagesFormData,
} from "@/modules/packages/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PackagesGetOne } from "@/modules/packages/types";
import { uploadToSupabase } from "@/lib/storage/upload";
import { ImagePreview } from "@/components/ui/image-preview";
import { FileUpload } from "@/components/ui/upload";
import { Rating, RatingButton } from "@/components/ui/rating";

interface PackageFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  package: PackagesGetOne;
}

export function PackageForm({
  package: pkg,
  onSubmit,
  onCancel,
}: PackageFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ imageUrl: "" });
  const [isSlugEdited, setIsSlugEdited] = useState(false);

  const createPackage = useMutation(
    trpc.packages.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.packages.getAll.queryOptions()
        );
        toast.success("Package created successfully");
        onSubmit?.();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const updatePackage = useMutation(
    trpc.packages.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.packages.getAll.queryOptions()
        );
        if (pkg?.id) {
          await queryClient.invalidateQueries(
            trpc.packages.getById.queryOptions({ id: Number(pkg.id) })
          );
        }
        toast.success("Package updated successfully");
        onSubmit?.();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const { data: destinations = [] } = useSuspenseQuery(
    trpc.destinations.getAll.queryOptions()
  );
  const { data: categories = [] } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions()
  );

  const form = useForm<PackagesFormData>({
    resolver: zodResolver(createPackageSchema),
    defaultValues: {
      title: pkg?.title ?? "",
      slug: pkg?.slug ?? "",
      description: pkg?.description ?? "",
      price: pkg?.price ?? 0,
      originalPrice: pkg?.originalPrice ?? "0",
      duration: pkg?.duration ?? "0",
      featured: pkg?.featured ?? false,
      destinationId: pkg?.destinationId ?? undefined,
      categoryId: pkg?.categoryId ?? undefined,
      image: pkg?.image ?? "",
    },
  });

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  useEffect(() => {
    if (pkg?.image) {
      setFormData({ imageUrl: pkg.image });
    }
  }, [pkg]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title" && !isSlugEdited) {
        const slug = generateSlug(value.title || "");
        form.setValue("slug", slug, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, isSlugEdited]);

  useEffect(() => {
    if (!pkg?.categoryId && categories.length > 0) {
      form.setValue("categoryId", categories[0].id);
    }
    if (!pkg?.destinationId && destinations.length > 0) {
      form.setValue("destinationId", destinations[0].id);
    }
  }, [categories, destinations, pkg, form]);

  const isEdit = !!pkg?.id;
  const isLoading =
    form.formState.isSubmitting ||
    createPackage.isPending ||
    updatePackage.isPending;

  const handleSubmit = (data: PackagesFormData) => {
    const payload = { ...data, image: formData.imageUrl };

    if (isEdit) {
      updatePackage.mutate({ id: pkg.id, ...payload });
    } else {
      createPackage.mutate(data);
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
    <div className="flex h-[80vh] bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
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
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200">
              <TabsList className="flex flex-col w-full bg-transparent p-2 h-auto space-y-1">
                <TabsTrigger
                  value="image"
                  className="w-full justify-start gap-3 px-4 py-3 text-left data-[state=active]:bg-gray-200 rounded-lg"
                >
                  <ImageIcon className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Image Upload</span>
                </TabsTrigger>
                <TabsTrigger
                  value="basic"
                  className="w-full justify-start gap-3 px-4 py-3 text-left data-[state=active]:bg-gray-200 rounded-lg"
                >
                  <Package className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Basic Details</span>
                </TabsTrigger>
                <TabsTrigger
                  value="pricing"
                  className="w-full justify-start gap-3 px-4 py-3 text-left data-[state=active]:bg-gray-200 rounded-lg"
                >
                  <DollarSign className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Price & Metrics</span>
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="w-full justify-start gap-3 px-4 py-3 text-left data-[state=active]:bg-gray-200 rounded-lg"
                >
                  <Settings className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Settings</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-white">
              <div className="flex-1 overflow-y-auto p-4">
                {/* Image Upload */}
                <TabsContent value="image">
                  <div className="max-w-2xl space-y-6">
                    <h4 className="text-2xl font-bold">Package Image</h4>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      {formData.imageUrl ? (
                        <ImagePreview
                          src={formData.imageUrl}
                          alt="Package image"
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

                {/* Basic Details */}
                <TabsContent value="basic">
                  <div className="max-w-3xl space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Luxury Santorini Escape"
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
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="luxury-santorini-escape"
                              {...field}
                              onChange={(e) => {
                                setIsSlugEdited(true);
                                field.onChange(e);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={5}
                              placeholder="Describe the package..."
                              {...field}
                              className="resize-none border-gray-150"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="destinationId"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Destination</FormLabel>
                            <Select
                              onValueChange={(val) =>
                                field.onChange(Number(val))
                              }
                              value={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select destination" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {destinations.map((d) => (
                                  <SelectItem
                                    key={d.id}
                                    value={d.id.toString()}
                                  >
                                    {d.name}
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
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={(val) =>
                                field.onChange(Number(val))
                              }
                              value={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((c) => (
                                  <SelectItem
                                    key={c.id}
                                    value={c.id.toString()}
                                  >
                                    {c.name}
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
                </TabsContent>

                {/* Pricing */}
                <TabsContent value="pricing" className="m-0">
                  <div className="max-w-4xl space-y-8">
                    <div className="pb-4 border-b border-gray-100">
                      <h4 className="text-2xl font-bold">Price & Metrics</h4>
                      <p className="text-gray-500">
                        Set package pricing and performance metrics.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Row 1 */}
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="999.00"
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
                            name="originalPrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Original Price</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="1299.00"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Duration (days)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="7"
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

                      {/* Row 3 */}
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <FormField
                            control={form.control}
                            name="reviewCount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Review Count</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    {...field}
                                    value={field.value ?? 0}
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

                {/* Settings */}
                <TabsContent value="settings">
                  <div className="max-w-2xl space-y-6">
                    <Controller
                      name="featured"
                      control={form.control}
                      render={({ field }) => (
                        <div className="flex items-center justify-between border p-4 rounded-lg">
                          <FormLabel>Featured</FormLabel>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      )}
                    />
                  </div>
                </TabsContent>
              </div>

              <DialogFooter className="px-6 py-4">
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
                  {isEdit ? "Update Package" : "Create Package"}
                </Button>
              </DialogFooter>
            </div>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
