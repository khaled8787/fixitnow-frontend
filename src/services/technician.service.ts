
import api from "@/lib/axios";

export interface TechnicianApiUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
  role: "TECHNICIAN";
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TechnicianApiService {
  id: string;
  title?: string;
  name?: string;
  description?: string | null;
  price?: string | number;
  image?: string | null;
}

export interface TechnicianApiResponse {
  id: string;
  userId: string;
  bio: string | null;
  experience: number;
  hourlyRate: string | number;
  location: string;
  isAvailable: boolean;
  user: TechnicianApiUser;
  services?: TechnicianApiService[];
  createdAt?: string;
  updatedAt?: string;
}

interface GetTechniciansParams {
  searchTerm?: string;
  location?: string;
  isAvailable?: boolean;
}

export async function getTechnicians(
  params?: GetTechniciansParams,
) {
  const response = await api.get(
    "/api/api/technicians",
    {
      params,
    },
  );

  return response.data;
}

export async function getTechnicianById(
  id: string,
) {
  const response = await api.get(
    `/api/api/technicians/${id}`,
  );

  return response.data;
}
