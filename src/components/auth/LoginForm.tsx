"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/services/auth.service";

import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validations/auth";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const { setAuthenticatedUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (
    data: LoginFormValues,
  ) => {
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });

      const user = response?.data?.user;

      if (!user) {
        throw new Error(
          "Login succeeded but user information was not returned.",
        );
      }

      /*
       * Update AuthContext immediately.
       *
       * AuthContext should also persist/read the JWT
       * from your existing auth service/token utility.
       */
      setAuthenticatedUser(user);

      toast.success(
        response?.message || "Login successful!",
      );

      /*
       * Send every authenticated user to dashboard.
       */
      router.replace("/dashboard");

      router.refresh();
    } catch (error: unknown) {
      console.error("LOGIN ERROR:", error);

      const axiosError = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };

      toast.error(
        axiosError?.response?.data?.message ||
          axiosError?.message ||
          "Login failed. Please check your credentials.",
      );
    }
  };

  return (
    <div className="relative">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-primary/5 blur-3xl" />

      {/* Main Card */}
      <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-background/90 shadow-2xl shadow-black/5 backdrop-blur-xl">
        {/* Top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent" />

        <div className="p-6 sm:p-8 lg:p-9">
          {/* Mini badge */}
          <div className="mb-7 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              Welcome back
            </div>

            <div className="flex size-9 items-center justify-center rounded-full border border-border bg-muted/40">
              <ShieldCheck className="size-4 text-primary" />
            </div>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-3xl font-bold tracking-[-0.045em] sm:text-4xl">
              Let&apos;s get
              <span className="text-primary">
                {" "}
                things{" "}
              </span>
              fixed.
            </h1>

            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
              Sign in to manage your bookings, connect
              with professionals, and keep everything on
              track.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-5"
            noValidate
          >
            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="login-email"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                Email address
              </Label>

              <div className="group relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  aria-invalid={Boolean(errors.email)}
                  className={`h-12 rounded-xl border-border/70 bg-muted/20 pl-10 transition-all placeholder:text-muted-foreground/50 focus:bg-background ${
                    errors.email
                      ? "border-destructive focus-visible:ring-destructive/20"
                      : ""
                  }`}
                />
              </div>

              {errors.email && (
                <p className="text-xs font-medium text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="login-password"
                  className="text-xs font-semibold uppercase tracking-wider"
                >
                  Password
                </Label>

                <button
                  type="button"
                  className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Forgot password?
                </button>
              </div>

              <div className="group relative">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

                <Input
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...register("password")}
                  aria-invalid={Boolean(
                    errors.password,
                  )}
                  className={`h-12 rounded-xl border-border/70 bg-muted/20 pl-10 pr-11 transition-all placeholder:text-muted-foreground/50 focus:bg-background ${
                    errors.password
                      ? "border-destructive focus-visible:ring-destructive/20"
                      : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current,
                    )
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs font-medium text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="group relative mt-2 h-12 w-full overflow-hidden rounded-xl text-sm font-semibold shadow-lg shadow-primary/20"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting
                  ? "Signing you in..."
                  : "Sign in to FixItNow"}

                {!isSubmitting && (
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </span>
            </Button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              New here?
            </span>

            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Register CTA */}
          <Link
            href="/register"
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
          >
            Create your account

            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          {/* Trust note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" />

            Your account is protected by secure
            authentication
          </div>
        </div>
      </div>
    </div>
  );
}