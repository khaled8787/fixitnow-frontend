
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

  console.log("🔐 LOGIN RESPONSE:", response.data);

  const accessToken =
    response.data?.data?.accessToken ||
    response.data?.accessToken;

  if (!accessToken) {
    console.error(
      "❌ Access token not found in login response:",
      response.data,
    );

    throw new Error(
      "Access token was not returned by the server.",
    );
  }

  setAccessToken(accessToken);

  console.log("✅ Access token saved successfully");

  return response.data;
}
