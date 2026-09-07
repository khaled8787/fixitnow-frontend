"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  MessageSquareText,
} from "lucide-react";

import api from "@/lib/axios";

import ReviewForm from "@/components/reviews/ReviewForm";

/* ============================================================
   TYPES
============================================================ */

interface Booking {
  id: string;
  status: string;

  servicePrice?: string | number;

  address?: string;

  bookingDate?: string;

  bookingTime?: string;

  service?: {
    id: string;
    title: string;
  };

  payment?: {
    id?: string;
    status?: string;
    provider?: string;
  };
}

/* ============================================================
   API RESPONSE
============================================================ */

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

/* ============================================================
   PAYMENT SUCCESS PAGE
============================================================ */

export default function PaymentSuccessPage() {
  const params = useParams();

  const bookingId =
    typeof params.id === "string"
      ? params.id
      : "";

  /* ==========================================================
     STATE
  ========================================================== */

  const [
    booking,
    setBooking,
  ] = useState<Booking | null>(null);

  const [
    checking,
    setChecking,
  ] = useState(true);

  const [
    paid,
    setPaid,
  ] = useState(false);

  /* ==========================================================
     CHECK PAYMENT
  ========================================================== */

  useEffect(() => {
    if (!bookingId) {
      setChecking(false);
      return;
    }

    let mounted = true;
    let attempts = 0;

    let timeoutId:
      | ReturnType<typeof setTimeout>
      | undefined;

    const checkPayment = async () => {
      try {
        const response =
          await api.get<
            ApiResponse<Booking>
          >(
            `/api/api/bookings/${bookingId}`,
          );

        const bookingData =
          response.data?.data;

        if (!mounted) {
          return;
        }

        if (!bookingData) {
          setChecking(false);
          return;
        }

        /*
         * Keep the complete booking object.
         *
         * ReviewForm only needs booking.id,
         * but keeping the booking here makes the
         * page ready for future booking information.
         */
        setBooking(
          bookingData,
        );

        /*
         * Your backend changes the booking
         * status to PAID after successful payment.
         */
        if (
          bookingData.status ===
          "PAID"
        ) {
          setPaid(true);
          setChecking(false);
          return;
        }

        /*
         * Payment may still be waiting for
         * Stripe webhook confirmation.
         */
        attempts++;

        if (attempts < 10) {
          timeoutId =
            setTimeout(
              checkPayment,
              2000,
            );

          return;
        }

        /*
         * After 10 attempts stop polling.
         */
        setChecking(false);
      } catch (error) {
        console.error(
          "PAYMENT STATUS CHECK ERROR:",
          error,
        );

        if (!mounted) {
          return;
        }

        setChecking(false);
      }
    };

    checkPayment();

    return () => {
      mounted = false;

      if (timeoutId) {
        clearTimeout(
          timeoutId,
        );
      }
    };
  }, [bookingId]);

  /* ==========================================================
     LOADING
  ========================================================== */

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-md rounded-3xl border border-border/60 bg-background p-8 text-center shadow-xl">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Loader2 className="size-8 animate-spin" />
          </div>

          <h1 className="mt-6 text-2xl font-bold">
            Confirming Payment
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Stripe payment was submitted.
            We are waiting for confirmation
            from the payment system.
          </p>

          <p className="mt-5 text-xs text-muted-foreground">
            Please don't close this page.
          </p>
        </div>
      </main>
    );
  }

  /* ==========================================================
     PAYMENT SUCCESS
  ========================================================== */

  if (paid && booking) {
    return (
      <main className="min-h-screen bg-background px-6 py-12">
        <div className="mx-auto w-full max-w-2xl">
          {/* ==================================================
              SUCCESS CARD
          ================================================== */}

          <div className="rounded-3xl border border-border/60 bg-background p-8 text-center shadow-xl sm:p-10">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-8" />
            </div>

            <h1 className="mt-6 text-2xl font-bold sm:text-3xl">
              Payment Successful
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
              Your payment has been confirmed
              successfully and your booking is
              now marked as paid.
            </p>

            {/* =================================================
                BOOKING INFO
            ================================================= */}

            <div className="mt-7 rounded-2xl border border-border/60 bg-muted/20 p-5 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Booking
              </p>

              <div className="mt-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {booking.service?.title ??
                      "Service Booking"}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Booking ID:{" "}
                    {booking.id}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  PAID
                </span>
              </div>
            </div>
          </div>

          {/* ==================================================
              REVIEW SECTION
          ================================================== */}

          <div className="mt-8">
            <div className="mb-4 flex items-center gap-2">
              <MessageSquareText className="size-5 text-primary" />

              <h2 className="text-lg font-bold">
                Share Your Experience
              </h2>
            </div>

            {/*
             * IMPORTANT:
             *
             * This is the exact booking ID that was
             * successfully paid.
             *
             * ReviewForm will:
             *
             * 1. Check whether a review already exists.
             * 2. Show the review form if none exists.
             * 3. Show existing review if already reviewed.
             * 4. Allow Edit/Delete for existing review.
             */}

            <ReviewForm
              bookingId={booking.id}
            />
          </div>

          {/* ==================================================
              BACK TO BOOKINGS
          ================================================== */}

          <div className="mt-6 text-center">
            <Link
              href="/dashboard/bookings"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              View My Bookings

              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ==========================================================
     PAYMENT NOT CONFIRMED
  ========================================================== */

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-3xl border border-border/60 bg-background p-8 text-center shadow-xl">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Loader2 className="size-8" />
        </div>

        <h1 className="mt-6 text-2xl font-bold">
          Payment Processing
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Your payment was submitted, but
          confirmation has not reached the
          booking yet.
        </p>

        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Please check your bookings again
          shortly.
        </p>

        <Link
          href="/dashboard/bookings"
          className="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border px-5 text-sm font-semibold transition-colors hover:bg-muted"
        >
          Back to Bookings

          <ArrowRight className="size-4" />
        </Link>
      </div>
    </main>
  );
}