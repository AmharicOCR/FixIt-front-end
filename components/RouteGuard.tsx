"use client";
import { useAuth } from "@/hooks/useAuth";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export default function RouteGuard({ children, requireAdmin = false }: { children: ReactNode; requireAdmin?: boolean }) {
  const { authenticated, accountType, loading } = useAuth();

  // While loading, don't render anything (prevents flicker)
  if (loading) return null;

  // Not authenticated: show 404
  if (!authenticated) return notFound();

  // Admin required, but user isn't admin: show 404
  if (requireAdmin && !(accountType === "Super Admin" || accountType === "Moderator")) return notFound();

  // All good
  return <>{children}</>;
}