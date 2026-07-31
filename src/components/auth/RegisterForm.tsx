"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ImageUpload from "@/components/shared/ImageUpload";
import { registerUser } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validations/auth";

const roles = [
  {
    value: "CUSTOMER" as const,
    title: "Customer",
    description: "Book trusted professionals for your home.",
    icon: Users,
  },
  {
    value: "TECHNICIAN" as const,
    title: "Technician",
    description: "Offer your skills and grow your business.",
    icon: BriefcaseBusiness,
  },
];

export default function RegisterForm() {
const [showPassword, setShowPassword] = useState(false);
const router = useRouter();
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const {
  register,
  handleSubmit,
  setValue,
  watch,
  formState: { errors, isSubmitting },
} = useForm<RegisterFormValues>({
  defaultValues: {
    name: "",
    email: "",
    phone: "",
    password: "",
    image: "",
    role: "CUSTOMER",
  },
});

  const selectedRole = watch("role");

 async function onSubmit(
  data: RegisterFormValues,
) {
  try {
    const response = await registerUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: data.role,
    });

    toast.success(
      response.message ||
        "Registration successful!",
    );

    router.push("/login");
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
        "Registration failed"
    );
  }
}


  return (
    <div className="relative">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-primary/5 blur-3xl" />

      {/* Main Card */}
      <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-background/90 shadow-2xl shadow-black/5 backdrop-blur-xl">
        {/* Top Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent" />

        <div className="p-6 sm:p-8 lg:p-9">
          {/* Header */}
          <div className="mb-7 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              Create your account
            </div>

            <div className="flex size-9 items-center justify-center rounded-full border border-border bg-muted/40">
              <ShieldCheck className="size-4 text-primary" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-[-0.045em] sm:text-4xl">
              Join
              <span className="text-primary"> FixItNow.</span>
            </h1>

            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
              Create your account and get started with a
              smarter way to manage home services.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-5"
            noValidate
          >
            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="register-name"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                Full name
              </Label>

              <div className="group relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

                <Input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  {...register("name")}
                  aria-invalid={Boolean(errors.name)}
                  className={`h-12 rounded-xl border-border/70 bg-muted/20 pl-10 transition-all placeholder:text-muted-foreground/50 focus:bg-background ${
                    errors.name
                      ? "border-destructive focus-visible:ring-destructive/20"
                      : ""
                  }`}
                />
              </div>

              {errors.name && (
                <p className="text-xs font-medium text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email + Phone */}
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="register-email"
                  className="text-xs font-semibold uppercase tracking-wider"
                >
                  Email
                </Label>

                <div className="group relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

                  <Input
                    id="register-email"
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

              {/* Phone */}
              <div className="space-y-2">
                <Label
                  htmlFor="register-phone"
                  className="text-xs font-semibold uppercase tracking-wider"
                >
                  Phone
                </Label>

                <div className="group relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

                  <Input
                    id="register-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="01XXXXXXXXX"
                    {...register("phone")}
                    aria-invalid={Boolean(errors.phone)}
                    className={`h-12 rounded-xl border-border/70 bg-muted/20 pl-10 transition-all placeholder:text-muted-foreground/50 focus:bg-background ${
                      errors.phone
                        ? "border-destructive focus-visible:ring-destructive/20"
                        : ""
                    }`}
                  />
                </div>

                {errors.phone && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
  <label className="text-sm font-semibold">
    Profile image
  </label>

  <ImageUpload
    value={watch("image")}
    onChange={(url) =>
      setValue("image", url, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
    onRemove={() =>
      setValue("image", "", {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
    disabled={isSubmitting}
  />
</div>

            {/* Role Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider">
                  Account type
                </Label>

                {errors.role && (
                  <span className="text-xs font-medium text-destructive">
                    {errors.role.message}
                  </span>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected =
                    selectedRole === role.value;

                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() =>
                        setValue("role", role.value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                        isSelected
                          ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10"
                          : "border-border/70 bg-muted/10 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/[0.02]"
                      }`}
                    >
                      {/* Selected indicator */}
                      <div
                        className={`absolute right-3 top-3 flex size-5 items-center justify-center rounded-full border transition-all ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background"
                        }`}
                      >
                        {isSelected && (
                          <Check className="size-3" />
                        )}
                      </div>

                      <div
                        className={`mb-3 flex size-10 items-center justify-center rounded-xl transition-colors ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:text-primary"
                        }`}
                      >
                        <Icon className="size-5" />
                      </div>

                      <p className="text-sm font-bold">
                        {role.title}
                      </p>

                      <p className="mt-1 pr-5 text-xs leading-5 text-muted-foreground">
                        {role.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="register-password"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                Password
              </Label>

              <div className="group relative">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

                <Input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  {...register("password")}
                  aria-invalid={Boolean(errors.password)}
                  className={`h-12 rounded-xl border-border/70 bg-muted/20 pl-10 pr-11 transition-all placeholder:text-muted-foreground/50 focus:bg-background ${
                    errors.password
                      ? "border-destructive focus-visible:ring-destructive/20"
                      : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label
                htmlFor="register-confirm-password"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                Confirm password
              </Label>

              <div className="group relative">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

                <Input
                  id="register-confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  {...register("confirmPassword")}
                  aria-invalid={Boolean(
                    errors.confirmPassword,
                  )}
                  className={`h-12 rounded-xl border-border/70 bg-muted/20 pl-10 pr-11 transition-all placeholder:text-muted-foreground/50 focus:bg-background ${
                    errors.confirmPassword
                      ? "border-destructive focus-visible:ring-destructive/20"
                      : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) => !current,
                    )
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-xs font-medium text-destructive">
                  {errors.confirmPassword.message}
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
                  ? "Creating your account..."
                  : "Create FixItNow account"}

                {!isSubmitting && (
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </span>
            </Button>
          </form>

          {/* Login */}
          <div className="mt-7 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>

          {/* Security */}
          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            Your information is securely protected
          </div>
        </div>
      </div>
    </div>
  );
}