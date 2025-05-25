import { AppConfig } from "@/config/app-config";
// src/hooks/useApi.ts
export async function api<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
  url: string,
  body?: unknown
) {
    const res = await fetch(`${AppConfig.API_URL}${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      ...(method !== "DELETE" && body ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<T>;
  }
  