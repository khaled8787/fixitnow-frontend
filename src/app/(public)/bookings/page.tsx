
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  PackageOpen,
  RefreshCw,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function BookingsPage() {
  const {
    user,
    isLoading: authLoading,
    isAuthenticated,
  } = useAuth();

  if (authLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-6 w-32 rounded-full bg-muted" />
            <div className="mt-10 h-12 w-72 rounded-xl bg-muted" />
            <div className="mt-8 h-56 rounded-[2rem] bg-muted" />
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
            <PackageOpen className="size-8" />
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight">
            Sign in to view your bookings
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Your upcoming and previous FixItNow bookings
            will appear here.
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

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to home
          </Link>
        </div>
      </section>

      {/* Main */}
      <section className="py-10 sm:py-14 lg:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Page heading */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
                <CalendarDays className="size-3.5" />
                {user.name}&apos;s account
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                My bookings
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Manage your service appointments, track booking
                status, and stay updated with your technicians.
              </p>
            </div>

            <Link href="/services">
              <Button className="h-11 rounded-xl px-5">
                <Wrench className="mr-2 size-4" />
                Book a service
              </Button>
            </Link>
          </div>

          {/* Status filters */}
          <div className="mt-8 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              All bookings
            </button>

            <button
              type="button"
              className="rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
            >
              Pending
            </button>

            <button
              type="button"
              className="rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
            >
              Confirmed
            </button>

            <button
              type="button"
              className="rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
            >
              Completed
            </button>
          </div>

          {/* Empty state for now */}
          <div className="mt-8 overflow-hidden rounded-[2rem] border border-border/70 bg-background shadow-xl shadow-black/5">
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center sm:py-20">
              <div className="relative">
                <div className="flex size-20 items-center justify-center rounded-3xl border border-primary/15 bg-primary/5 text-primary">
                  <PackageOpen className="size-9" />
                </div>

                <div className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full border border-background bg-primary text-primary-foreground shadow-lg">
                  <Clock3 className="size-4" />
                </div>
              </div>

              <h2 className="mt-7 text-xl font-bold tracking-tight sm:text-2xl">
                No bookings yet
              </h2>

              <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                Once you book a service, your appointment,
                technician, schedule, and booking status will
                appear here.
              </p>

              <Link href="/services">
                <Button className="mt-7 h-11 rounded-xl px-6">
                  Explore services
                </Button>
              </Link>
            </div>
          </div>

          {/* Upcoming booking preview */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-background p-5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarDays className="size-5" />
              </div>

              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Upcoming
              </p>

              <p className="mt-1 text-2xl font-bold">
                0
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background p-5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock3 className="size-5" />
              </div>

              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pending
              </p>

              <p className="mt-1 text-2xl font-bold">
                0
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background p-5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="size-5" />
              </div>

              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Completed
              </p>

              <p className="mt-1 text-2xl font-bold">
                0
              </p>
            </div>
          </div>

          {/* Refresh placeholder */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <RefreshCw className="size-3.5" />
              Refresh bookings
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
