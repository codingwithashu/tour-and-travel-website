"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, MapPin, Mountain, Package2, Plane } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignUpPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await authClient.signUp.email(
        {
          email: values.email,
          password: values.password,
          callbackURL: "/admin/dashboard",
          name: values.name,
        },
        {
          onRequest: () => setIsLoading(true),
          onError: () => setIsLoading(false),
          onSuccess: async () => {
            router.push("/admin/dashboard");
          },
        }
      );
      if (error) {
        console.error("Auth error:", error);
        return;
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden lg:flex lg:w-1/2 text-white bg-green-600 flex-col justify-center items-center p-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-8xl">✈️</div>
          <div className="absolute top-40 right-20 text-6xl">🏔️</div>
          <div className="absolute bottom-32 left-20 text-7xl">🏖️</div>
          <div className="absolute bottom-20 right-10 text-5xl">🗺️</div>
        </div>

        <div className="relative z-10 max-w-md text-center space-y-8">
          {/* Logo */}
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto border border-white/30 shadow-2xl">
              <div className="relative">
                <Plane className="h-10 w-10 text-white transform rotate-45" />
                <MapPin className="absolute -bottom-1 -right-1 h-6 w-6 text-white" />
              </div>
            </div>
            <div
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "hsl(var(--secondary))" }}
            >
              <span className="text-xs text-white">✨</span>
            </div>
          </div>

          {/* Brand Name */}
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-white">Atharv Travels</h1>
            <div className="text-lg font-medium text-white/90 tracking-wide">
              Admin Dashboard
            </div>
          </div>

          {/* Tagline */}
          <div className="space-y-3">
            <p className="text-xl text-white/90 font-light">
              Manage your travel empire with ease
            </p>
            <div className="flex justify-center space-x-6 text-sm text-white/80">
              <div className="flex items-center space-x-1">
                <Mountain className="h-4 w-4" />
                <span>Destinations</span>
              </div>
              <div className="flex items-center space-x-1">
                <Plane className="h-4 w-4" />
                <span>Packages</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Bookings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 right-10 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-40 left-8 w-2 h-2 rounded-full animate-pulse delay-1000"
          style={{ background: "hsl(var(--secondary))/40" }}
        ></div>
        <div className="absolute top-1/3 left-5 w-4 h-4 bg-white/20 rounded-full animate-pulse delay-500"></div>
      </aside>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-semibold">
                Create an account
              </CardTitle>
              <CardDescription>
                Sign up to start managing your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
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
                            placeholder="Enter your email"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password"
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPassword((prev) => !prev)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-11 bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing up..." : "Sign up"}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/admin/sign-in"
                  className="text-green-600 hover:underline font-medium"
                >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
