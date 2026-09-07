"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import {
  loadStripe,
  type StripeElementsOptions,
} from "@stripe/stripe-js";

import api from "@/lib/axios";

/* ============================================================
   STRIPE
============================================================ */

const publishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

const stripePromise = publishableKey
  ? loadStripe(publishableKey)
  : null;

/* ============================================================
   TYPES
============================================================ */

interface Booking {
  id: string;
  servicePrice: string | number;
  status: string;
  address: string;
  bookingDate: string;
  bookingTime: string;

  service?: {
    id: string;
    title: string;
  };
}

interface PaymentInitializationResponse {
  client_secret: string;
  payment_intent_id: string;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

/* ============================================================
   PAYMENT PAGE
============================================================ */

export default function PaymentPage() {
  const params = useParams();

  const bookingId =
    typeof params.id === "string"
      ? params.id
      : "";

  const [booking, setBooking] =
    useState<Booking | null>(null);

  const [clientSecret, setClientSecret] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /**
   * Prevent React Strict Mode / development mode
   * from creating multiple PaymentIntents.
   */
  const initializationStarted =
    useRef(false);

  /* ==========================================================
     INITIALIZE
  ========================================================== */

  const initializePayment =
    useCallback(async () => {
      if (!bookingId) {
        setError("Booking ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        /* ====================================================
           1. CHECK STRIPE KEY
        ==================================================== */

        if (!publishableKey) {
          throw new Error(
            "Stripe publishable key is not configured."
          );
        }

        /* ====================================================
           2. GET BOOKING

           IMPORTANT:
           Your backend intentionally uses:

           app.use("/api", AppRoutes)

           AND

           AppRoutes:
           path: "/api/bookings"

           Therefore:
           /api/api/bookings/:id
        ==================================================== */

        const bookingResponse =
          await api.get<ApiResponse<Booking>>(
            `/api/api/bookings/${bookingId}`
          );

        const bookingData =
          bookingResponse.data?.data;

        if (!bookingData) {
          throw new Error(
            "Booking not found."
          );
        }

        setBooking(bookingData);

        /* ====================================================
           3. BOOKING MUST BE ACCEPTED
        ==================================================== */

        if (
          bookingData.status !== "ACCEPTED"
        ) {
          throw new Error(
            `This booking is not ready for payment. Current status: ${bookingData.status}.`
          );
        }

        /* ====================================================
           4. CREATE / INITIALIZE PAYMENT

           IMPORTANT:
           Your backend endpoint is:

           app.use("/api", AppRoutes)
                 +
           AppRoutes "/api/payments"
                 =
           /api/api/payments
        ==================================================== */

        const paymentResponse =
          await api.post<
            ApiResponse<PaymentInitializationResponse>
          >(
            "/api/api/payments",
            {
              bookingId,
              provider: "STRIPE",
            }
          );

        const paymentData =
          paymentResponse.data?.data;

        if (!paymentData) {
          throw new Error(
            "Payment initialization response is empty."
          );
        }

        const secret =
          paymentData.client_secret;

        if (!secret) {
          throw new Error(
            "Stripe client secret was not returned by the backend."
          );
        }

        setClientSecret(secret);
      } catch (err: any) {
        console.error(
          "================================================"
        );

        console.error(
          "PAYMENT INITIALIZATION ERROR"
        );

        console.error(
          "URL:",
          err?.config?.url
        );

        console.error(
          "METHOD:",
          err?.config?.method
        );

        console.error(
          "STATUS:",
          err?.response?.status
        );

        console.error(
          "BACKEND RESPONSE:",
          err?.response?.data
        );

        console.error(
          "FULL ERROR:",
          err
        );

        console.error(
          "================================================"
        );

        const backendMessage =
          err?.response?.data?.message;

        const backendDetails =
          err?.response?.data?.errorDetails;

        let message =
          backendMessage ||
          err?.message ||
          "Failed to initialize payment.";

        /**
         * If backend gives useful validation details,
         * append them to console only.
         */
        if (backendDetails) {
          console.error(
            "PAYMENT ERROR DETAILS:",
            backendDetails
          );
        }

        setError(message);

        toast.error(message);
      } finally {
        setLoading(false);
      }
    }, [bookingId]);

  /* ==========================================================
     RUN INITIALIZATION
  ========================================================== */

  useEffect(() => {
    if (!bookingId) {
      return;
    }

    /**
     * Very important:
     * React Strict Mode can execute effects twice
     * during development.
     *
     * Without this guard, two PaymentIntents could
     * potentially be created.
     */
    if (initializationStarted.current) {
      return;
    }

    initializationStarted.current = true;

    initializePayment();
  }, [bookingId, initializePayment]);

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <CreditCard className="size-7 animate-pulse text-primary" />
          </div>

          <div>
            <p className="text-sm font-semibold">
              Preparing payment...
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Checking your booking and securely
              connecting to Stripe.
            </p>
          </div>

          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
      </main>
    );
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (
    error ||
    !booking ||
    !clientSecret
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-md rounded-3xl border border-border/60 bg-background p-8 text-center shadow-lg">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <CreditCard className="size-7" />
          </div>

          <h1 className="mt-5 text-xl font-bold">
            Payment Unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {error ||
              "Unable to initialize payment."}
          </p>

          <Link
            href="/dashboard/bookings"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="size-4" />
            Back to Bookings
          </Link>
        </div>
      </main>
    );
  }

  /* ==========================================================
     STRIPE ELEMENTS OPTIONS
  ========================================================== */

  const options: StripeElementsOptions = {
    clientSecret,

    appearance: {
      theme: "stripe",
    },
  };

  /* ==========================================================
     MAIN UI
  ========================================================== */

  return (
    <main className="min-h-screen bg-background">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/dashboard/bookings"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Bookings
          </Link>

          <div className="mt-6 flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CreditCard className="size-6" />
            </div>

            <div>
              <p className="text-sm font-medium text-primary">
                Secure Payment
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight">
                Complete Your Payment
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Securely pay for your accepted
                service booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <section className="py-10 sm:py-14">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          {/* ==================================================
              BOOKING SUMMARY
          ================================================== */}

          <div className="h-fit rounded-3xl border border-border/60 bg-background p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Booking Summary
            </p>

            <h2 className="mt-2 text-xl font-bold">
              {booking.service?.title ||
                "Service"}
            </h2>

            <div className="mt-6 space-y-4">
              {/* Amount */}

              <div className="rounded-2xl bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">
                  Amount
                </p>

                <p className="mt-1 text-2xl font-bold">
                  $
                  {Number(
                    booking.servicePrice
                  ).toFixed(2)}
                </p>
              </div>

              {/* Address */}

              <div className="rounded-2xl bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">
                  Service Address
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {booking.address ||
                    "No address provided"}
                </p>
              </div>

              {/* Status */}

              <div className="rounded-2xl bg-emerald-500/10 p-4">
                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="size-5 shrink-0" />

                  <div>
                    <p className="text-xs font-semibold">
                      Booking Accepted
                    </p>

                    <p className="mt-1 text-xs">
                      Your technician has
                      accepted this booking.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stripe security */}

              <div className="flex items-center gap-3 rounded-2xl border border-border/60 p-4">
                <ShieldCheck className="size-5 shrink-0 text-primary" />

                <p className="text-xs font-medium text-muted-foreground">
                  Your payment information is
                  securely processed by Stripe.
                </p>
              </div>
            </div>
          </div>

          {/* ==================================================
              STRIPE CHECKOUT
          ================================================== */}

          <div className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm sm:p-8">
            <Elements
              stripe={stripePromise}
              options={options}
            >
              <CheckoutForm
                bookingId={bookingId}
              />
            </Elements>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   CHECKOUT FORM
============================================================ */

function CheckoutForm({
  bookingId,
}: {
  bookingId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [submitting, setSubmitting] =
    useState(false);

  /* ==========================================================
     HANDLE PAYMENT
  ========================================================== */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!stripe) {
      toast.error(
        "Stripe has not loaded yet."
      );

      return;
    }

    if (!elements) {
      toast.error(
        "Payment form has not loaded yet."
      );

      return;
    }

    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);

      /* ======================================================
         CONFIRM PAYMENT
      ====================================================== */

      const result =
        await stripe.confirmPayment({
          elements,

          confirmParams: {
            return_url:
              `${window.location.origin}/dashboard/bookings/${bookingId}/payment/success`,
          },

          redirect: "if_required",
        });

      /* ======================================================
         STRIPE ERROR
      ====================================================== */

      if (result.error) {
        console.error(
          "STRIPE PAYMENT ERROR:",
          result.error
        );

        toast.error(
          result.error.message ||
            "Payment failed."
        );

        setSubmitting(false);

        return;
      }

      /* ======================================================
         PAYMENT SUCCESS
      ====================================================== */

      toast.success(
        "Payment submitted successfully."
      );

      /**
       * Stripe webhook is responsible for
       * changing backend state:
       *
       * Payment -> COMPLETED
       * Booking -> PAID
       */

      window.location.href =
        `/dashboard/bookings/${bookingId}/payment/success`;
    } catch (error) {
      console.error(
        "STRIPE CONFIRM ERROR:",
        error
      );

      toast.error(
        "Unable to complete payment."
      );

      setSubmitting(false);
    }
  };

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Header */}

      <div>
        <h2 className="text-xl font-bold">
          Payment Details
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Enter your payment information below.
        </p>
      </div>

      {/* Payment Element */}

      <div className="rounded-2xl border border-border/60 p-4">
        <PaymentElement />
      </div>

      {/* Pay Button */}

      <button
        type="submit"
        disabled={
          !stripe ||
          !elements ||
          submitting
        }
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="size-4" />
            Pay Securely
          </>
        )}
      </button>

      {/* Security */}

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="size-4" />
        Secure payment powered by Stripe
      </div>
    </form>
  );
}