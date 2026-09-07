
"use client";

import {
  CheckCircle2,
  Loader2,
  MessageSquareText,
  Pencil,
  Send,
  Star,
  Trash2,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import {
  createReview,
  deleteReview,
  getReviewByBooking,
  updateReview,
} from "@/services/review.service";

import type {
  Review,
} from "@/types/review";

/* ============================================================
   PROPS
============================================================ */

interface ReviewFormProps {
  bookingId: string;

  existingReview?: Review | null;
}

/* ============================================================
   COMPONENT
============================================================ */

export default function ReviewForm({
  bookingId,
  existingReview = null,
}: ReviewFormProps) {
  /* ==========================================================
     STATE
  ========================================================== */

  const [rating, setRating] =
    useState<number>(
      existingReview?.rating ?? 0,
    );

  const [comment, setComment] =
    useState<string>(
      existingReview?.comment ??
        "",
    );

  const [
    hoveredRating,
    setHoveredRating,
  ] = useState<number>(0);

  const [
    review,
    setReview,
  ] = useState<Review | null>(
    existingReview,
  );

  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    isLoadingReview,
    setIsLoadingReview,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  /* ==========================================================
     LOAD EXISTING REVIEW
  ========================================================== */

  useEffect(() => {
    let mounted = true;

    async function loadExistingReview() {
      /*
       * If no booking ID exists,
       * there is nothing to search for.
       */
      if (!bookingId) {
        setReview(null);
        setRating(0);
        setComment("");
        return;
      }

      /*
       * Parent already provided the review.
       * No additional request is necessary.
       */
      if (existingReview) {
        setReview(
          existingReview,
        );

        setRating(
          existingReview.rating,
        );

        setComment(
          existingReview.comment ??
            "",
        );

        setIsEditing(false);

        return;
      }

      try {
        setIsLoadingReview(true);

        /*
         * Search review by booking.
         *
         * Backend:
         * GET /api/reviews?bookingId=...
         */
        const result =
          await getReviewByBooking(
            bookingId,
          );

        if (!mounted) {
          return;
        }

        if (result) {
          setReview(result);

          setRating(
            result.rating,
          );

          setComment(
            result.comment ??
              "",
          );
        } else {
          setReview(null);

          setRating(0);

          setComment("");
        }

        setIsEditing(false);
      } catch (error: any) {
        /*
         * 404/empty response should not break
         * the review form.
         *
         * The backend get-all endpoint normally
         * returns [] when there is no review.
         */
        console.error(
          "LOAD REVIEW ERROR:",
          error?.response?.data ??
            error,
        );

        if (!mounted) {
          return;
        }

        setReview(null);
      } finally {
        if (mounted) {
          setIsLoadingReview(false);
        }
      }
    }

    loadExistingReview();

    return () => {
      mounted = false;
    };
  }, [
    bookingId,
    existingReview,
  ]);

  /* ==========================================================
     DISPLAYED RATING
  ========================================================== */

  const displayedRating =
    hoveredRating ||
    rating;

  /* ==========================================================
     SUBMIT STATE
  ========================================================== */

  const canSubmit =
    rating >= 1 &&
    rating <= 5 &&
    !isSubmitting &&
    !isDeleting &&
    !isLoadingReview;

  /* ==========================================================
     START EDITING
  ========================================================== */

  function handleStartEditing() {
    if (!review) {
      return;
    }

    setRating(
      Number(review.rating),
    );

    setComment(
      review.comment ?? "",
    );

    setHoveredRating(0);

    setIsEditing(true);
  }

  /* ==========================================================
     CANCEL EDITING
  ========================================================== */

  function handleCancelEditing() {
    if (review) {
      setRating(
        Number(review.rating),
      );

      setComment(
        review.comment ?? "",
      );
    } else {
      setRating(0);

      setComment("");
    }

    setHoveredRating(0);

    setIsEditing(false);
  }

  /* ==========================================================
     SUBMIT / UPDATE
  ========================================================== */

  async function handleSubmit() {
    if (!bookingId) {
      toast.error(
        "Booking information is missing.",
      );

      return;
    }

    if (
      rating < 1 ||
      rating > 5
    ) {
      toast.error(
        "Please select a rating from 1 to 5 stars.",
      );

      return;
    }

    try {
      setIsSubmitting(true);

      /* ======================================================
         UPDATE EXISTING REVIEW
      ====================================================== */

      if (review && isEditing) {
        const updatedReview =
          await updateReview(
            review.id,
            {
              rating,
              comment:
                comment.trim(),
            },
          );

        setReview(
          updatedReview,
        );

        setRating(
          updatedReview.rating,
        );

        setComment(
          updatedReview.comment ??
            "",
        );

        setIsEditing(false);

        setHoveredRating(0);

        toast.success(
          "Review updated successfully!",
        );

        return;
      }

      /* ======================================================
         CREATE NEW REVIEW
      ====================================================== */

      /*
       * If review already exists but
       * somehow editing mode is false,
       * don't create another one.
       */
      if (review) {
        toast.error(
          "You have already reviewed this booking.",
        );

        return;
      }

      const createdReview =
        await createReview({
          bookingId,

          rating,

          comment:
            comment.trim(),
        });

      setReview(
        createdReview,
      );

      setRating(
        createdReview.rating,
      );

      setComment(
        createdReview.comment ??
          "",
      );

      setHoveredRating(0);

      setIsEditing(false);

      toast.success(
        "Thank you! Your review has been submitted.",
      );
    } catch (error: any) {
      console.error(
        "REVIEW SUBMIT ERROR:",
        error?.response?.data ??
          error,
      );

      const message =
        error?.response?.data
          ?.message ??
        error?.message ??
        "Failed to submit review.";

      toast.error(
        typeof message ===
          "string"
          ? message
          : "Failed to submit review.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ==========================================================
     DELETE REVIEW
  ========================================================== */

  async function handleDelete() {
    if (!review) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this review?",
      );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      await deleteReview(
        review.id,
      );

      setReview(null);

      setRating(0);

      setComment("");

      setHoveredRating(0);

      setIsEditing(false);

      toast.success(
        "Review deleted successfully.",
      );
    } catch (error: any) {
      console.error(
        "REVIEW DELETE ERROR:",
        error?.response?.data ??
          error,
      );

      const message =
        error?.response?.data
          ?.message ??
        error?.message ??
        "Failed to delete review.";

      toast.error(
        typeof message ===
          "string"
          ? message
          : "Failed to delete review.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  /* ==========================================================
     LOADING
  ========================================================== */

  if (isLoadingReview) {
    return (
      <section className="mt-8 overflow-hidden rounded-3xl border border-border/70 bg-background shadow-sm">
        <div className="flex min-h-48 items-center justify-center p-7">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-primary" />

            Checking your review...
          </div>
        </div>
      </section>
    );
  }

  /* ==========================================================
     EXISTING REVIEW VIEW
  ========================================================== */

  if (
    review &&
    !isEditing
  ) {
    return (
      <section className="mt-8 overflow-hidden rounded-3xl border border-border/70 bg-background shadow-sm">
        {/* Header */}

        <div className="border-b border-border/60 bg-muted/20 px-6 py-5 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <MessageSquareText className="size-5" />
              </div>

              <div>
                <h2 className="text-lg font-bold tracking-tight">
                  Your review
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Thank you for sharing your
                  experience.
                </p>
              </div>
            </div>

            <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
          </div>
        </div>

        {/* Content */}

        <div className="p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Rating */}

            <div className="flex items-center gap-1">
              {Array.from({
                length: 5,
              }).map(
                (_, index) => {
                  const starNumber =
                    index + 1;

                  return (
                    <Star
                      key={
                        starNumber
                      }
                      className={`size-5 ${
                        starNumber <=
                        Number(
                          review.rating,
                        )
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  );
                },
              )}

              <span className="ml-2 text-sm font-semibold">
                {Number(
                  review.rating,
                )}
                /5
              </span>
            </div>

            {/* Actions */}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={
                  handleStartEditing
                }
                disabled={
                  isDeleting
                }
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-xs font-semibold transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Pencil className="size-3.5" />

                Edit
              </button>

              <button
                type="button"
                onClick={
                  handleDelete
                }
                disabled={
                  isDeleting
                }
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-destructive/20 px-3 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}

                Delete
              </button>
            </div>
          </div>

          {/* Comment */}

          {review.comment && (
            <div className="mt-5 rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-sm leading-7 text-muted-foreground">
                &ldquo;
                {
                  review.comment
                }
                &rdquo;
              </p>
            </div>
          )}

          {/* Date */}

          {review.createdAt && (
            <p className="mt-4 text-[11px] text-muted-foreground">
              Reviewed on{" "}
              {new Date(
                review.createdAt,
              ).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month:
                    "long",
                  day: "numeric",
                },
              )}
            </p>
          )}
        </div>
      </section>
    );
  }

  /* ==========================================================
     REVIEW FORM
  ========================================================== */

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-border/70 bg-background shadow-sm">
      {/* Header */}

      <div className="border-b border-border/60 bg-muted/20 px-6 py-5 sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Star className="size-5 fill-current" />
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight">
                {isEditing
                  ? "Edit your review"
                  : "Rate your experience"}
              </h2>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {isEditing
                  ? "Update your rating or feedback."
                  : "How was your experience with this service?"}
              </p>
            </div>
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={
                handleCancelEditing
              }
              disabled={
                isSubmitting
              }
              aria-label="Cancel editing"
              className="flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted disabled:opacity-50"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Body */}

      <div className="p-6 sm:p-7">
        {/* ====================================================
            RATING
        ==================================================== */}

        <div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">
                Your rating
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Select from 1 to 5 stars.
              </p>
            </div>

            {rating > 0 && (
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                {rating}/5
              </span>
            )}
          </div>

          <div
            className="mt-4 flex items-center gap-2"
            onMouseLeave={() =>
              setHoveredRating(0)
            }
          >
            {Array.from({
              length: 5,
            }).map(
              (_, index) => {
                const starNumber =
                  index + 1;

                return (
                  <button
                    key={
                      starNumber
                    }
                    type="button"
                    disabled={
                      isSubmitting ||
                      isDeleting
                    }
                    aria-label={`Rate ${starNumber} out of 5`}
                    onMouseEnter={() =>
                      setHoveredRating(
                        starNumber,
                      )
                    }
                    onFocus={() =>
                      setHoveredRating(
                        starNumber,
                      )
                    }
                    onBlur={() =>
                      setHoveredRating(
                        0,
                      )
                    }
                    onClick={() =>
                      setRating(
                        starNumber,
                      )
                    }
                    className="rounded-md p-1 transition-transform duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Star
                      className={`size-8 transition-colors ${
                        starNumber <=
                        displayedRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/25"
                      }`}
                    />
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* ====================================================
            COMMENT
        ==================================================== */}

        <div className="mt-7">
          <div>
            <p className="text-sm font-semibold">
              Your feedback
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                Optional
              </span>
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Tell others about your experience.
            </p>
          </div>

          <div className="mt-4">
            <textarea
              value={comment}
              onChange={(
                event,
              ) =>
                setComment(
                  event.target
                    .value,
                )
              }
              disabled={
                isSubmitting ||
                isDeleting
              }
              maxLength={1000}
              rows={5}
              placeholder="Share your experience with this service and technician..."
              className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-6 outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <div className="mt-1 flex justify-end">
              <span className="text-[10px] text-muted-foreground">
                {
                  comment.length
                }
                /1000
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================
            BUTTONS
        ==================================================== */}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          {isEditing && (
            <button
              type="button"
              onClick={
                handleCancelEditing
              }
              disabled={
                isSubmitting
              }
              className="h-11 rounded-xl border border-border px-5 text-sm font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={
              handleSubmit
            }
            disabled={
              !canSubmit
            }
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-all ${
              canSubmit
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:bg-primary/90"
                : "cursor-not-allowed bg-muted text-muted-foreground"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />

                {isEditing
                  ? "Updating..."
                  : "Submitting..."}
              </>
            ) : (
              <>
                {isEditing ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <Send className="size-4" />
                )}

                {isEditing
                  ? "Update Review"
                  : "Submit Review"}
              </>
            )}
          </button>
        </div>

        {/* Footer */}

        <p className="mt-4 text-center text-[11px] leading-5 text-muted-foreground">
          Your review helps other customers choose
          reliable professionals.
        </p>
      </div>
    </section>
  );
}
