import { headers } from "next/headers";
import { authClient } from "./auth-client";

export type Session = typeof authClient.$Infer.Session;

export async function getSession(): Promise<Session | null> {
  const requestHeader = await headers();

  const cookie = requestHeader.get("cookie") ?? "";

  const response = await fetch(
    `${process.env.PUBLIC_APP_URL ?? "http://localhost:3000"}/api/auth/get-session `,
    {
      headers: { cookie },
      cache: "no-store",
    },
  );

  if (!response) {
    return null;
  }

  const data = (await response.json()) as Session | null;

  return data?.user ? data : null;
}
