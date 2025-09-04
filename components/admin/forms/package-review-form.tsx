"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Star } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { createReviewSchema, ReviewFormData } from "@/modules/reviews/schema";

interface ReviewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageId: string;
  review?: any;
  onSuccess: () => void;
}

export function PackageReviewForm({
  open,
  onOpenChange,
  packageId,
  review,
  onSuccess,
}: ReviewFormProps) {
  const [selectedRating, setSelectedRating] = useState(0);

  const trpc = useTRPC();

  const { data: packages = [] } = useSuspenseQuery(
    trpc.packages.getAll.queryOptions()
  );

  const createMutation = useMutation(
    trpc.packageReviews.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Review created successfully");
        onSuccess();
        onOpenChange(false);
        form.reset();
        setSelectedRating(0);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const updateMutation = useMutation(
    trpc.packageReviews.update.mutationOptions({
      onSuccess: async () => {
        toast.success("Review updated successfully");
        onSuccess();
        onOpenChange(false);
        form.reset();
        setSelectedRating(0);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      userName: "",
      userAvatar: "",
      rating: 1,
      title: "",
      comment: "",
      verified: false,
    },
  });

  useEffect(() => {
    if (review) {
      form.reset({
        userName: review.userName || "",
        userAvatar: review.userAvatar || "",
        rating: review.rating || 1,
        title: review.title || "",
        comment: review.comment || "",
        verified: review.verified || false,
      });
      setSelectedRating(review.rating || 0);
    } else {
      form.reset();
      setSelectedRating(0);
    }
  }, [review, form]);

  const onSubmit = async (data: ReviewFormData) => {
    const formData = {
      ...data,
      packageId: parseInt(packageId),
      userAvatar: data.userAvatar || null || "",
      title: data.title,
      comment: data.comment,
    };

    console.log(formData);
    if (review) {
      await updateMutation.mutate({
        id: review.id,
        ...formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    form.setValue("rating", rating);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{review ? "Edit Review" : "Add New Review"}</DialogTitle>
          <DialogDescription>
            {review
              ? "Update the review information below."
              : "Fill in the details to create a new review."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log("❌ Validation errors:", errors);
            })}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter user name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="userAvatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Avatar URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/avatar.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingClick(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= selectedRating
                                ? "text-yellow-500 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({selectedRating} star{selectedRating !== 1 ? "s" : ""})
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter review title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter detailed review comment"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="verified"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Verified Purchase</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Mark as verified customer purchase
                    </p>
                  </div>
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
                {review ? "Update" : "Create"} Review
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
