import api from "@/lib/axios";

import type { Review } from "@/types/review";

/* ============================================================
   PAYLOAD TYPES
============================================================ */

export interface CreateReviewPayload {
  bookingId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

/* ============================================================
   API RESPONSE
============================================================ */

interface ReviewApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/* ============================================================
   REVIEW API BASE PATH
============================================================ */

/*
 * IMPORTANT:
 *
 * Your project uses the /api/api/... route convention.
 *
 * Axios baseURL:
 * https://fixitnow-backend-gz17.onrender.com
 *
 * Backend route:
 * /api/api/reviews
 */

const REVIEW_BASE_URL = "/api/api/reviews";

/* ============================================================
   CREATE REVIEW
============================================================ */

export async function createReview(
  payload: CreateReviewPayload,
): Promise<Review> {
  if (!payload.bookingId?.trim()) {
    throw new Error("Booking ID is required.");
  }

  if (
    !Number.isFinite(payload.rating) ||
    payload.rating < 1 ||
    payload.rating > 5
  ) {
    throw new Error("Rating must be between 1 and 5.");
  }

  const body = {
    bookingId: payload.bookingId.trim(),
    rating: payload.rating,
    ...(payload.comment?.trim()
      ? {
          comment: payload.comment.trim(),
        }
      : {}),
  };

  const response = await api.post<
    ReviewApiResponse<Review>
  >(REVIEW_BASE_URL, body);

  if (!response.data?.success) {
    throw new Error(
      response.data?.message ||
        "Failed to create review.",
    );
  }

  if (!response.data.data) {
    throw new Error("Review was not returned by the server.");
  }

  return response.data.data;
}

/* ============================================================
   GET ALL REVIEWS
============================================================ */

export async function getReviews(
  params?: {
    technicianId?: string;
    bookingId?: string;
    rating?: number;
  },
): Promise<Review[]> {
  const cleanParams = {
    ...(params?.technicianId?.trim()
      ? {
          technicianId: params.technicianId.trim(),
        }
      : {}),

    ...(params?.bookingId?.trim()
      ? {
          bookingId: params.bookingId.trim(),
        }
      : {}),

    ...(params?.rating !== undefined
      ? {
          rating: params.rating,
        }
      : {}),
  };

  const response = await api.get<
    ReviewApiResponse<Review[]>
  >(REVIEW_BASE_URL, {
    params: cleanParams,
  });

  if (!response.data?.success) {
    throw new Error(
      response.data?.message ||
        "Failed to fetch reviews.",
    );
  }

  return Array.isArray(response.data.data)
    ? response.data.data
    : [];
}

/* ============================================================
   GET SINGLE REVIEW
============================================================ */

export async function getReview(
  id: string,
): Promise<Review> {
  if (!id?.trim()) {
    throw new Error("Review ID is required.");
  }

  const response = await api.get<
    ReviewApiResponse<Review>
  >(`${REVIEW_BASE_URL}/${id.trim()}`);

  if (!response.data?.success) {
    throw new Error(
      response.data?.message ||
        "Review not found.",
    );
  }

  if (!response.data.data) {
    throw new Error("Review not found.");
  }

  return response.data.data;
}

/* ============================================================
   GET REVIEW BY BOOKING
============================================================ */

export async function getReviewByBooking(
  bookingId: string,
): Promise<Review | null> {
  if (!bookingId?.trim()) {
    return null;
  }

  const response = await api.get<
    ReviewApiResponse<Review[]>
  >(REVIEW_BASE_URL, {
    params: {
      bookingId: bookingId.trim(),
    },
  });

  if (!response.data?.success) {
    throw new Error(
      response.data?.message ||
        "Failed to fetch booking review.",
    );
  }

  const reviews = Array.isArray(response.data.data)
    ? response.data.data
    : [];

  return reviews[0] ?? null;
}

/* ============================================================
   GET REVIEWS BY TECHNICIAN
============================================================ */

export async function getReviewsByTechnician(
  technicianId: string,
): Promise<Review[]> {
  if (!technicianId?.trim()) {
    return [];
  }

  return getReviews({
    technicianId: technicianId.trim(),
  });
}

/* ============================================================
   UPDATE REVIEW
============================================================ */

export async function updateReview(
  id: string,
  payload: UpdateReviewPayload,
): Promise<Review> {
  if (!id?.trim()) {
    throw new Error("Review ID is required.");
  }

  const body: UpdateReviewPayload = {};

  if (payload.rating !== undefined) {
    if (
      !Number.isFinite(payload.rating) ||
      payload.rating < 1 ||
      payload.rating > 5
    ) {
      throw new Error(
        "Rating must be between 1 and 5.",
      );
    }

    body.rating = payload.rating;
  }

  if (payload.comment !== undefined) {
    body.comment = payload.comment.trim();
  }

  if (
    body.rating === undefined &&
    body.comment === undefined
  ) {
    throw new Error(
      "At least one field is required to update the review.",
    );
  }

  const response = await api.patch<
    ReviewApiResponse<Review>
  >(
    `${REVIEW_BASE_URL}/${id.trim()}`,
    body,
  );

  if (!response.data?.success) {
    throw new Error(
      response.data?.message ||
        "Failed to update review.",
    );
  }

  if (!response.data.data) {
    throw new Error(
      "Updated review was not returned by the server.",
    );
  }

  return response.data.data;
}

/* ============================================================
   DELETE REVIEW
============================================================ */

export async function deleteReview(
  id: string,
): Promise<Review> {
  if (!id?.trim()) {
    throw new Error("Review ID is required.");
  }

  const response = await api.delete<
    ReviewApiResponse<Review>
  >(
    `${REVIEW_BASE_URL}/${id.trim()}`,
  );

  if (!response.data?.success) {
    throw new Error(
      response.data?.message ||
        "Failed to delete review.",
    );
  }

  if (!response.data.data) {
    throw new Error(
      "Deleted review was not returned by the server.",
    );
  }

  return response.data.data;
}
