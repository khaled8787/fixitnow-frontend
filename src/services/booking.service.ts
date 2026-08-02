
import api from "@/lib/axios";

export interface CreateBookingPayload {
  serviceId: string;
  technicianId: string;
  bookingDate: string;
  bookingTime: string;
  address: string;
  notes?: string;
}

export interface UpdateBookingPayload {
  bookingDate?: string;
  bookingTime?: string;
  address?: string;
  notes?: string;
}

export async function createBooking(
  payload: CreateBookingPayload,
) {
  try {
    const response = await api.post(
      "/api/api/bookings",
      payload,
    );

    return response.data;
  } catch (error: any) {
  console.error("========== BOOKING ERROR ==========");
  console.error("Status:", error?.response?.status);
  console.error("Backend Response:", error?.response?.data);
  console.error(
    "Validation Details:",
    JSON.stringify(
      error?.response?.data?.errorDetails,
      null,
      2,
    ),
  );
  console.error("Payload Sent:", payload);
  console.error("===================================");

  throw error;
}
}

export async function getBookingById(
  bookingId: string,
) {
  const response = await api.get(
    `/api/api/bookings/${bookingId}`,
  );

  return response.data;
}

export async function updateBooking(
  bookingId: string,
  payload: UpdateBookingPayload,
) {
  const response = await api.patch(
    `/api/api/bookings/${bookingId}`,
    payload,
  );

  return response.data;
}

export async function cancelBooking(
  bookingId: string,
) {
  const response = await api.patch(
    `/api/api/bookings/${bookingId}/cancel`,
  );

  return response.data;
}
