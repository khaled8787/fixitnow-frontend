"use client";

import {
  Loader2,
  MessageSquare,
  Star,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import BookingFlow from "@/components/booking/BookingFlow";
import TechnicianSelection from "@/components/technicians/TechnicianSelection";

import {
  getTechnicians,
  type TechnicianApiResponse,
} from "@/services/technician.service";

import {
  getReviewsByTechnician,
} from "@/services/review.service";

import type { Service } from "@/types/service";
import type { Technician } from "@/types/technician";
import type { Review } from "@/types/review";

/* ============================================================
   TYPES
============================================================ */

interface ServiceDetailsClientProps {
  service: Service;
}

/* ============================================================
   RATING STARS
============================================================ */

function RatingStars({
  rating,
  size = "size-4",
}: {
  rating: number;
  size?: string;
}) {
  const safeRating = Number(rating) || 0;

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${safeRating.toFixed(1)} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = safeRating >= star;

        return (
          <Star
            key={star}
            className={`${size} ${
              filled
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/25"
            }`}
          />
        );
      })}
    </div>
  );
}

/* ============================================================
   REVIEW DATE
============================================================ */

function formatReviewDate(date?: string | null) {
  if (!date) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "";
  }
}

/* ============================================================
   TECHNICIAN MAPPER
============================================================ */

function mapTechnician(
  technician: TechnicianApiResponse,
): Technician {
  return {
    /*
     * IMPORTANT:
     *
     * This must be TechnicianProfile.id.
     *
     * Review API filters:
     *
     * technicianId = TechnicianProfile.id
     */
    id: technician.id,

    userId: technician.userId,

    name:
      technician.user?.name ??
      "Unknown Technician",

    email:
      technician.user?.email ??
      "",

    phone:
      technician.user?.phone ??
      null,

    image:
      technician.user?.image ??
      "",

    bio:
      technician.bio ??
      "",

    location:
      technician.location ??
      "",

    experience:
      Number(technician.experience ?? 0),

    hourlyRate:
      Number(technician.hourlyRate ?? 0),

    isAvailable:
      Boolean(technician.isAvailable),

    /*
     * Backend already stores aggregated
     * technician rating.
     */
    rating:
      Number(
        (technician as any).averageRating ?? 0,
      ),

    reviewCount:
      Number(
        (technician as any).totalReviews ?? 0,
      ),

    completedJobs:
      Number(
        (technician as any).completedJobs ?? 0,
      ),

    services:
      technician.services?.map((item) => ({
        id: item.id,

        title:
          item.title,

        name:
          item.name,

        description:
          item.description,

        price:
          item.price !== undefined
            ? Number(item.price)
            : undefined,

        image:
          item.image,
      })) ?? [],
  };
}

/* ============================================================
   REVIEW SECTION
============================================================ */

function ReviewsSection({
  technician,
}: {
  technician: Technician | null;
}) {
  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(false);

  /* ==========================================================
     LOAD REVIEWS
  ========================================================== */

  useEffect(() => {
  if (!technician?.id) {
    setReviews([]);
    setLoading(false);
    setError(false);
    return;
  }

  let mounted = true;

  async function loadReviews() {
    try {
      setLoading(true);
      setError(false);

      if (!technician) {
  return;
}

      const result = await getReviewsByTechnician(
        technician.id,
      );

      if (!mounted) {
        return;
      }

      setReviews(
        Array.isArray(result)
          ? result
          : [],
      );
    } catch (error: unknown) {
      console.error(
        "========== REVIEWS API ERROR ==========",
      );

      console.error(
        "RAW ERROR:",
        error,
      );

      if (error instanceof Error) {
        console.error(
          "ERROR NAME:",
          error.name,
        );

        console.error(
          "ERROR MESSAGE:",
          error.message,
        );

        console.error(
          "ERROR STACK:",
          error.stack,
        );
      }

      const axiosError = error as {
        response?: {
          status?: number;
          data?: unknown;
        };
        request?: unknown;
        config?: {
          url?: string;
          baseURL?: string;
          method?: string;
        };
        message?: string;
      };

      console.error(
        "STATUS:",
        axiosError.response?.status,
      );

      console.error(
        "RESPONSE DATA:",
        axiosError.response?.data,
      );

      console.error(
        "BASE URL:",
        axiosError.config?.baseURL,
      );

      console.error(
        "REQUEST URL:",
        axiosError.config?.url,
      );

      console.error(
        "METHOD:",
        axiosError.config?.method,
      );

      console.error(
        "REQUEST:",
        axiosError.request,
      );

      console.error(
        "========================================",
      );

      if (!mounted) {
        return;
      }

      setReviews([]);
      setError(true);
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  }

  loadReviews();

  return () => {
    mounted = false;
  };
}, [technician?.id]);
  /* ==========================================================
     RATING SUMMARY
  ========================================================== */

  const ratingSummary = useMemo(() => {
    /*
     * If reviews are available from API,
     * calculate the rating directly from them.
     */
    if (reviews.length > 0) {
      const total =
        reviews.length;

      const totalRating =
        reviews.reduce(
          (sum, review) =>
            sum +
            Number(review.rating ?? 0),
          0,
        );

      const average =
        total > 0
          ? totalRating / total
          : 0;

      const counts: Record<
        1 | 2 | 3 | 4 | 5,
        number
      > = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      reviews.forEach((review) => {
        const rating = Math.round(
          Number(review.rating ?? 0),
        );

        if (
          rating >= 1 &&
          rating <= 5
        ) {
          counts[
            rating as 1 | 2 | 3 | 4 | 5
          ]++;
        }
      });

      return {
        average,

        total,

        percentages: {
          5:
            (counts[5] / total) *
            100,

          4:
            (counts[4] / total) *
            100,

          3:
            (counts[3] / total) *
            100,

          2:
            (counts[2] / total) *
            100,

          1:
            (counts[1] / total) *
            100,
        },
      };
    }

    /*
     * If there are no individual reviews,
     * use technician aggregate values if available.
     *
     * This prevents the UI from incorrectly
     * displaying 0 when backend already has
     * averageRating / totalReviews.
     */
    const backendAverage =
      Number(
        (technician as any)?.rating ?? 0,
      );

    const backendTotal =
      Number(
        (technician as any)?.reviewCount ?? 0,
      );

    return {
      average:
        backendAverage,

      total:
        backendTotal,

      percentages: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    };
  }, [reviews, technician]);

  /* ==========================================================
     NO TECHNICIAN
  ========================================================== */

  if (!technician) {
    return (
      <section className="mt-14 border-t border-border/60 pt-12">
        <div className="rounded-3xl border border-dashed border-border/70 bg-muted/10 p-10 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <MessageSquare className="size-7" />
          </div>

          <h3 className="mt-5 text-lg font-semibold">
            Select a technician
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Select a technician above to view
            customer reviews and continue with
            your booking.
          </p>
        </div>
      </section>
    );
  }

  /* ==========================================================
     MAIN REVIEW UI
  ========================================================== */

  return (
    <section className="mt-14 border-t border-border/60 pt-12">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <MessageSquare className="size-5" />

            <span className="text-sm font-semibold">
              Customer Reviews
            </span>
          </div>

          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            What customers say
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Read feedback from customers who
            have reviewed services completed by
            this technician.
          </p>
        </div>

        {/* HEADER RATING */}

        {!loading &&
          ratingSummary.total > 0 && (
            <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
              <div className="text-2xl font-bold">
                {ratingSummary.average.toFixed(
                  1,
                )}
              </div>

              <div>
                <RatingStars
                  rating={
                    ratingSummary.average
                  }
                />

                <p className="mt-1 text-xs text-muted-foreground">
                  {ratingSummary.total}{" "}
                  {ratingSummary.total === 1
                    ? "review"
                    : "reviews"}
                </p>
              </div>
            </div>
          )}
      </div>

      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="mt-8 flex min-h-40 items-center justify-center rounded-3xl border border-border/60 bg-muted/10">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-primary" />

            Loading customer reviews...
          </div>
        </div>
      )}

      {/* ======================================================
          ERROR
      ====================================================== */}

      {!loading &&
        error && (
          <div className="mt-8 rounded-3xl border border-border/60 bg-muted/10 p-8 text-center">
            <MessageSquare className="mx-auto size-8 text-muted-foreground/50" />

            <h3 className="mt-4 text-base font-semibold">
              Reviews are currently unavailable
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              We couldn't load reviews for this
              technician. Please try again later.
            </p>
          </div>
        )}

      {/* ======================================================
          NO REVIEWS
      ====================================================== */}

      {!loading &&
        !error &&
        reviews.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-border/70 bg-muted/10 p-10 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Star className="size-7" />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              {ratingSummary.total > 0
                ? `${ratingSummary.total} ${
                    ratingSummary.total === 1
                      ? "review"
                      : "reviews"
                  }`
                : "No reviews yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              {ratingSummary.total > 0
                ? `This technician has an average rating of ${ratingSummary.average.toFixed(
                    1,
                  )} out of 5.`
                : "This technician hasn't received any customer reviews yet."}
            </p>
          </div>
        )}

      {/* ======================================================
          REVIEW SUMMARY + REVIEW LIST
      ====================================================== */}

      {!loading &&
        !error &&
        reviews.length > 0 && (
          <>
            {/* ==================================================
                SUMMARY
            ================================================== */}

            <div className="mt-8 grid gap-6 rounded-3xl border border-border/60 bg-muted/10 p-6 sm:p-8 md:grid-cols-[180px_1fr]">
              {/* AVERAGE */}

              <div className="flex flex-col items-center justify-center border-b border-border/60 pb-6 text-center md:border-b-0 md:border-r md:pb-0 md:pr-8">
                <div className="text-5xl font-bold tracking-tight">
                  {ratingSummary.average.toFixed(
                    1,
                  )}
                </div>

                <div className="mt-2">
                  <RatingStars
                    rating={
                      ratingSummary.average
                    }
                    size="size-5"
                  />
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  Based on{" "}
                  {ratingSummary.total}{" "}
                  {ratingSummary.total === 1
                    ? "review"
                    : "reviews"}
                </p>
              </div>

              {/* DISTRIBUTION */}

              <div className="flex flex-col justify-center gap-3">
                {[5, 4, 3, 2, 1].map(
                  (rating) => {
                    const percentage =
                      ratingSummary
                        .percentages[
                        rating as 1 |
                          2 |
                          3 |
                          4 |
                          5
                      ] ?? 0;

                    return (
                      <div
                        key={rating}
                        className="flex items-center gap-3"
                      >
                        <div className="flex w-10 items-center justify-end gap-1 text-xs font-medium">
                          {rating}

                          <Star className="size-3 fill-amber-400 text-amber-400" />
                        </div>

                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-amber-400 transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                        <span className="w-10 text-right text-xs text-muted-foreground">
                          {Math.round(
                            percentage,
                          )}
                          %
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* ==================================================
                REVIEW LIST
            ================================================== */}

            <div className="mt-8 space-y-4">
              {reviews.map((review) => {
                const customerName =
                  review.customer?.name ??
                  "Anonymous Customer";

                const customerImage =
                  review.customer?.image ??
                  null;

                const reviewRating =
                  Number(
                    review.rating ?? 0,
                  );

                return (
                  <article
                    key={review.id}
                    className="rounded-3xl border border-border/60 bg-background p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-black/5 sm:p-7"
                  >
                    <div className="flex items-start gap-4">
                      {/* AVATAR */}

                      <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
                        {customerImage ? (
                          <img
                            src={
                              customerImage
                            }
                            alt={
                              customerName
                            }
                            className="size-full object-cover"
                          />
                        ) : (
                          <UserRound className="size-5" />
                        )}
                      </div>

                      {/* REVIEW CONTENT */}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="text-sm font-semibold">
                              {customerName}
                            </h3>

                            <div className="mt-1 flex items-center gap-2">
                              <RatingStars
                                rating={
                                  reviewRating
                                }
                              />

                              <span className="text-xs font-medium text-muted-foreground">
                                {reviewRating.toFixed(
                                  1,
                                )}
                              </span>
                            </div>
                          </div>

                          <time className="text-xs text-muted-foreground">
                            {formatReviewDate(
                              review.createdAt,
                            )}
                          </time>
                        </div>

                        {/* COMMENT */}

                        {review.comment && (
                          <p className="mt-4 text-sm leading-7 text-muted-foreground">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
    </section>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function ServiceDetailsClient({
  service,
}: ServiceDetailsClientProps) {
  const [
    technicians,
    setTechnicians,
  ] = useState<Technician[]>([]);

  const [
    selectedTechnicianId,
    setSelectedTechnicianId,
  ] = useState<string | null>(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  /* ==========================================================
     LOAD TECHNICIANS
  ========================================================== */

  useEffect(() => {
    let mounted = true;

    async function loadTechnicians() {
      try {
        setIsLoading(true);

        const response =
          await getTechnicians({
            isAvailable: true,
          });

        const data =
          Array.isArray(
            response?.data,
          )
            ? response.data
            : [];

        const mappedTechnicians =
          data.map(mapTechnician);

        /*
         * Only technicians that provide
         * this service should appear.
         */

        const serviceTechnicians =
  mappedTechnicians.filter(
    (technician: Technician) => {
              /*
               * If technician has service data,
               * match service ID.
               */

              if (
                technician.services &&
                technician.services.length > 0
              ) {
                return technician.services.some(
                  (technicianService) =>
                    technicianService.id ===
                    service.id,
                );
              }

              /*
               * If backend doesn't return services
               * for the technician, keep it visible.
               *
               * This prevents the page from becoming
               * empty because of incomplete relation data.
               */
              return true;
            },
          );

        if (!mounted) {
          return;
        }

        setTechnicians(
          serviceTechnicians,
        );

        /*
         * Keep selected technician only
         * if it still exists.
         */

        setSelectedTechnicianId(
          (currentId) => {
            if (!currentId) {
              return null;
            }

            const exists =
  serviceTechnicians.some(
    (technician: Technician) =>
      technician.id === currentId,
  );

            return exists
              ? currentId
              : null;
          },
        );
      } catch (error: any) {
        console.error(
          "TECHNICIANS API ERROR:",
          error?.response?.data ??
            error?.message ??
            error,
        );

        if (!mounted) {
          return;
        }

        toast.error(
          error?.response?.data
            ?.message ??
            "Failed to load technicians.",
        );

        setTechnicians([]);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadTechnicians();

    return () => {
      mounted = false;
    };
  }, [service.id]);

  /* ==========================================================
     SELECTED TECHNICIAN
  ========================================================== */

  const selectedTechnician =
    useMemo(() => {
      if (
        !selectedTechnicianId
      ) {
        return null;
      }

      return (
        technicians.find(
          (technician) =>
            technician.id ===
            selectedTechnicianId,
        ) ?? null
      );
    }, [
      technicians,
      selectedTechnicianId,
    ]);

  /* ==========================================================
     LOADING
  ========================================================== */

  if (isLoading) {
    return (
      <section className="mt-12 border-t border-border/60 pt-12">
        <div className="flex min-h-48 items-center justify-center rounded-3xl border border-border/70 bg-background">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-primary" />

            Loading available technicians...
          </div>
        </div>
      </section>
    );
  }

  /* ==========================================================
     MAIN
  ========================================================== */

  return (
    <div id="technician-booking">
      {/* ======================================================
          TECHNICIANS
      ====================================================== */}

      <TechnicianSelection
        technicians={technicians}
        selectedTechnicianId={
          selectedTechnicianId
        }
        onSelectTechnician={
          setSelectedTechnicianId
        }
      />

      {/* ======================================================
          BOOKING
      ====================================================== */}

      {selectedTechnician && (
        <BookingFlow
          technician={
            selectedTechnician
          }
          serviceId={service.id}
          serviceName={
            service.title
          }
        />
      )}

      {/* ======================================================
          REVIEWS
      ====================================================== */}

      <ReviewsSection
        technician={
          selectedTechnician
        }
      />
    </div>
  );
}