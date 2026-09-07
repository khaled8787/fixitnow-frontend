export interface ReviewCustomer {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  phone?: string | null;
}

export interface ReviewTechnicianUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface ReviewTechnician {
  id: string;
  userId?: string;
  user?: ReviewTechnicianUser | null;
}

export interface ReviewService {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  image?: string | null;
  price?: number | string;
}

export interface ReviewCategory {
  id: string;
  name?: string;
  description?: string | null;
}

export interface ReviewBooking {
  id: string;

  service?: ReviewService | null;

  payment?: {
    id: string;
    status?: string;
    amount?: number | string;
    provider?: string;
    paidAt?: string | null;
  } | null;
}

export interface Review {
  id: string;

  bookingId: string;

  customerId: string;

  technicianId: string;

  rating: number;

  comment?: string | null;

  createdAt: string;

  updatedAt?: string;

  customer?: ReviewCustomer | null;

  technician?: ReviewTechnician | null;

  booking?: ReviewBooking | null;
}