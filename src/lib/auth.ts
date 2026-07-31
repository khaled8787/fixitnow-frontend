
import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "fixitnow_access_token";

export function setAccessToken(token: string) {
  Cookies.set(ACCESS_TOKEN_KEY, token, {
    expires: 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function getAccessToken() {
  return Cookies.get(ACCESS_TOKEN_KEY);
}

export function removeAccessToken() {
  Cookies.remove(ACCESS_TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}
