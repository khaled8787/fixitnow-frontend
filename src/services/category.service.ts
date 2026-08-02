import api from "@/lib/axios";

export interface CategoryApiResponse {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export async function getCategories(
  searchTerm?: string,
) {
  const response = await api.get(
    "/api/api/categories",
    {
      params: searchTerm
        ? { searchTerm }
        : undefined,
    },
  );

  return response.data;
}

export async function getCategoryById(
  id: string,
) {
  const response = await api.get(
    `/api/api/categories/${id}`,
  );

  return response.data;
}