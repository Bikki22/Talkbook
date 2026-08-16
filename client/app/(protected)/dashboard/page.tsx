import { requireAuth } from "@/features/auth";
import React from "react";

export default async function DashboardPage() {
  const session = await requireAuth();

  return <DashboardHome username={session.user.name} />;
}
