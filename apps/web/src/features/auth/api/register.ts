import { apiFetch } from "@/shared/api/http";
import type { RegisterInput } from "../validators/register.schema";

export type RegisterResponse = { id: string; name: string; email: string };

export async function registerApi(data: RegisterInput) {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    json: data,
  });
}
