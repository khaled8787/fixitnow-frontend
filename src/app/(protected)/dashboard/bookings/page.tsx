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
  ShieldCheck,
  Trash2,
  User,
  Wrench,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

/* ============================================================
   Types
============================================================ */

type UserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

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

interface Technician {
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

type StatusFilter = "ALL" | BookingStatus;

type BookingAction =
  | "ACCEPT"
  | "DECLINE"
  | "CANCEL"
  | "DELETE";

/* ============================================================
   Status Options
============================================================ */

const statusOptions: {
  value: StatusFilter;
  label: string;
}[] = [
  {
    value: "ALL",
    label: "All",
  },
  {
    value: "REQUESTED",
    label: "Requested",
  },
  {
    value: "ACCEPTED",
    label: "Accepted",
  },
  {
    value: "DECLINED",
    label: "Declined",
  },
  {
    value: "PAID",
    label: "Paid",
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];

/* ============================================================
   Main Page
============================================================ */

export default function BookingsPage() {
  const { user, isLoading: authLoading, isAuthenticated } =
    useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [selectedAction, setSelectedAction] =
    useState<BookingAction | null>(null);

  const [updatingBookingId, setUpdatingBookingId] =
    useState<string | null>(null);

  /* ============================================================
     Load Bookings
  ============================================================ */

  const loadBookings = useCallback(
    async (refresh = false) => {
      if (!user) return;

      try {
        if (refresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        /*
         * IMPORTANT:
         * তোমার current axios configuration অনুযায়ী
         * double /api রাখা হয়েছে।
         */

        const response = await api.get<
          ApiResponse<Booking[]>
        >("/api/api/bookings");

        const data = response.data?.data;

        if (!Array.isArray(data)) {
          setBookings([]);
          toast.error(
            "Invalid bookings response from backend.",
          );
          return;
        }

        setBookings(data);
      } catch (error: any) {
        console.error(
          "LOAD BOOKINGS ERROR:",
          error,
        );

        const message =
          error?.response?.data?.message ||
          "Failed to load bookings.";

        toast.error(message);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [user],
  );

  /* ============================================================
     Auth + Initial Load
  ============================================================ */

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      loadBookings();
    }
  }, [
    authLoading,
    isAuthenticated,
    user,
    loadBookings,
  ]);

  /* ============================================================
     Role
  ============================================================ */

  const role = user?.role as UserRole | undefined;

  const isAdmin = role === "ADMIN";
  const isTechnician = role === "TECHNICIAN";
  const isCustomer = role === "CUSTOMER";

  /* ============================================================
     Page Content By Role
  ============================================================ */

  const pageInfo = useMemo(() => {
    if (isAdmin) {
      return {
        eyebrow: "Administrator",
        title: "All Bookings",
        description:
          "Monitor and manage every booking across the FixItNow platform.",
        icon: ShieldCheck,
      };
    }

    if (isTechnician) {
      return {
        eyebrow: "Technician Dashboard",
        title: "My Bookings",
        description:
          "Review customer requests, accept or decline bookings, and manage your assigned work.",
        icon: Wrench,
      };
    }

    return {
      eyebrow: "Customer Dashboard",
      title: "My Bookings",
      description:
        "Track your service bookings, appointment details, and booking status.",
      icon: CalendarDays,
    };
  }, [isAdmin, isTechnician]);

  /* ============================================================
     Filter
  ============================================================ */

  const filteredBookings = useMemo(() => {
    if (statusFilter === "ALL") {
      return bookings;
    }

    return bookings.filter(
      (booking) =>
        booking.status === statusFilter,
    );
  }, [bookings, statusFilter]);

  /* ============================================================
     Statistics
  ============================================================ */

  const requestedCount = bookings.filter(
    (booking) =>
      booking.status === "REQUESTED",
  ).length;

  const acceptedCount = bookings.filter(
    (booking) =>
      booking.status === "ACCEPTED",
  ).length;

  const inProgressCount = bookings.filter(
    (booking) =>
      booking.status === "IN_PROGRESS",
  ).length;

  const completedCount = bookings.filter(
    (booking) =>
      booking.status === "COMPLETED",
  ).length;

  /* ============================================================
     Modal
  ============================================================ */

  const openActionModal = (
    booking: Booking,
    action: BookingAction,
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

  /* ============================================================
     Booking Action
  ============================================================ */

  const handleBookingAction = async () => {
    if (
      !selectedBooking ||
      !selectedAction ||
      !role
    ) {
      return;
    }

    const bookingId = selectedBooking.id;

    try {
      setUpdatingBookingId(bookingId);

      /*
       * ========================================================
       * TECHNICIAN
       * ========================================================
       */

      if (
        isTechnician &&
        (selectedAction === "ACCEPT" ||
          selectedAction === "DECLINE")
      ) {
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
      }

      /*
       * ========================================================
       * CUSTOMER
       * ========================================================
       */

      else if (
        isCustomer &&
        selectedAction === "CANCEL"
      ) {
        await api.patch(
          `/api/api/bookings/${bookingId}/cancel`,
        );

        toast.success(
          "Booking cancelled successfully.",
        );
      }

      /*
       * ========================================================
       * ADMIN
       * ========================================================
       */

      else if (
        isAdmin &&
        selectedAction === "DELETE"
      ) {
        await api.delete(
          `/api/api/bookings/${bookingId}`,
        );

        toast.success(
          "Booking deleted successfully.",
        );
      }

      else {
        toast.error(
          "You are not allowed to perform this action.",
        );

        return;
      }

      setSelectedBooking(null);
      setSelectedAction(null);

      await loadBookings(true);
    } catch (error: any) {
      console.error(
        "BOOKING ACTION ERROR:",
        error,
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to perform booking action.",
      );
    } finally {
      setUpdatingBookingId(null);
    }
  };

  /* ============================================================
     Loading Auth
  ============================================================ */

  if (authLoading) {
    return <PageLoading />;
  }

  /* ============================================================
     Not Authenticated
  ============================================================ */

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-md text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-8" />
          </div>

          <h1 className="mt-5 text-xl font-bold">
            Authentication Required
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Please login to access your bookings.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  /* ============================================================
     Main
  ============================================================ */

  const HeaderIcon = pageInfo.icon;

  return (
    <main className="min-h-screen bg-background">
      {/* ========================================================
          HEADER
      ======================================================== */}

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
                <HeaderIcon className="size-6" />
              </div>

              <div>
                <p className="text-sm font-medium text-primary">
                  {pageInfo.eyebrow}
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                  {pageInfo.title}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {pageInfo.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                loadBookings(true)
              }
              disabled={
                isLoading ||
                isRefreshing
              }
              className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 lg:self-auto"
            >
              <RefreshCw
                className={
                  isRefreshing
                    ? "size-4 animate-spin"
                    : "size-4"
                }
              />

              Refresh
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          CONTENT
      ======================================================== */}

      <section className="py-10 sm:py-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ====================================================
              ROLE INFO
          ==================================================== */}

          <div className="mb-8 rounded-2xl border border-primary/10 bg-primary/[0.04] p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />

              <div>
                <p className="text-sm font-semibold">
                  {isAdmin
                    ? "Administrator Access"
                    : isTechnician
                      ? "Technician Access"
                      : "Customer Access"}
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {isAdmin
                    ? "You can monitor all platform bookings and remove bookings when necessary."
                    : isTechnician
                      ? "You can manage booking requests assigned to your technician account."
                      : "You can view your own bookings and cancel eligible requests."}
                </p>
              </div>
            </div>
          </div>

          {/* ====================================================
              STATS
          ==================================================== */}

          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label={
                isAdmin
                  ? "Total Bookings"
                  : "My Bookings"
              }
              value={bookings.length}
              icon={
                <CalendarDays className="size-5" />
              }
            />

            <StatCard
              label="Requested"
              value={requestedCount}
              icon={
                <Clock3 className="size-5" />
              }
            />

            <StatCard
              label={
                isTechnician
                  ? "Accepted"
                  : "In Progress"
              }
              value={
                isTechnician
                  ? acceptedCount
                  : inProgressCount
              }
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

          {/* ====================================================
              FILTER
          ==================================================== */}

          <div className="mb-8 overflow-x-auto rounded-2xl border border-border/60 bg-background p-2 shadow-sm">
            <div className="flex min-w-max gap-2">
              {statusOptions.map(
                (option) => {
                  const active =
                    statusFilter ===
                    option.value;

                  return (
                    <button
                      key={
                        option.value
                      }
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
                },
              )}
            </div>
          </div>

          {/* ====================================================
              LOADING
          ==================================================== */}

          {isLoading ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-border/60 bg-background">
              <div className="flex flex-col items-center gap-3 text-center">
                <Loader2 className="size-8 animate-spin text-primary" />

                <div>
                  <p className="text-sm font-semibold">
                    Loading bookings...
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Fetching booking data from
                    the backend.
                  </p>
                </div>
              </div>
            </div>
          ) : filteredBookings.length === 0 ? (
            /* ==================================================
               EMPTY
            =================================================== */

            <EmptyState
              filter={statusFilter}
              role={role}
              onReset={() =>
                setStatusFilter("ALL")
              }
            />
          ) : (
            /* ==================================================
               BOOKING GRID
            =================================================== */

            <div className="grid gap-5 lg:grid-cols-2">
              {filteredBookings.map(
                (booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    role={role}
                    isUpdating={
                      updatingBookingId ===
                      booking.id
                    }
                    onAction={
                      openActionModal
                    }
                  />
                ),
              )}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          ACTION MODAL
      ======================================================== */}

      {selectedBooking &&
        selectedAction && (
          <BookingActionModal
            booking={
              selectedBooking
            }
            action={
              selectedAction
            }
            isLoading={
              updatingBookingId ===
              selectedBooking.id
            }
            onClose={
              closeActionModal
            }
            onConfirm={
              handleBookingAction
            }
          />
        )}
    </main>
  );
}

/* ============================================================
   Page Loading
============================================================ */

function PageLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
          <CalendarDays className="size-6 animate-pulse text-primary" />
        </div>

        <p className="mt-5 text-sm font-semibold">
          Loading bookings...
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Checking your account and bookings.
        </p>
      </div>
    </main>
  );
}

/* ============================================================
   Empty State
============================================================ */

function EmptyState({
  filter,
  role,
  onReset,
}: {
  filter: StatusFilter;
  role: UserRole;
  onReset: () => void;
}) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-background px-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <CalendarDays className="size-8" />
      </div>

      <h2 className="mt-5 text-xl font-bold">
        No bookings found
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {filter === "ALL"
          ? role === "ADMIN"
            ? "There are no bookings on the platform yet."
            : role === "TECHNICIAN"
              ? "You don't have any customer bookings yet."
              : "You don't have any bookings yet."
          : `There are no ${filter
              .toLowerCase()
              .replace("_", " ")} bookings right now.`}
      </p>

      {filter !== "ALL" && (
        <button
          type="button"
          onClick={onReset}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          View All Bookings
        </button>
      )}
    </div>
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
    <div className="rounded-2xl border border-border/60 bg-background p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
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
  role,
  isUpdating,
  onAction,
}: {
  booking: Booking;
  role: UserRole;
  isUpdating: boolean;
  onAction: (
    booking: Booking,
    action: BookingAction,
  ) => void;
}) {
  const price = Number(
    booking.servicePrice,
  );

  const isAdmin =
    role === "ADMIN";

  const isTechnician =
    role === "TECHNICIAN";

  const isCustomer =
    role === "CUSTOMER";

  return (
    <article className="overflow-hidden rounded-3xl border border-border/60 bg-background shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="border-b border-border/60 bg-muted/20 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {isAdmin
                ? "Platform Booking"
                : isTechnician
                  ? "Customer Request"
                  : "My Booking"}
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

      {/* ======================================================
          BODY
      ======================================================= */}

      <div className="space-y-5 p-5">
        {/* ====================================================
            ADMIN
        ==================================================== */}

        {isAdmin && (
          <div className="grid gap-3 sm:grid-cols-2">
            <PersonBox
              title="Customer"
              name={
                booking.customer?.name ||
                "Unknown Customer"
              }
              email={
                booking.customer?.email
              }
              image={
                booking.customer?.image
              }
              icon={
                <User className="size-5" />
              }
            />

            <PersonBox
              title="Technician"
              name={
                booking.technician?.name ||
                "Assigned Technician"
              }
              email={
                booking.technician?.email
              }
              image={
                booking.technician?.image
              }
              icon={
                <Wrench className="size-5" />
              }
            />
          </div>
        )}

        {/* ====================================================
            TECHNICIAN
        ==================================================== */}

        {isTechnician && (
          <PersonBox
            title="Customer"
            name={
              booking.customer?.name ||
              "Customer"
            }
            email={
              booking.customer?.email
            }
            image={
              booking.customer?.image
            }
            icon={
              <User className="size-5" />
            }
          />
        )}

        {/* ====================================================
            CUSTOMER
        ==================================================== */}

        {isCustomer && (
          <PersonBox
            title="Technician"
            name={
              booking.technician?.name ||
              "Assigned Technician"
            }
            email={
              booking.technician?.email
            }
            image={
              booking.technician?.image
            }
            icon={
              <Wrench className="size-5" />
            }
          />
        )}

        {/* ====================================================
            BOOKING DETAILS
        ==================================================== */}

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

        {/* ====================================================
            NOTES
        ==================================================== */}

        {booking.notes && (
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {isTechnician
                ? "Customer Notes"
                : "Booking Notes"}
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {booking.notes}
            </p>
          </div>
        )}

        {/* ====================================================
            CATEGORY
        ==================================================== */}

        {booking.service?.category
          ?.name && (
          <div className="flex items-center justify-between border-t border-border/60 pt-4">
            <span className="text-xs text-muted-foreground">
              Category
            </span>

            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {
                booking.service
                  .category.name
              }
            </span>
          </div>
        )}

        {/* ====================================================
            TECHNICIAN ACTIONS
        ==================================================== */}

        {isTechnician &&
          booking.status ===
            "REQUESTED" && (
            <div className="grid gap-3 border-t border-border/60 pt-5 sm:grid-cols-2">
              <button
                type="button"
                disabled={isUpdating}
                onClick={() =>
                  onAction(
                    booking,
                    "DECLINE",
                  )
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <XCircle className="size-4" />
                Decline
              </button>

              <button
                type="button"
                disabled={isUpdating}
                onClick={() =>
                  onAction(
                    booking,
                    "ACCEPT",
                  )
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle2 className="size-4" />
                Accept
              </button>
            </div>
          )}

        {/* ====================================================
            CUSTOMER CANCEL
        ==================================================== */}

        {isCustomer &&
          (
            booking.status ===
              "REQUESTED" ||
            booking.status ===
              "ACCEPTED"
          ) && (
            <div className="border-t border-border/60 pt-5">
              <button
                type="button"
                disabled={isUpdating}
                onClick={() =>
                  onAction(
                    booking,
                    "CANCEL",
                  )
                }
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <XCircle className="size-4" />
                Cancel Booking
              </button>
            </div>
          )}

        {/* ====================================================
            ADMIN DELETE
        ==================================================== */}

        {isAdmin && (
          <div className="border-t border-border/60 pt-5">
            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                onAction(
                  booking,
                  "DELETE",
                )
              }
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="size-4" />
              Delete Booking
            </button>
          </div>
        )}

        {/* ====================================================
            SERVICE
        ==================================================== */}

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
   Person Box
============================================================ */

function PersonBox({
  title,
  name,
  email,
  image,
  icon,
}: {
  title: string;
  name: string;
  email?: string | null;
  image?: string | null;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-border/60 bg-muted/20 p-3">
      <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
        {image ? (
          <img
            src={image}
            alt={name}
            className="size-full object-cover"
          />
        ) : (
          icon
        )}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </p>

        <p className="truncate text-sm font-semibold">
          {name}
        </p>

        {email && (
          <p className="truncate text-xs text-muted-foreground">
            {email}
          </p>
        )}
      </div>
    </div>
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

/* ============================================================
   Action Modal
============================================================ */

function BookingActionModal({
  booking,
  action,
  isLoading,
  onClose,
  onConfirm,
}: {
  booking: Booking;
  action: BookingAction;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const isAccept =
    action === "ACCEPT";

  const isDecline =
    action === "DECLINE";

  const isCancel =
    action === "CANCEL";

  const isDelete =
    action === "DELETE";

  const title = isAccept
    ? "Accept Booking?"
    : isDecline
      ? "Decline Booking?"
      : isCancel
        ? "Cancel Booking?"
        : "Delete Booking?";

  const description =
    isAccept
      ? "Confirm that you want to accept this customer request."
      : isDecline
        ? "Confirm that you want to decline this customer request."
        : isCancel
          ? "Are you sure you want to cancel this booking?"
          : "This will permanently remove the booking from the platform.";

  const iconClass =
    isAccept
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : "bg-destructive/10 text-destructive";

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
              className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
            >
              {isAccept ? (
                <CheckCircle2 className="size-6" />
              ) : isDelete ? (
                <Trash2 className="size-6" />
              ) : (
                <XCircle className="size-6" />
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold">
                {title}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {description}
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

          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Booking Address
            </p>

            <p className="mt-2 text-sm font-semibold">
              {booking.address ||
                "No address provided"}
            </p>
          </div>

          {booking.notes && (
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Notes
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {booking.notes}
              </p>
            </div>
          )}
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
                Processing...
              </>
            ) : isAccept ? (
              <>
                <CheckCircle2 className="size-4" />
                Accept Booking
              </>
            ) : isDecline ? (
              <>
                <XCircle className="size-4" />
                Decline Booking
              </>
            ) : isCancel ? (
              <>
                <XCircle className="size-4" />
                Cancel Booking
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete Booking
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

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
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

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
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