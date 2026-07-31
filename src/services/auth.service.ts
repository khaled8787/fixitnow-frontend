import api from "@/lib/axios";
import { setAccessToken } from "@/lib/auth";
export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  image?: string;
  role: "CUSTOMER" | "TECHNICIAN";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function registerUser(
  payload: RegisterPayload,
) {
  const response = await api.post(
    "/api/api/auth/register",
    payload,
  );

  return response.data;
}

export async function loginUser(
  payload: LoginPayload,
) {
  const response = await api.post(
    "/api/api/auth/login",
    payload,
  );

  const accessToken =
    response.data?.data?.accessToken;

  if (accessToken) {
    setAccessToken(accessToken);
  }

  return response.data;
}