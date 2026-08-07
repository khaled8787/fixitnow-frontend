
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
  Wrench,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";

type BookingStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "DECLINED"
  | "PAID"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
}

interface Category {
  id: string;
  name: string;
  description?: string | null;
}

interface Service {
  id: string;
  title: string;
  description?: string | null;
  price?: string | number;
  duration?: number;
  category?: Category | null;
}

interface Technician {
  id: string;
  userId?: string;
  bio?: string | null;
  experience?: number | null;
  hourlyRate?: string | number | null;
  location?: string | null;
  averageRating?: number | null;
  totalReviews?: number | null;
  isAvailable?: boolean;
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
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  customer?: Customer | null;
  technician?: Technician | null;
  service?: Service | null;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

export default function BookingDetailsPage() {
  const params = useParams();

  const bookingId = useMemo(() => {
    const value = params?.id;

    if (Array.isArray(value)) {
      return value[0];
    }

    return value;
  }, [params]);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [action, setAction] = useState<
    "ACCEPT" | "DECLINE" | null
  >(null);

  const loadBooking = useCallback(async () => {
    if (!bookingId) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.get<ApiResponse<Booking>>(
        `/api/api/bookings/${bookingId}`,
      );

      const data = response.data?.data;

      if (!data) {
        toast.error("Booking details were not found.");
        setBooking(null);
        return;
      }

      setBooking(data);
    } catch (error: any) {
      console.error("LOAD BOOKING DETAILS ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load booking details.",
      );

      setBooking(null);
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  const handleBookingAction = async () => {
    if (!booking || !action) {
      return;
    }

    try {
      setIsUpdating(true);

      const status =
        action === "ACCEPT" ? "ACCEPTED" : "DECLINED";

      await api.patch(
        `/api/api/bookings/${booking.id}/status`,
        {
          status,
        },
      );

      toast.success(
        action === "ACCEPT"
          ? "Booking accepted successfully."
          : "Booking declined successfully.",
      );

      setAction(null);

      await loadBooking();
    } catch (error: any) {
      console.error(
        "UPDATE BOOKING STATUS ERROR:",
        error,
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to update booking status.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Loader2 className="size-7 animate-spin" />
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Loading booking details...
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Please wait while we fetch the booking.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4 py-12">
          <div className="w-full rounded-3xl border border-border/60 bg-background p-8 text-center shadow-sm">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertCircle className="size-8" />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Booking Not Found
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              We could not find this booking or you may not
              have permission to view it.
            </p>

            <Link
              href="/dashboard/bookings"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ArrowLeft className="size-4" />
              Back to Bookings
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const price = Number(booking.servicePrice);

  const canRespond =
    booking.status === "REQUESTED";

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/dashboard/bookings"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Bookings
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CalendarDays className="size-6" />
              </div>

              <div>
                <p className="text-sm font-medium text-primary">
                  Technician Dashboard
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                  Booking Details
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Review the customer request and manage
                  this booking.
                </p>
              </div>
            </div>

            <StatusBadge status={booking.status} />
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            {/* Left */}
            <div className="space-y-6">
              {/* Service */}
              <section className="overflow-hidden rounded-3xl border border-border/60 bg-background shadow-sm">
                <div className="border-b border-border/60 bg-muted/20 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        Requested Service
                      </p>

                      <h2 className="mt-2 text-2xl font-bold tracking-tight">
                        {booking.service?.title ||
                          "Service Booking"}
                      </h2>
                    </div>

                    <div className="hidden size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:flex">
                      <Wrench className="size-6" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {booking.service?.description && (
                    <p className="text-sm leading-7 text-muted-foreground">
                      {booking.service.description}
                    </p>
                  )}

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <DetailItem
                      icon={
                        <CalendarDays className="size-5" />
                      }
                      label="Booking Date"
                      value={formatDate(
                        booking.bookingDate,
                      )}
                    />

                    <DetailItem
                      icon={
                        <Clock3 className="size-5" />
                      }
                      label="Booking Time"
                      value={formatTime(
                        booking.bookingTime,
                      )}
                    />

                    <DetailItem
                      icon={
                        <MapPin className="size-5" />
                      }
                      label="Service Address"
                      value={booking.address}
                    />

                    <DetailItem
                      icon={
                        <CheckCircle2 className="size-5" />
                      }
                      label="Service Price"
                      value={
                        Number.isFinite(price)
                          ? `$${price.toFixed(2)}`
                          : "$0.00"
                      }
                    />
                  </div>

                  {booking.service?.category?.name && (
                    <div className="mt-5 flex items-center justify-between rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
                      <span className="text-sm text-muted-foreground">
                        Category
                      </span>

                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {booking.service.category.name}
                      </span>
                    </div>
                  )}
                </div>
              </section>

              {/* Customer */}
              <section className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <User className="size-5" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">
                      Customer Information
                    </h2>

                    <p className="text-xs text-muted-foreground">
                      Customer who requested this service
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-muted text-primary">
                    {booking.customer?.image ? (
                      <img
                        src={booking.customer.image}
                        alt={
                          booking.customer.name ||
                          "Customer"
                        }
                        className="size-full object-cover"
                      />
                    ) : (
                      <User className="size-8" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xl font-bold">
                      {booking.customer?.name ||
                        "Customer"}
                    </h3>

                    <div className="mt-3 flex flex-col gap-2">
                      {booking.customer?.email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="size-4 text-primary" />
                          <span className="break-all">
                            {booking.customer.email}
                          </span>
                        </div>
                      )}

                      {booking.customer?.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="size-4 text-primary" />
                          <span>
                            {booking.customer.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Notes */}
              {booking.notes && (
                <section className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Customer Notes
                  </p>

                  <div className="mt-4 rounded-2xl border border-border/60 bg-muted/20 p-5">
                    <p className="text-sm leading-7 text-muted-foreground">
                      {booking.notes}
                    </p>
                  </div>
                </section>
              )}
            </div>

            {/* Right */}
            <div className="space-y-6">
              {/* Status */}
              <section className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Booking Status
                </p>

                <div className="mt-4">
                  <StatusBadge status={booking.status} />
                </div>

                <div className="mt-5 rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-sm font-semibold">
                    {getStatusTitle(
                      booking.status,
                    )}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {getStatusDescription(
                      booking.status,
                    )}
                  </p>
                </div>
              </section>

              {/* Actions */}
              {canRespond && (
                <section className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Booking Actions
                  </p>

                  <h2 className="mt-2 text-lg font-bold">
                    Respond to Request
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Choose whether you want to accept or
                    decline this customer request.
                  </p>

                  <div className="mt-5 grid gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setAction("ACCEPT")
                      }
                      disabled={isUpdating}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <CheckCircle2 className="size-5" />
                      Accept Booking
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setAction("DECLINE")
                      }
                      disabled={isUpdating}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <XCircle className="size-5" />
                      Decline Booking
                    </button>
                  </div>
                </section>
              )}

              {/* Booking Info */}
              <section className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Booking Information
                </p>

                <div className="mt-5 space-y-4">
                  <InfoRow
                    label="Booking ID"
                    value={booking.id}
                  />

                  <InfoRow
                    label="Created"
                    value={formatDateTime(
                      booking.createdAt,
                    )}
                  />

                  <InfoRow
                    label="Last Updated"
                    value={formatDateTime(
                      booking.updatedAt,
                    )}
                  />
                </div>
              </section>

              {/* Service Link */}
              {booking.service?.id && (
                <Link
                  href={`/services/${booking.service.id}`}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background text-sm font-semibold transition-colors hover:bg-muted"
                >
                  <Wrench className="size-4" />
                  View Service
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      {action && (
        <BookingConfirmationModal
          booking={booking}
          action={action}
          isLoading={isUpdating}
          onClose={() => {
            if (!isUpdating) {
              setAction(null);
            }
          }}
          onConfirm={handleBookingAction}
        />
      )}
    </main>
  );
}

/* ============================================================
   Detail Item
============================================================ */

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
      <div className="flex items-center gap-2 text-primary">
        {icon}

        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>

      <p className="mt-3 break-words text-sm font-bold">
        {value || "Not provided"}
      </p>
    </div>
  );
}

/* ============================================================
   Info Row
============================================================ */

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/50 pb-4 last:border-b-0 last:pb-0">
      <span className="text-xs font-medium text-muted-foreground">
        {label}
      </span>

      <span className="max-w-[65%] break-all text-right text-xs font-semibold">
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   Status Badge
============================================================ */

function StatusBadge({
  status,
}: {
  status: BookingStatus;
}) {
  const config: Record<
    BookingStatus,
    {
      label: string;
      className: string;
    }
  > = {
    REQUESTED: {
      label: "Requested",
      className:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    ACCEPTED: {
      label: "Accepted",
      className:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    DECLINED: {
      label: "Declined",
      className:
        "bg-destructive/10 text-destructive",
    },
    PAID: {
      label: "Paid",
      className:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    IN_PROGRESS: {
      label: "In Progress",
      className:
        "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    COMPLETED: {
      label: "Completed",
      className:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    CANCELLED: {
      label: "Cancelled",
      className:
        "bg-muted text-muted-foreground",
    },
  };

  const current = config[status];

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-bold ${current.className}`}
    >
      {current.label}
    </span>
  );
}

/* ============================================================
   Confirmation Modal
============================================================ */

function BookingConfirmationModal({
  booking,
  action,
  isLoading,
  onClose,
  onConfirm,
}: {
  booking: Booking;
  action: "ACCEPT" | "DECLINE";
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const isAccept = action === "ACCEPT";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isLoading
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-confirmation-title"
        className="w-full max-w-md overflow-hidden rounded-3xl border border-border/60 bg-background shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border/60 p-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${
                isAccept
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {isAccept ? (
                <CheckCircle2 className="size-6" />
              ) : (
                <XCircle className="size-6" />
              )}
            </div>

            <div>
              <h2
                id="booking-confirmation-title"
                className="text-lg font-bold"
              >
                {isAccept
                  ? "Accept Booking?"
                  : "Decline Booking?"}
              </h2>

              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {isAccept
                  ? "Are you sure you want to accept this customer request?"
                  : "Are you sure you want to decline this customer request?"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close confirmation modal"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-6">
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Customer
            </p>

            <p className="mt-2 text-sm font-bold">
              {booking.customer?.name ||
                "Customer"}
            </p>

            <p className="mt-1 break-all text-xs text-muted-foreground">
              {booking.customer?.email ||
                "No email provided"}
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Service
            </p>

            <p className="mt-2 text-sm font-bold">
              {booking.service?.title ||
                "Service Booking"}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {formatDate(booking.bookingDate)}{" "}
              •{" "}
              {formatTime(booking.bookingTime)}
            </p>
          </div>

          <div
            className={`rounded-2xl border p-4 ${
              isAccept
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-destructive/20 bg-destructive/5"
            }`}
          >
            <p className="text-xs leading-5 text-muted-foreground">
              {isAccept
                ? "After accepting, the customer will be able to continue with the payment process."
                : "This booking request will be marked as declined and the customer will be notified."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-border/60 bg-muted/20 p-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
              isAccept
                ? "bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700"
                : "bg-destructive shadow-destructive/20 hover:bg-destructive/90"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Updating...
              </>
            ) : isAccept ? (
              <>
                <CheckCircle2 className="size-4" />
                Accept Booking
              </>
            ) : (
              <>
                <XCircle className="size-4" />
                Decline Booking
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Status Helpers
============================================================ */

function getStatusTitle(
  status: BookingStatus,
) {
  switch (status) {
    case "REQUESTED":
      return "Waiting for your response";

    case "ACCEPTED":
      return "Booking accepted";

    case "DECLINED":
      return "Booking declined";

    case "PAID":
      return "Payment completed";

    case "IN_PROGRESS":
      return "Service in progress";

    case "COMPLETED":
      return "Service completed";

    case "CANCELLED":
      return "Booking cancelled";

    default:
      return "Booking status";
  }
}

function getStatusDescription(
  status: BookingStatus,
) {
  switch (status) {
    case "REQUESTED":
      return "Review the booking details and decide whether to accept or decline the request.";

    case "ACCEPTED":
      return "You accepted this booking. The customer can now continue with the payment process.";

    case "DECLINED":
      return "You declined this booking request.";

    case "PAID":
      return "The customer has completed the payment for this booking.";

    case "IN_PROGRESS":
      return "This service is currently in progress.";

    case "COMPLETED":
      return "This service has been successfully completed.";

    case "CANCELLED":
      return "This booking has been cancelled.";

    default:
      return "Review the booking information below.";
  }
}

/* ============================================================
   Date Helpers
============================================================ */

function formatDate(value: string) {
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
}

function formatTime(value: string) {
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
}

function formatDateTime(value: string) {
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
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
