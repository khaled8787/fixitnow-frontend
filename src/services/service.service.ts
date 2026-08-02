import api from "@/lib/axios";

export interface ServiceApiCategory {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
}

export interface ServiceApiTechnician {
  id: string;
  userId: string;
  bio?: string | null;
  experience: number;
  hourlyRate: string | number;
  location: string;
  isAvailable: boolean;

  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    image?: string | null;
  };
}

export interface ServiceApiResponse {
  id: string;
  title: string;
  description?: string | null;

  price: string | number;

  duration: number;

  isActive?: boolean;

  categoryId: string;

  technicianId?: string;

  category?: ServiceApiCategory;

  technician?: ServiceApiTechnician;

  createdAt?: string;

  updatedAt?: string;
}

export interface CreateServicePayload {
  categoryId: string;
  title: string;
  description: string;
  price: number;
  duration: number;
}

export interface UpdateServicePayload {
  categoryId?: string;
  title?: string;
  description?: string;
  price?: number;
  duration?: number;
  isActive?: boolean;
}

export interface GetServicesParams {
  searchTerm?: string;
  categoryId?: string;
  technicianId?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
}

/**
 * Get all services
 */
export async function getServices(
  params?: GetServicesParams,
) {
  const response = await api.get(
    "/api/api/services",
    {
      params,
    },
  );

  return response.data;
}

/**
 * Get single service
 */
export async function getServiceById(
  id: string,
) {
  const response = await api.get(
    `/api/api/services/${id}`,
  );

  return response.data;
}

/**
 * Create service
 * TECHNICIAN only
 */
export async function createService(
  payload: CreateServicePayload,
) {
  const response = await api.post(
    "/api/api/services",
    payload,
  );

  return response.data;
}

/**
 * Update service
 * TECHNICIAN only
 */
export async function updateService(
  id: string,
  payload: UpdateServicePayload,
) {
  const response = await api.patch(
    `/api/api/services/${id}`,
    payload,
  );

  return response.data;
}

/**
 * Delete service
 * TECHNICIAN only
 */
export async function deleteService(
  id: string,
) {
  const response = await api.delete(
    `/api/api/services/${id}`,
  );

  return response.data;
}