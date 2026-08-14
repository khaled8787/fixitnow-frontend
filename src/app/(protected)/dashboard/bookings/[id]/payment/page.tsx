
"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  User,
  Wrench,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import api from "@/lib/axios";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
}

interface Service {
  id: string;
  title: string;
  price?: string | number;
  category?: {
    id: string;
    name?: string;
    title?: string;
  } | null;
}

interface Technician {
  id: string;
  location?: string | null;
  experience?: number | null;
  user?: Customer | null;
}

interface Booking {
  id: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  servicePrice: string | number;
  bookingDate: string;
  bookingTime: string;
  address: string;
  notes?: string | null;
  status: string;
  customer?: Customer | null;
  technician?: Technician | null;
  service?: Service | null;
  payment?: Payment | null;
}

interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  transactionId: string;
  amount: string | number;
  provider: string;
  status: string;
  paidAt?: string | null;
  createdAt?: string;
}

interface BookingResponse {
  success?: boolean;
  message?: string;
  data?: Booking;
}

interface PaymentResponse {
  success?: boolean;
  message?: string;
  data?: {
    payment: Payment;
    client_secret: string;
  };
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

export default function BookingPaymentPage() {
  const params = useParams<{ id: string }>();
  const bookingId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  return (
    <Elements stripe={stripePromise}>
      <PaymentPage bookingId={bookingId} />
    </Elements>
  );
}

function PaymentPage({ bookingId }: { bookingId?: string }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const loadBooking = useCallback(async () => {
    if (!bookingId) {
      toast.error("Booking ID is missing.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.get<BookingResponse>(
        `/api/bookings/${bookingId}`,
      );

      const data = response.data?.data;

      if (!data) {
        throw new Error("Booking information was not found.");
      }

      setBooking(data);
    } catch (error: any) {
      console.error("LOAD BOOKING ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load booking information.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  const formattedPrice = useMemo(() => {
    if (!booking) {
      return "$0.00";
    }

    const amount = Number(booking.servicePrice);

    if (!Number.isFinite(amount)) {
      return "$0.00";
    }

    return `$${amount.toFixed(2)}`;
  }, [booking]);

  const formatDate = (value?: string) => {
    if (!value) {
      return "Not provided";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const formatTime = (value?: string) => {
    if (!value) {
      return "Not provided";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const handlePayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!booking) {
      toast.error("Booking information is unavailable.");
      return;
    }

    if (!stripe || !elements) {
      toast.error("Payment system is not ready yet.");
      return;
    }

    if (booking.status !== "ACCEPTED") {
      toast.error("This booking is not ready for payment.");
      return;
    }

    if (booking.payment) {
      toast.error("Payment already exists for this booking.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      toast.error("Payment card is not ready.");
      return;
    }

    try {
      setIsPaying(true);

      const response = await api.post<PaymentResponse>("/api/payments", {
        bookingId: booking.id,
        provider: "STRIPE",
      });

      const paymentData = response.data?.data;

      if (!paymentData?.client_secret) {
        throw new Error("Stripe client secret was not returned.");
      }

      const result = await stripe.confirmCardPayment(
        paymentData.client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: booking.customer?.name || undefined,
              email: booking.customer?.email || undefined,
            },
          },
        },
      );

      if (result.error) {
        toast.error(
          result.error.message || "Payment could not be completed.",
        );
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        setPaymentComplete(true);
        toast.success("Payment completed successfully.");
      } else {
        toast.info(
          "Payment was submitted but is still being processed.",
        );
      }
    } catch (error: any) {
      console.error("PAYMENT ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Payment failed. Please try again.",
      );
    } finally {
      setIsPaying(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="size-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading payment details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <XCircle className="size-8" />
          </div>

          <h1 className="mt-5 text-2xl font-bold">
            Booking Not Found
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            We couldn't load the booking information required for
            payment.
          </p>

          <Link
            href="/dashboard/bookings"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="size-4" />
            Back to Bookings
          </Link>
        </div>
      </main>
    );
  }

  if (paymentComplete) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-4 py-12">
          <div className="w-full rounded-3xl border border-emerald-500/20 bg-background p-8 text-center shadow-xl sm:p-12">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-10" />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              Payment Successful
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              Payment Completed
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
              Your payment has been successfully processed through
              Stripe.
            </p>

            <div className="mt-8 rounded-2xl border border-border/60 bg-muted/20 p-5 text-left">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Booking
                </span>

                <span className="font-mono text-sm font-semibold">
                  {booking.id}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Amount
                </span>

                <span className="text-lg font-bold">
                  {formattedPrice}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`/dashboard/bookings/${booking.id}`}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                View Booking
              </Link>

              <Link
                href="/dashboard/bookings"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted"
              >
                My Bookings
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (booking.payment) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-4 py-12">
          <div className="w-full rounded-3xl border border-border/60 bg-background p-8 text-center shadow-xl">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CreditCard className="size-8" />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Payment Already Initiated
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              A payment already exists for this booking.
            </p>

            <Link
              href={`/dashboard/bookings/${booking.id}`}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ArrowLeft className="size-4" />
              Back to Booking
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (booking.status !== "ACCEPTED") {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-4 py-12">
          <div className="w-full rounded-3xl border border-border/60 bg-background p-8 text-center shadow-xl sm:p-10">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <CreditCard className="size-8" />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Payment Not Available
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This booking must be accepted by the technician before
              you can make a payment.
            </p>

            <div className="mt-6 rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Current Status
              </p>

              <p className="mt-2 text-sm font-bold">
                {booking.status.replaceAll("_", " ")}
              </p>
            </div>

            <Link
              href={`/dashboard/bookings/${booking.id}`}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ArrowLeft className="size-4" />
              Back to Booking
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href={`/dashboard/bookings/${booking.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Booking
          </Link>

          <div className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Secure Checkout
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Complete Your Payment
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Securely pay for your accepted home service booking
              using Stripe.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
          <div className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CreditCard className="size-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Payment Information
                  </h2>

                  <p className="text-xs text-muted-foreground">
                    Your payment is securely processed by Stripe.
                  </p>
                </div>
              </div>

              <form onSubmit={handlePayment} className="mt-8">
                <div className="rounded-2xl border border-border bg-background p-4 shadow-sm transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#1f2937",
                          fontFamily:
                            "Inter, ui-sans-serif, system-ui, sans-serif",
                          "::placeholder": {
                            color: "#9ca3af",
                          },
                        },
                        invalid: {
                          color: "#dc2626",
                        },
                      },
                    }}
                  />
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-2xl bg-muted/40 p-4">
                  <LockKeyhole className="mt-0.5 size-4 shrink-0 text-primary" />

                  <p className="text-xs leading-5 text-muted-foreground">
                    Your card information is handled securely by
                    Stripe. FixItNow does not store your card
                    details.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isPaying || !stripe || !elements}
                  className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPaying ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="size-4" />
                      Pay {formattedPrice}
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-background p-4">
                <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />

                <p className="mt-3 text-sm font-semibold">
                  Secure Payment
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Protected by Stripe.
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background p-4">
                <LockKeyhole className="size-5 text-primary" />

                <p className="mt-3 text-sm font-semibold">
                  Encrypted
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Your payment data is protected.
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background p-4">
                <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />

                <p className="mt-3 text-sm font-semibold">
                  Instant Confirmation
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Payment status is confirmed by Stripe.
                </p>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-border/60 bg-background shadow-sm lg:sticky lg:top-24">
            <div className="border-b border-border/60 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Booking Summary
              </p>

              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">
                    {booking.service?.title || "Home Service"}
                  </h2>

                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {booking.id}
                  </p>
                </div>

                <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Accepted
                </span>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 size-4 shrink-0 text-primary" />

                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Customer
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {booking.customer?.name || "Customer"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Wrench className="mt-0.5 size-4 shrink-0 text-primary" />

                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Technician
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {booking.technician?.user?.name ||
                      "Assigned Technician"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />

                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Service Address
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {booking.address}
                  </p>
                </div>
              </div>

              <div className="border-t border-border/60 pt-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">
                    Service Price
                  </span>

                  <span className="text-lg font-bold">
                    {formattedPrice}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="text-xs text-muted-foreground">
                    Payment Provider
                  </span>

                  <span className="text-xs font-semibold">
                    Stripe
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
