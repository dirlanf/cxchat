import { apiFetch } from "@/shared/api/http";
import type { LoginInput } from "../validators/login.schema";

export type LoginResponse = {
  access_token: string;
  user: { id: string; name: string; email: string };
};

export async function loginApi(data: LoginInput) {
  return apiFetch<LoginResponse>("/auth/login", {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    json: data,
  });
}
