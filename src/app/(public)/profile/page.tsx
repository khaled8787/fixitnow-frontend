
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const {
    user,
    isLoading,
    isAuthenticated,
  } = useAuth();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-6 w-32 rounded-full bg-muted" />

            <div className="mt-10 h-64 rounded-[2rem] bg-muted" />

            <div className="mt-6 h-48 rounded-[2rem] bg-muted" />
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-[2rem] border border-border/70 bg-background p-8 text-center shadow-xl">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserCircle className="size-8" />
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight">
            Sign in to view your profile
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Please sign in to access your account information,
            bookings, and profile settings.
          </p>

          <Link href="/login">
            <Button className="mt-7 h-11 w-full rounded-xl">
              Sign in
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const initials = user.name
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to home
          </Link>
        </div>
      </section>

      {/* Profile */}
      <section className="py-10 sm:py-14 lg:py-20">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Hero Card */}
          <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-background shadow-2xl shadow-black/5">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />

            <div className="relative p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                {/* Avatar */}
                <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-primary/20 bg-primary/10 text-2xl font-bold text-primary shadow-lg sm:size-28">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                {/* User Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                      {user.name}
                    </h1>

                    <ShieldCheck className="size-5 text-primary" />
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {user.role === "CUSTOMER"
                      ? "FixItNow Customer"
                      : user.role === "TECHNICIAN"
                        ? "FixItNow Technician"
                        : "FixItNow Administrator"}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
                      {user.role}
                    </span>

                    {user.status && (
                      <span className="rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                        {user.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-6 overflow-hidden rounded-[2rem] border border-border/70 bg-background shadow-xl shadow-black/5">
            <div className="border-b border-border/60 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserCircle className="size-5" />
                </div>

                <div>
                  <h2 className="font-bold tracking-tight">
                    Account information
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Your registered FixItNow account details.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-px bg-border/60 sm:grid-cols-2">
              {/* Email */}
              <div className="bg-background p-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Mail className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email
                    </p>

                    <p className="mt-1 truncate text-sm font-medium">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-background p-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Phone className="size-4" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {user.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-background p-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <MapPin className="size-4" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Location
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      Update from account settings
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Type */}
              <div className="bg-background p-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <CalendarDays className="size-4" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Account type
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Features */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-border/70 bg-background p-6">
              <h3 className="font-semibold">
                Your bookings
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Track upcoming and previous service bookings
                from your account.
              </p>

              <Link
                href="/bookings"
                className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
              >
                View bookings
              </Link>
            </div>

            <div className="rounded-[1.5rem] border border-border/70 bg-background p-6">
              <h3 className="font-semibold">
                Account settings
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Manage your profile information and account
                preferences.
              </p>

              <span className="mt-4 inline-flex text-sm font-semibold text-muted-foreground">
                Coming next
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
