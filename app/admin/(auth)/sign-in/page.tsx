"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, MapPin, Mountain, Package2, Plane } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { toastUtils } from "@/components/toastUtils";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isPending = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/admin/dashboard",
        rememberMe: false,
      });

      if (error) {
        if (error.message?.includes("User not found")) {
          toast.error("No account found for this email. Please sign up first.");
        } else {
          toastUtils.error("Authentication", error.message);
        }
      }
    } catch (err) {
      toast.error("Unexpected error occurred");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Branding */}
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

      {/* Login Form */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Branding */}
          <div className="lg:hidden text-center">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto">
              <Plane className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-green-600">
              Atharv Travels
            </h1>
            <p className="text-muted-foreground">
              Admin Dashboard for Varanasi Tours
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-semibold">
                Welcome back
              </CardTitle>
              <CardDescription>
                Sign in to continue managing your inventory
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="h-11 pr-10"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() => setShowPassword((prev) => !prev)}
                              tabIndex={-1}
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

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="border-gray-300 rounded"
                      />
                      <Label
                        htmlFor="remember"
                        className="text-muted-foreground"
                      >
                        Remember me
                      </Label>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-green-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-11 bg-green-600 hover:bg-green-700"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </form>
              </Form>

              {/* Footer */}
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/admin/sign-up"
                  className="text-green-600 hover:underline font-medium"
                >
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
