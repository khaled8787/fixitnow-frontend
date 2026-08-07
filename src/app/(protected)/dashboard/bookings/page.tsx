
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Loader2,
  MapPin,
  RefreshCw,
  User,
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
  description?: string;
  price?: string | number;
  duration?: number;
  category?: Category | null;
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
  service?: Service | null;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

type StatusFilter = "ALL" | BookingStatus;

const statusOptions: {
  value: StatusFilter;
  label: string;
}[] = [
  { value: "ALL", label: "All Bookings" },
  { value: "REQUESTED", label: "Requested" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "DECLINED", label: "Declined" },
  { value: "PAID", label: "Paid" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function TechnicianBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [updatingBookingId, setUpdatingBookingId] =
    useState<string | null>(null);

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [selectedAction, setSelectedAction] =
    useState<"ACCEPT" | "DECLINE" | null>(null);

  const loadBookings = useCallback(
    async (showRefreshLoader = false) => {
      try {
        if (showRefreshLoader) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        
        const response = await api.get<
          ApiResponse<Booking[]>
        >("/api/api/bookings");

        const data = response.data?.data;

        if (!Array.isArray(data)) {
          setBookings([]);

          toast.error(
            "Invalid bookings response from the backend.",
          );

          return;
        }

        setBookings(data);
      } catch (error: any) {
        console.error(
          "LOAD TECHNICIAN BOOKINGS ERROR:",
          error,
        );

        toast.error(
          error?.response?.data?.message ||
            "Failed to load bookings.",
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  
  const openActionModal = (
    booking: Booking,
    action: "ACCEPT" | "DECLINE",
  ) => {
    setSelectedBooking(booking);
    setSelectedAction(action);
  };

  
  const closeActionModal = () => {
    if (updatingBookingId) {
      return;
    }

    setSelectedBooking(null);
    setSelectedAction(null);
  };

 
  const handleBookingAction = async () => {
    if (!selectedBooking || !selectedAction) {
      return;
    }

    const bookingId = selectedBooking.id;

    try {
      setUpdatingBookingId(bookingId);

      const status =
        selectedAction === "ACCEPT"
          ? "ACCEPTED"
          : "DECLINED";

      
      await api.patch(
        `/api/api/bookings/${bookingId}/status`,
        {
          status,
        },
      );

      toast.success(
        selectedAction === "ACCEPT"
          ? "Booking accepted successfully."
          : "Booking declined successfully.",
      );

      setSelectedBooking(null);
      setSelectedAction(null);

      await loadBookings();
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
      setUpdatingBookingId(null);
    }
  };

  
  const filteredBookings = useMemo(() => {
    if (statusFilter === "ALL") {
      return bookings;
    }

    return bookings.filter(
      (booking) =>
        booking.status === statusFilter,
    );
  }, [bookings, statusFilter]);

  /*
   * ------------------------------------------------------------
   * Statistics
   * ------------------------------------------------------------
   */
  const requestedCount = bookings.filter(
    (booking) => booking.status === "REQUESTED",
  ).length;

  const acceptedCount = bookings.filter(
    (booking) => booking.status === "ACCEPTED",
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "COMPLETED",
  ).length;

  return (
    <main className="min-h-screen bg-background">
      {/* ======================================================
          Header
      ======================================================= */}
      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
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
                  My Bookings
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Manage customer service requests,
                  accept bookings, and keep track of your
                  upcoming work.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => loadBookings(true)}
              disabled={
                isLoading || isRefreshing
              }
              className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 lg:self-auto"
            >
              <RefreshCw
                className={`size-4 ${
                  isRefreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================
          Main Content
      ======================================================= */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ==================================================
              Statistics
          =================================================== */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Bookings"
              value={bookings.length}
              icon={
                <CalendarDays className="size-5" />
              }
            />

            <StatCard
              label="Pending Requests"
              value={requestedCount}
              icon={
                <Clock3 className="size-5" />
              }
            />

            <StatCard
              label="Accepted"
              value={acceptedCount}
              icon={
                <CheckCircle2 className="size-5" />
              }
            />

            <StatCard
              label="Completed"
              value={completedCount}
              icon={
                <CheckCircle2 className="size-5" />
              }
            />
          </div>

          {/* ==================================================
              Filters
          =================================================== */}
          <div className="mb-8 overflow-x-auto rounded-2xl border border-border/60 bg-background p-2 shadow-sm">
            <div className="flex min-w-max gap-2">
              {statusOptions.map((option) => {
                const active =
                  statusFilter === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setStatusFilter(
                        option.value,
                      )
                    }
                    className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ==================================================
              Loading
          =================================================== */}
          {isLoading ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-border/60 bg-background">
              <div className="flex flex-col items-center gap-3 text-center">
                <Loader2 className="size-8 animate-spin text-primary" />

                <div>
                  <p className="text-sm font-semibold">
                    Loading bookings...
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Fetching your customer bookings from
                    the backend.
                  </p>
                </div>
              </div>
            </div>
          ) : filteredBookings.length === 0 ? (
            /* ==================================================
               Empty
            =================================================== */
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-background px-6 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CalendarDays className="size-8" />
              </div>

              <h2 className="mt-5 text-xl font-bold">
                No bookings found
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                {statusFilter === "ALL"
                  ? "You don't have any customer bookings yet."
                  : `There are no ${statusFilter
                      .toLowerCase()
                      .replace(
                        "_",
                        " ",
                      )} bookings right now.`}
              </p>

              {statusFilter !== "ALL" && (
                <button
                  type="button"
                  onClick={() =>
                    setStatusFilter("ALL")
                  }
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  View All Bookings
                </button>
              )}
            </div>
          ) : (
            /* ==================================================
               Booking Grid
            =================================================== */
            <div className="grid gap-5 lg:grid-cols-2">
              {filteredBookings.map(
                (booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isUpdating={
                      updatingBookingId ===
                      booking.id
                    }
                    onAccept={() =>
                      openActionModal(
                        booking,
                        "ACCEPT",
                      )
                    }
                    onDecline={() =>
                      openActionModal(
                        booking,
                        "DECLINE",
                      )
                    }
                  />
                ),
              )}
            </div>
          )}
        </div>
      </section>

      {/* ======================================================
          Confirmation Modal
      ======================================================= */}
      {selectedBooking &&
        selectedAction && (
          <BookingActionModal
            booking={selectedBooking}
            action={selectedAction}
            isLoading={
              updatingBookingId ===
              selectedBooking.id
            }
            onClose={closeActionModal}
            onConfirm={
              handleBookingAction
            }
          />
        )}
    </main>
  );
}

/* ============================================================
   Stat Card
============================================================ */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight">
            {value}
          </p>
        </div>

        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Booking Card
============================================================ */

function BookingCard({
  booking,
  isUpdating,
  onAccept,
  onDecline,
}: {
  booking: Booking;
  isUpdating: boolean;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const price = Number(
    booking.servicePrice,
  );

  return (
    <article className="overflow-hidden rounded-3xl border border-border/60 bg-background shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      {/* Card Header */}
      <div className="border-b border-border/60 bg-muted/20 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Booking Request
            </p>

            <h2 className="mt-1 line-clamp-2 text-lg font-bold">
              {booking.service?.title ||
                "Service Booking"}
            </h2>
          </div>

          <StatusBadge
            status={booking.status}
          />
        </div>
      </div>

      {/* Card Body */}
      <div className="space-y-5 p-5">
        {/* Customer */}
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
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
              <User className="size-5" />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              Customer
            </p>

            <p className="truncate text-sm font-semibold">
              {booking.customer?.name ||
                "Customer"}
            </p>

            {booking.customer?.email && (
              <p className="truncate text-xs text-muted-foreground">
                {booking.customer.email}
              </p>
            )}
          </div>
        </div>

        {/* Booking Details */}
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoItem
            icon={
              <CalendarDays className="size-4 text-primary" />
            }
            label="Date"
            value={formatDate(
              booking.bookingDate,
            )}
          />

          <InfoItem
            icon={
              <Clock3 className="size-4 text-primary" />
            }
            label="Time"
            value={formatTime(
              booking.bookingTime,
            )}
          />

          <InfoItem
            icon={
              <MapPin className="size-4 text-primary" />
            }
            label="Address"
            value={booking.address}
          />

          <InfoItem
            icon={
              <CheckCircle2 className="size-4 text-primary" />
            }
            label="Service Price"
            value={
              Number.isFinite(price)
                ? `$${price.toFixed(2)}`
                : "$0.00"
            }
          />
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Customer Notes
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {booking.notes}
            </p>
          </div>
        )}

        {/* Service */}
        {booking.service?.category?.name && (
          <div className="flex items-center justify-between border-t border-border/60 pt-4">
            <span className="text-xs text-muted-foreground">
              Category
            </span>

            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {booking.service.category.name}
            </span>
          </div>
        )}

        {/* Actions */}
        {booking.status ===
          "REQUESTED" && (
          <div className="grid gap-3 border-t border-border/60 pt-5 sm:grid-cols-2">
            <button
              type="button"
              onClick={onDecline}
              disabled={isUpdating}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <XCircle className="size-4" />
              Decline
            </button>

            <button
              type="button"
              onClick={onAccept}
              disabled={isUpdating}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 className="size-4" />
              Accept Booking
            </button>
          </div>
        )}

        {/* Accepted */}
        {booking.status ===
          "ACCEPTED" && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

              <div>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Booking Accepted
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  This booking has been accepted. Wait
                  for the customer to complete payment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Declined */}
        {booking.status ===
          "DECLINED" && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />

              <div>
                <p className="text-sm font-semibold text-destructive">
                  Booking Declined
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  This booking request was declined.
                </p>
              </div>
            </div>
          </div>
        )}
        

        {/* View Service */}
        {booking.service?.id && (
          <Link
            href={`/services/${booking.service.id}`}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background text-xs font-semibold transition-colors hover:bg-muted"
          >
            <Eye className="size-4" />
            View Service
          </Link>
        )}
      </div>
    </article>
  );
}

/* ============================================================
   Info Item
============================================================ */

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-border/50 bg-muted/20 p-3">
      <div className="mt-0.5 shrink-0">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 truncate text-xs font-semibold">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}



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

  const current =
    config[status];

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}


function BookingActionModal({
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
  const isAccept =
    action === "ACCEPT";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !isLoading
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
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
              <h2 className="text-lg font-bold">
                {isAccept
                  ? "Accept Booking?"
                  : "Decline Booking?"}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {isAccept
                  ? "Confirm that you want to accept this customer request."
                  : "Confirm that you want to decline this customer request."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close"
            className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-6">
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Customer
            </p>

            <p className="mt-2 text-sm font-bold">
              {booking.customer?.name ||
                "Customer"}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {booking.customer?.email ||
                "No email provided"}
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Service
            </p>

            <p className="mt-2 text-sm font-bold">
              {booking.service?.title ||
                "Service Booking"}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {formatDate(
                booking.bookingDate,
              )}{" "}
              •{" "}
              {formatTime(
                booking.bookingTime,
              )}
            </p>
          </div>

          <p className="text-sm leading-6 text-muted-foreground">
            {isAccept
              ? "Once accepted, the customer can continue with the payment process."
              : "The customer will be notified that this booking request has been declined."}
          </p>
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
   Date Helpers
============================================================ */

function formatDate(
  value: string,
) {
  if (!value) {
    return "Not provided";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  ).format(date);
}

function formatTime(
  value: string,
) {
  if (!value) {
    return "Not provided";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    },
  ).format(date);
}
