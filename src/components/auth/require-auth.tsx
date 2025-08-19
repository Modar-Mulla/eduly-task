"use client";

/**
 * RequireAuth
 * -----------
 * Client-side route guard for the Next.js App Router.
 * - If `user` is absent, redirects to `/login?next=<current-path>`.
 * - Shows a small spinner while the auth state is hydrating.
 * - Optional: pass `fallback` to customize the interim UI.
 *
 * Usage:
 * <RequireAuth>
 *   <ProtectedPage />
 * </RequireAuth>
 */

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "@/shared-fe/hooks/useAuth";

type RequireAuthProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
};

export default function RequireAuth({
  children,
  fallback,
  redirectTo = "/login",
}: RequireAuthProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!mounted) return;
    if (!user) {
      const next = encodeURIComponent(pathname || "/");
      router.replace(`${redirectTo}?next=${next}`);
    }
  }, [mounted, user, router, redirectTo, pathname]);

  if (!mounted) return <>{fallback ?? <CenteredSpinner />}</>;
  if (!user) return null; 

  return <>{children}</>;
}

function CenteredSpinner() {
  return (
    <Box sx={{ display: "grid", placeItems: "center", minHeight: "40vh" }}>
      <CircularProgress size={24} />
    </Box>
  );
}
