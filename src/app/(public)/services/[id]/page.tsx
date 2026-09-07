"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Heart,
  Loader2,
  MapPin,
  MessageSquare,
  Pencil,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type FormEvent,
} from "react";
import { toast } from "sonner";

import api from "@/lib/axios";
import { getAccessToken } from "@/lib/auth";

import ServiceDetailsClient from "@/components/services/ServiceDetailsClient";

import {
  getServiceById,
  type ServiceApiResponse,
} from "@/services/service.service";

import type { Service } from "@/types/service";

/* ============================================================
   API ENDPOINTS

   IMPORTANT:
   app.ts:
   app.use("/api", AppRoutes)

   AppRoutes:
   /api/bookings
   /api/reviews

   Therefore final URLs are:
   /api/api/bookings/...
   /api/api/reviews/...
============================================================ */

const BOOKINGS_ENDPOINT =
  "/api/api/bookings/my-bookings";

const REVIEWS_ENDPOINT =
  "/api/api/reviews";

/* ============================================================
   TYPES
============================================================ */

interface Booking {
  id: string;

  serviceId?: string;
  technicianId?: string;

  status?: string;
  paymentStatus?: string;

  bookingDate?: string;
  bookingTime?: string;

  service?: {
    id?: string;
    title?: string;
  };

  technician?: {
    id?: string;
    user?: {
      id?: string;
    };
  };

  payment?: {
    status?: string;
  };

  review?: {
    id?: string;
    rating?: number;
    comment?: string | null;
  } | null;
}

interface Review {
  id: string;
  bookingId: string;

  technicianId?: string;

  rating: number;
  comment?: string | null;

  createdAt?: string;
  updatedAt?: string;

  customer?: {
    id?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };

  user?: {
    id?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };

  booking?: {
    id?: string;
    serviceId?: string;

    service?: {
      id?: string;
      title?: string;
    };
  };
}

interface ReviewFormState {
  bookingId: string;
  rating: number;
  comment: string;
}

/* ============================================================
   SERVICE MAPPER
============================================================ */

function mapService(
  service: ServiceApiResponse,
): Service {
  return {
    id: service.id,
    title: service.title,

    description:
      service.description ??
      "Professional and reliable service from a trusted FixItNow technician.",

    price: Number(service.price ?? 0),

    image:
      service.image ??
      "/images/service-placeholder.jpg",

    category:
      service.category?.name ??
      "Home Service",

    location:
      service.technician?.location ??
      "Available in your area",

    rating: Number(
      service.technician?.averageRating ?? 0,
    ),

    reviewCount: Number(
      service.technician?.totalReviews ?? 0,
    ),
  };
}

/* ============================================================
   CUSTOMER NAME
============================================================ */

function getCustomerName(
  review: Review,
) {
  const customer =
    review.customer ??
    review.user;

  if (!customer) {
    return "Customer";
  }

  if (customer.name?.trim()) {
    return customer.name;
  }

  const fullName = [
    customer.firstName,
    customer.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fullName) {
    return fullName;
  }

  if (customer.email) {
    return customer.email.split("@")[0];
  }

  return "Customer";
}

/* ============================================================
   RESPONSE ARRAY HELPER
============================================================ */

function getArrayFromResponse<T>(
  response: any,
): T[] {
  const root = response?.data;

  if (Array.isArray(root)) {
    return root;
  }

  if (Array.isArray(root?.data)) {
    return root.data;
  }

  if (Array.isArray(root?.data?.data)) {
    return root.data.data;
  }

  return [];
}

/* ============================================================
   BOOKING SERVICE ID
============================================================ */

function getBookingServiceId(
  booking: Booking,
) {
  return (
    booking.serviceId ??
    booking.service?.id ??
    ""
  );
}

/* ============================================================
   PAID BOOKING CHECK

   IMPORTANT:
   Review eligibility is based on:

   booking.status === "PAID"

   COMPLETED is NOT required.
   paymentStatus is NOT used.
============================================================ */

function isPaidBooking(
  booking: Booking,
) {
  return (
    String(booking.status ?? "")
      .trim()
      .toUpperCase() === "PAID"
  );
}

/* ============================================================
   REVIEW SERVICE ID
============================================================ */

function getReviewServiceId(
  review: Review,
) {
  return (
    review.booking?.serviceId ??
    review.booking?.service?.id ??
    ""
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function ServiceDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const serviceId =
    typeof params?.id === "string"
      ? params.id
      : "";

  const [service, setService] =
    useState<Service | null>(null);

  const [
    backendService,
    setBackendService,
  ] =
    useState<ServiceApiResponse | null>(
      null,
    );

  const [isLoading, setIsLoading] =
    useState(true);

  /* ==========================================================
     LOAD SERVICE
  ========================================================== */

  useEffect(() => {
    if (!serviceId) {
      router.replace("/services");
      return;
    }

    let cancelled = false;

    const loadService = async () => {
      try {
        setIsLoading(true);

        const response =
          await getServiceById(serviceId);

        const data =
          response?.data as
            | ServiceApiResponse
            | undefined;

        if (!data) {
          throw new Error(
            "Service information was not returned by the server.",
          );
        }

        if (!cancelled) {
          setBackendService(data);
          setService(
            mapService(data),
          );
        }
      } catch (error: any) {
        console.error(
          "SERVICE DETAILS API ERROR:",
          error,
        );

        if (!cancelled) {
          toast.error(
            error?.response?.data
              ?.message ||
              error?.message ||
              "Failed to load service.",
          );

          router.replace(
            "/services",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadService();

    return () => {
      cancelled = true;
    };
  }, [serviceId, router]);

  /* ==========================================================
     LOADING
  ========================================================== */

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading service...
        </div>
      </main>
    );
  }

  /* ==========================================================
     NOT FOUND
  ========================================================== */

  if (!service || !backendService) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-3xl border border-border/60 bg-background p-8 text-center shadow-sm">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <MessageSquare className="size-6" />
          </div>

          <h1 className="mt-5 text-xl font-bold">
            Service not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The requested service could not
            be found or may have been removed.
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to Services
          </Link>
        </div>
      </main>
    );
  }

  const rating =
    Number.isFinite(service.rating)
      ? service.rating
      : 0;

  const reviewCount =
    Number.isFinite(
      service.reviewCount,
    )
      ? service.reviewCount
      : 0;

  const technicianId =
    backendService.technician?.id;

  return (
    <main className="min-h-screen bg-background">
      {/* ======================================================
          BACK
      ====================================================== */}

      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 2xl:px-10">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />

            Back to services
          </Link>
        </div>
      </section>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <section className="py-8 sm:py-12 lg:py-16">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 2xl:px-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)] xl:gap-16">
            <div>
              {/* ==================================================
                  IMAGE
              ================================================== */}

              <div className="group relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-border/60 bg-muted shadow-sm">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  sizes="(max-width: 1024px) 100vw, 70vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

                <div className="absolute left-5 top-5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-xl">
                    <Sparkles className="size-3.5" />
                    {service.category}
                  </span>
                </div>

                <div className="absolute right-5 top-5">
                  <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xl">
                    <ShieldCheck className="size-3.5 text-emerald-400" />
                    Verified Service
                  </div>
                </div>
              </div>

              {/* ==================================================
                  TITLE / DESCRIPTION
              ================================================== */}

              <div className="mt-8">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400">
                    <Star className="size-4 fill-current" />

                    {rating.toFixed(1)}

                    <span className="font-normal text-muted-foreground">
                      ({reviewCount}{" "}
                      {reviewCount === 1
                        ? "review"
                        : "reviews"})
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4" />
                    {service.location}
                  </div>
                </div>

                <h1 className="mt-5 max-w-5xl text-balance text-3xl font-bold tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                  {service.title}
                </h1>

                <p className="mt-5 max-w-4xl text-base leading-8 text-muted-foreground sm:text-lg">
                  {service.description}
                </p>
              </div>

              {/* ==================================================
                  STATS
              ================================================== */}

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <StatCard
                  icon={Star}
                  value={rating.toFixed(1)}
                  label="Average rating"
                />

                <StatCard
                  icon={MessageSquare}
                  value={String(
                    reviewCount,
                  )}
                  label="Customer reviews"
                />

                <StatCard
                  icon={ShieldCheck}
                  value="100%"
                  label="Verified professionals"
                />
              </div>

              {/* ==================================================
                  HIGHLIGHTS
              ================================================== */}

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <HighlightCard
                  icon={ShieldCheck}
                  title="Verified Professionals"
                  description="Trusted and verified service providers."
                />

                <HighlightCard
                  icon={Clock3}
                  title="Flexible Scheduling"
                  description="Choose a time that works for you."
                />

                <HighlightCard
                  icon={Users}
                  title="Quality Service"
                  description="Highly rated professionals near you."
                />
              </div>

              {/* ==================================================
                  ABOUT
              ================================================== */}

              <div className="mt-12 border-t border-border/60 pt-10">
                <SectionHeading
                  icon={Sparkles}
                  title="About this service"
                  description="Everything you need to know before booking."
                />

                <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  <p>
                    Our professional{" "}
                    {service.category.toLowerCase()}{" "}
                    service is designed to make your
                    life easier. Whether you need a
                    quick fix or a complete service,
                    our trusted professionals are
                    ready to help.
                  </p>

                  <p>
                    Every professional on FixItNow is
                    selected based on quality,
                    reliability, and customer
                    satisfaction.
                  </p>

                  <p>
                    You can choose the right technician
                    based on their skills, ratings,
                    experience, availability, and
                    customer feedback.
                  </p>
                </div>
              </div>

              {/* ==================================================
                  INCLUDED
              ================================================== */}

              <div className="mt-12 border-t border-border/60 pt-10">
                <SectionHeading
                  icon={CheckCircle2}
                  title="What's included"
                  description="Your booking includes the following."
                />

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  {[
                    "Professional service consultation",
                    "Experienced and verified technician",
                    "Flexible appointment scheduling",
                    "Transparent pricing",
                    "Quality-focused service",
                    "Customer support assistance",
                  ].map((item) => (
                    <div
                      key={item}
                      className="group flex items-center gap-3 rounded-xl border border-border/50 bg-muted/10 p-4 transition-all duration-300 hover:border-primary/20 hover:bg-primary/5"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <CheckCircle2 className="size-4" />
                      </div>

                      <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ==================================================
                  TECHNICIAN
              ================================================== */}

              <div
                id="technician-booking"
                className="mt-12 scroll-mt-24 border-t border-border/60 pt-10"
              >
                <SectionHeading
                  icon={Users}
                  title="Choose your technician"
                  description="Select a trusted professional and schedule your service."
                />

                <div className="mt-7">
                  <ServiceDetailsClient
                    service={service}
                  />
                </div>
              </div>

              {/* ==================================================
                  REVIEWS
              ================================================== */}

              <ServiceReviews
                technicianId={
                  technicianId
                }
                serviceId={
                  service.id
                }
                averageRating={
                  rating
                }
                totalReviews={
                  reviewCount
                }
              />
            </div>

            {/* ====================================================
                SIDEBAR
            ==================================================== */}

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-background shadow-xl shadow-black/5">
                <div className="border-b border-border/60 p-6 sm:p-7">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Starting from
                      </p>

                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-3xl font-bold tracking-tight">
                          $
                          {service.price.toFixed(
                            2,
                          )}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="Save service"
                      className="flex size-11 items-center justify-center rounded-full border border-border transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                    >
                      <Heart className="size-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <h2 className="text-lg font-semibold">
                    Book this service
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Select a trusted professional
                    and choose a convenient time
                    for your service.
                  </p>

                  <InfoCard
                    icon={CalendarDays}
                    title="Flexible scheduling"
                    description="Select your exact date and time after choosing a technician."
                    primary
                  />

                  <InfoCard
                    icon={Clock3}
                    title="Available time slots"
                    description="Time availability is handled in the booking section."
                  />

                  <a
                    href="#technician-booking"
                    className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl"
                  >
                    Choose a Technician
                  </a>

                  <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
                    You won't be charged until your
                    booking is accepted by a technician.
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-border/60 bg-muted/20 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="size-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Safe & trusted booking
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Your booking and payment are
                      securely processed through
                      FixItNow.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   SERVICE REVIEWS
============================================================ */

interface ServiceReviewsProps {
  technicianId?: string;
  serviceId: string;
  averageRating: number;
  totalReviews: number;
}

function ServiceReviews({
  technicianId,
  serviceId,
  averageRating,
  totalReviews,
}: ServiceReviewsProps) {
  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [hasPaidBooking, setHasPaidBooking] =
    useState(false);

  const [hasCheckedPayment, setHasCheckedPayment] =
    useState(false);

  const [isLoadingReviews, setIsLoadingReviews] =
    useState(true);

  const [isLoadingBookings, setIsLoadingBookings] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [editingReviewId, setEditingReviewId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<ReviewFormState>({
      bookingId: "",
      rating: 5,
      comment: "",
    });

  /* ==========================================================
     LOAD BOOKINGS
  ========================================================== */

  const loadBookings = useCallback(
    async (
      showError = false,
    ): Promise<Booking[]> => {
      const token =
        getAccessToken();

      if (!token) {
        setBookings([]);
        setHasPaidBooking(false);
        setHasCheckedPayment(true);
        setIsLoadingBookings(false);

        return [];
      }

      try {
        setIsLoadingBookings(true);

        const response =
          await api.get(
            BOOKINGS_ENDPOINT,
          );

        const data =
          getArrayFromResponse<Booking>(
            response,
          );

        setBookings(data);

        const paidBookingExists =
          data.some(
            (booking) =>
              getBookingServiceId(
                booking,
              ) === serviceId &&
              isPaidBooking(
                booking,
              ),
          );

        setHasPaidBooking(
          paidBookingExists,
        );

        setHasCheckedPayment(true);

        return data;
      } catch (error: any) {
        console.error(
          "LOAD CUSTOMER BOOKINGS ERROR:",
          error,
        );

        setBookings([]);
        setHasPaidBooking(false);
        setHasCheckedPayment(true);

        if (
          error?.response?.status ===
          401
        ) {
          if (showError) {
            toast.error(
              "Your session has expired. Please login again.",
            );
          }
        } else if (showError) {
          toast.error(
            error?.response?.data
              ?.message ||
              "Failed to load your bookings.",
          );
        }

        return [];
      } finally {
        setIsLoadingBookings(false);
      }
    },
    [serviceId],
  );

  /* ==========================================================
     INITIAL BOOKING LOAD
  ========================================================== */

  useEffect(() => {
    void loadBookings(false);
  }, [loadBookings]);

  /* ==========================================================
     LOAD REVIEWS
  ========================================================== */

  const loadReviews =
    useCallback(
      async (
        canLoad = hasPaidBooking,
      ): Promise<Review[]> => {
        const token =
          getAccessToken();

        if (
          !token ||
          !canLoad ||
          !technicianId
        ) {
          setReviews([]);
          setIsLoadingReviews(false);

          return [];
        }

        try {
          setIsLoadingReviews(true);

          const response =
            await api.get(
              REVIEWS_ENDPOINT,
              {
                params: {
                  technicianId,
                },
              },
            );

          const data =
            getArrayFromResponse<Review>(
              response,
            );

          /*
           * ONLY reviews belonging to the
           * current service are shown.
           */
          const serviceReviews =
            data.filter(
              (review) => {
                const reviewServiceId =
                  getReviewServiceId(
                    review,
                  );

                return (
                  Boolean(
                    reviewServiceId,
                  ) &&
                  reviewServiceId ===
                    serviceId
                );
              },
            );

          setReviews(
            serviceReviews,
          );

          return serviceReviews;
        } catch (error) {
          console.error(
            "LOAD REVIEWS ERROR:",
            error,
          );

          setReviews([]);

          return [];
        } finally {
          setIsLoadingReviews(
            false,
          );
        }
      },
      [
        technicianId,
        serviceId,
        hasPaidBooking,
      ],
    );

  /* ==========================================================
     LOAD REVIEWS AFTER BOOKING CHECK
  ========================================================== */

  useEffect(() => {
    if (!hasCheckedPayment) {
      return;
    }

    void loadReviews(
      hasPaidBooking,
    );
  }, [
    hasCheckedPayment,
    hasPaidBooking,
    loadReviews,
  ]);

  /* ==========================================================
     EXACT PAID BOOKINGS
  ========================================================== */

  const eligibleBookings =
    useMemo(() => {
      return bookings.filter(
        (booking) =>
          getBookingServiceId(
            booking,
          ) === serviceId &&
          isPaidBooking(
            booking,
          ),
      );
    }, [
      bookings,
      serviceId,
    ]);

  /* ==========================================================
     REVIEWED BOOKINGS
  ========================================================== */

  const reviewedBookingIds =
    useMemo(() => {
      return new Set(
        reviews
          .map(
            (review) =>
              review.bookingId,
          )
          .filter(Boolean),
      );
    }, [reviews]);

  /* ==========================================================
     REVIEWABLE BOOKINGS
  ========================================================== */

  const reviewableBookings =
    eligibleBookings.filter(
      (booking) =>
        !reviewedBookingIds.has(
          booking.id,
        ),
    );

  /* ==========================================================
     CURRENT CUSTOMER'S BOOKINGS

     /my-bookings returns only the current
     customer's bookings.

     Therefore if review.bookingId exists
     here, this review belongs to current user.
  ========================================================== */

  const ownBookingIds =
    useMemo(() => {
      return new Set(
        bookings
          .map(
            (booking) =>
              booking.id,
          )
          .filter(Boolean),
      );
    }, [bookings]);

  /* ==========================================================
     REFRESH BOOKING + REVIEWS

     This prevents stale state after:
     - create
     - update
     - delete
  ========================================================== */

  const refreshReviewData =
    useCallback(async () => {
      const latestBookings =
        await loadBookings(
          false,
        );

      const paidAccess =
        latestBookings.some(
          (booking) =>
            getBookingServiceId(
              booking,
            ) === serviceId &&
            isPaidBooking(
              booking,
            ),
        );

      const latestReviews =
        await loadReviews(
          paidAccess,
        );

      return {
        latestBookings,
        latestReviews,
        paidAccess,
      };
    }, [
      loadBookings,
      loadReviews,
      serviceId,
    ]);

  /* ==========================================================
     OPEN REVIEW FORM
  ========================================================== */

  const handleOpenReviewForm =
    async () => {
      if (!getAccessToken()) {
        toast.error(
          "Please login as a customer to write a review.",
        );
        return;
      }

      if (!technicianId) {
        toast.error(
          "Technician information is unavailable.",
        );
        return;
      }

      const {
        latestBookings,
        latestReviews,
        paidAccess,
      } =
        await refreshReviewData();

      if (!paidAccess) {
        setShowForm(false);

        toast.info(
          "You can review this service only after your booking is marked as PAID.",
        );

        return;
      }

      const latestEligibleBookings =
        latestBookings.filter(
          (booking) =>
            getBookingServiceId(
              booking,
            ) === serviceId &&
            isPaidBooking(
              booking,
            ),
        );

      const latestReviewedIds =
        new Set(
          latestReviews
            .map(
              (review) =>
                review.bookingId,
            )
            .filter(Boolean),
        );

      const hasReviewableBooking =
        latestEligibleBookings.some(
          (booking) =>
            !latestReviewedIds.has(
              booking.id,
            ),
        );

      if (!hasReviewableBooking) {
        toast.info(
          "You have already reviewed all your paid bookings for this service.",
        );
      }

      setEditingReviewId(
        null,
      );

      setForm({
        bookingId: "",
        rating: 5,
        comment: "",
      });

      setShowForm(true);
    };

  /* ==========================================================
     SUBMIT / UPDATE REVIEW
  ========================================================== */

  const handleSubmitReview =
    async (
      event: FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (!getAccessToken()) {
        toast.error(
          "Please login as a customer.",
        );
        return;
      }

      if (
        !editingReviewId &&
        !form.bookingId
      ) {
        toast.error(
          "Please select a paid booking.",
        );
        return;
      }

      if (
        form.rating < 1 ||
        form.rating > 5
      ) {
        toast.error(
          "Rating must be between 1 and 5.",
        );
        return;
      }

      if (
        form.comment.length > 1000
      ) {
        toast.error(
          "Comment cannot exceed 1000 characters.",
        );
        return;
      }

      /* --------------------------------------------------------
         CREATE VALIDATION
      -------------------------------------------------------- */

      if (!editingReviewId) {
        const selectedBooking =
          eligibleBookings.find(
            (booking) =>
              booking.id ===
              form.bookingId,
          );

        if (!selectedBooking) {
          toast.error(
            "Only a paid booking for this service can be reviewed.",
          );
          return;
        }

        if (
          !isPaidBooking(
            selectedBooking,
          )
        ) {
          toast.error(
            "This booking is not marked as PAID.",
          );
          return;
        }
      }

      /* --------------------------------------------------------
         EDIT VALIDATION
      -------------------------------------------------------- */

      if (editingReviewId) {
        const review =
          reviews.find(
            (item) =>
              item.id ===
              editingReviewId,
          );

        if (!review) {
          toast.error(
            "Review could not be found.",
          );
          return;
        }

        if (
          !ownBookingIds.has(
            review.bookingId,
          )
        ) {
          toast.error(
            "You can only edit your own review.",
          );
          return;
        }
      }

      try {
        setIsSubmitting(true);

        /* ====================================================
           UPDATE
        ==================================================== */

        if (editingReviewId) {
          const response =
            await api.patch(
              `${REVIEWS_ENDPOINT}/${editingReviewId}`,
              {
                rating: Number(
                  form.rating,
                ),

                comment:
                  form.comment.trim() ||
                  undefined,
              },
            );

          toast.success(
            response?.data?.message ||
              "Review updated successfully.",
          );
        }

        /* ====================================================
           CREATE
        ==================================================== */

        else {
          const response =
            await api.post(
              REVIEWS_ENDPOINT,
              {
                bookingId:
                  form.bookingId,

                rating: Number(
                  form.rating,
                ),

                comment:
                  form.comment.trim() ||
                  undefined,
              },
            );

          toast.success(
            response?.data?.message ||
              "Review submitted successfully.",
          );
        }

        /* ====================================================
           RESET FORM
        ==================================================== */

        setShowForm(false);

        setEditingReviewId(
          null,
        );

        setForm({
          bookingId: "",
          rating: 5,
          comment: "",
        });

        /* ====================================================
           REFRESH BOTH BOOKINGS + REVIEWS
        ==================================================== */

        await refreshReviewData();
      } catch (error: any) {
        console.error(
          "SUBMIT REVIEW ERROR:",
          error,
        );

        console.error(
          "REVIEW BACKEND RESPONSE:",
          error?.response?.data,
        );

        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to save review.",
        );
      } finally {
        setIsSubmitting(false);
      }
    };

  /* ==========================================================
     EDIT REVIEW
  ========================================================== */

  const handleEditReview =
    (review: Review) => {
      if (
        !ownBookingIds.has(
          review.bookingId,
        )
      ) {
        toast.error(
          "You can only edit your own review.",
        );
        return;
      }

      const booking =
        bookings.find(
          (item) =>
            item.id ===
            review.bookingId,
        );

      if (
        !booking ||
        getBookingServiceId(
          booking,
        ) !== serviceId ||
        !isPaidBooking(booking)
      ) {
        toast.error(
          "This review is no longer associated with an eligible paid booking.",
        );
        return;
      }

      setEditingReviewId(
        review.id,
      );

      setForm({
        bookingId:
          review.bookingId,

        rating: Number(
          review.rating,
        ),

        comment:
          review.comment ?? "",
      });

      setShowForm(true);
    };

  /* ==========================================================
     DELETE REVIEW
  ========================================================== */

  const handleDeleteReview =
    async (
      review: Review,
    ) => {
      if (
        !ownBookingIds.has(
          review.bookingId,
        )
      ) {
        toast.error(
          "You can only delete your own review.",
        );
        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this review?",
        );

      if (!confirmed) {
        return;
      }

      if (!getAccessToken()) {
        toast.error(
          "Please login as a customer.",
        );
        return;
      }

      try {
        setIsSubmitting(true);

        const response =
          await api.delete(
            `${REVIEWS_ENDPOINT}/${review.id}`,
          );

        toast.success(
          response?.data?.message ||
            "Review deleted successfully.",
        );

        await refreshReviewData();
      } catch (error: any) {
        console.error(
          "DELETE REVIEW ERROR:",
          error,
        );

        toast.error(
          error?.response?.data?.message ||
            "Failed to delete review.",
        );
      } finally {
        setIsSubmitting(false);
      }
    };

  /* ==========================================================
     DISPLAYED AVERAGE
  ========================================================== */

  const displayedAverage =
    reviews.length > 0
      ? reviews.reduce(
          (sum, review) =>
            sum +
            Number(
              review.rating || 0,
            ),
          0,
        ) / reviews.length
      : averageRating;

  /* ==========================================================
     REVIEW ACCESS RULE
  ========================================================== */

  if (
    !hasCheckedPayment ||
    !hasPaidBooking
  ) {
    return null;
  }

  /* ==========================================================
     REVIEW SECTION UI
  ========================================================== */

  return (
    <section className="mt-12 border-t border-border/60 pt-10">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          icon={MessageSquare}
          title="Customer reviews"
          description="See what customers are saying about this service."
        />

        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Star className="size-5 fill-current" />
          </div>

          <div>
            <p className="text-xl font-bold">
              {Number(
                displayedAverage || 0,
              ).toFixed(1)}
            </p>

            <p className="text-xs text-muted-foreground">
              {reviews.length > 0
                ? reviews.length
                : totalReviews}{" "}
              {(
                reviews.length > 0
                  ? reviews.length
                  : totalReviews
              ) === 1
                ? "review"
                : "reviews"}
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================
          WRITE REVIEW
      ====================================================== */}

      <div className="mt-7 rounded-2xl border border-primary/15 bg-primary/5 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">
              Paid for this service?
            </h3>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Since your booking is marked as
              PAID, you can share your experience
              with other customers.
            </p>
          </div>

          <button
            type="button"
            onClick={
              handleOpenReviewForm
            }
            disabled={
              isLoadingBookings ||
              isSubmitting
            }
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingBookings ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Checking payment...
              </>
            ) : (
              <>
                <MessageSquare className="size-4" />
                Write a Review
              </>
            )}
          </button>
        </div>
      </div>

      {/* ======================================================
          REVIEW FORM
      ====================================================== */}

      {showForm && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border/70 bg-background shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 p-5 sm:p-6">
            <div>
              <h3 className="font-semibold">
                {editingReviewId
                  ? "Edit your review"
                  : "Write your review"}
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Your review is for this paid
                service only.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingReviewId(
                  null,
                );
              }}
              className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <form
            onSubmit={
              handleSubmitReview
            }
            className="space-y-6 p-5 sm:p-6"
          >
            {/* ==================================================
                BOOKING SELECT
            ================================================== */}

            {!editingReviewId && (
              <div className="space-y-2">
                <label
                  htmlFor="review-booking"
                  className="text-sm font-semibold"
                >
                  Paid booking
                </label>

                {isLoadingBookings ? (
                  <div className="flex h-12 items-center gap-2 rounded-xl border border-border bg-muted/20 px-4 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Checking your paid bookings...
                  </div>
                ) : reviewableBookings.length ===
                  0 ? (
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <p className="text-sm font-semibold">
                      No reviewable booking found
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      You have already reviewed
                      all your paid bookings for
                      this service.
                    </p>
                  </div>
                ) : (
                  <select
                    id="review-booking"
                    value={
                      form.bookingId
                    }
                    onChange={(event) =>
                      setForm(
                        (current) => ({
                          ...current,
                          bookingId:
                            event.target
                              .value,
                        }),
                      )
                    }
                    disabled={
                      isSubmitting
                    }
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">
                      Select your paid booking
                    </option>

                    {reviewableBookings.map(
                      (booking) => (
                        <option
                          key={
                            booking.id
                          }
                          value={
                            booking.id
                          }
                        >
                          Booking #
                          {booking.id.slice(
                            0,
                            8,
                          )}
                        </option>
                      ),
                    )}
                  </select>
                )}
              </div>
            )}

            {/* ==================================================
                RATING
            ================================================== */}

            <div className="space-y-3">
              <label className="text-sm font-semibold">
                Your rating
              </label>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setForm(
                          (current) => ({
                            ...current,
                            rating:
                              star,
                          }),
                        )
                      }
                      disabled={
                        isSubmitting
                      }
                      aria-label={`Rate ${star} out of 5`}
                      className="rounded-lg p-1 transition-transform hover:scale-110 disabled:cursor-not-allowed"
                    >
                      <Star
                        className={`size-8 transition-colors ${
                          star <=
                          form.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ),
                )}

                <span className="ml-2 text-sm font-semibold">
                  {form.rating}/5
                </span>
              </div>
            </div>

            {/* ==================================================
                COMMENT
            ================================================== */}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="review-comment"
                  className="text-sm font-semibold"
                >
                  Comment
                </label>

                <span className="text-xs text-muted-foreground">
                  {form.comment.length}
                  /1000
                </span>
              </div>

              <textarea
                id="review-comment"
                value={
                  form.comment
                }
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      comment:
                        event.target
                          .value,
                    }),
                  )
                }
                maxLength={1000}
                rows={5}
                disabled={
                  isSubmitting
                }
                placeholder="Tell us about your experience..."
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingReviewId(
                    null,
                  );
                }}
                disabled={
                  isSubmitting
                }
                className="h-11 rounded-xl border border-border px-5 text-sm font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  (!editingReviewId &&
                    !form.bookingId) ||
                  (!editingReviewId &&
                    reviewableBookings.length ===
                      0)
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : editingReviewId ? (
                  <>
                    <Pencil className="size-4" />
                    Update Review
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================
          REVIEWS LIST
      ====================================================== */}

      <div className="mt-7">
        {isLoadingReviews ? (
          <div className="flex min-h-32 items-center justify-center rounded-2xl border border-border/60 bg-muted/10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading reviews...
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-muted/10 p-8 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageSquare className="size-6" />
            </div>

            <h3 className="mt-4 font-semibold">
              No reviews yet
            </h3>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Be the first customer to share
              your experience.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(
              (review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  canManage={ownBookingIds.has(
                    review.bookingId,
                  )}
                  onEdit={() =>
                    handleEditReview(
                      review,
                    )
                  }
                  onDelete={() =>
                    handleDeleteReview(
                      review,
                    )
                  }
                  isDeleting={
                    isSubmitting
                  }
                />
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   REVIEW CARD
============================================================ */

function ReviewCard({
  review,
  canManage,
  onEdit,
  onDelete,
  isDeleting,
}: {
  review: Review;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const name =
    getCustomerName(review);

  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part
          .charAt(0)
          .toUpperCase(),
      )
      .join("") || "C";

  const formattedDate =
    review.createdAt
      ? new Date(
          review.createdAt,
        ).toLocaleDateString(
          undefined,
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          },
        )
      : "";

  return (
    <article className="rounded-2xl border border-border/60 bg-background p-5 shadow-sm transition-all hover:border-primary/15 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {initials}
          </div>

          <div>
            <p className="font-semibold">
              {name}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <Star
                      key={star}
                      className={`size-3.5 ${
                        star <=
                        Number(
                          review.rating,
                        )
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/20"
                      }`}
                    />
                  ),
                )}
              </div>

              {formattedDate && (
                <>
                  <span className="text-muted-foreground/40">
                    •
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {formattedDate}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ====================================================
            ONLY CURRENT CUSTOMER CAN MANAGE
        ==================================================== */}

        {canManage && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onEdit}
              disabled={
                isDeleting
              }
              aria-label="Edit review"
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-50"
            >
              <Pencil className="size-4" />
            </button>

            <button
              type="button"
              onClick={onDelete}
              disabled={
                isDeleting
              }
              aria-label="Delete review"
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
            </button>
          </div>
        )}
      </div>

      {review.comment?.trim() && (
        <p className="mt-5 text-sm leading-7 text-muted-foreground">
          {review.comment}
        </p>
      )}
    </article>
  );
}

/* ============================================================
   SECTION HEADING
============================================================ */

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {title}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: ComponentType<{
    className?: string;
  }>;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>

        <div>
          <p className="text-lg font-bold">
            {value}
          </p>

          <p className="text-xs text-muted-foreground">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   HIGHLIGHT CARD
============================================================ */

interface HighlightCardProps {
  icon: ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
}

function HighlightCard({
  icon: Icon,
  title,
  description,
}: HighlightCardProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/5">
      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <h3 className="mt-4 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   INFO CARD
============================================================ */

function InfoCard({
  icon: Icon,
  title,
  description,
  primary = false,
}: {
  icon: ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
  primary?: boolean;
}) {
  return (
    <div
      className={[
        "mt-4 flex items-center gap-3 rounded-2xl border p-4",
        primary
          ? "border-primary/10 bg-primary/5"
          : "border-border/60 bg-muted/20",
      ].join(" ")}
    >
      <div
        className={[
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          primary
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground",
        ].join(" ")}
      >
        <Icon className="size-5" />
      </div>

      <div>
        <p className="text-sm font-semibold">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}