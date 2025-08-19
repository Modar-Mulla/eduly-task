"use client";

import * as React from "react";
import { Avatar, Box, Paper, Skeleton, Stack, Typography } from "@mui/material";

import { useTranslation } from "@/shared-fe/i18n/useTranslation";
import HeaderBreadcrumbs from "@/components/general/header-breadcrumbs";
import ProfileForm from "@/components/profile/profile-form";
import RequireAuth from "@/components/auth/require-auth";
import { useAuth } from "@/shared-fe/hooks/useAuth";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, isHydrated } = useAuth();

  return (
    <RequireAuth>
      <Box>
        <HeaderBreadcrumbs
          title={t("page.profile.title")}
          links={[
            { name: t("nav.dashboard"), href: "/dashboard" },
            { name: t("nav.profile") },
          ]}
        />

        <Paper sx={{ p: 2 }}>
          {!isHydrated ? (
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Skeleton variant="circular" width={48} height={48} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width={180} height={24} />
                <Skeleton width={220} height={18} />
              </Box>
            </Stack>
          ) : (
            user && (
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Avatar sx={{ width: 48, height: 48 }}>
                  {initials(user.name)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">{user.name}</Typography>
                  {user.email ? (
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  ) : null}
                </Box>
              </Stack>
            )
          )}

          <ProfileForm />
        </Paper>
      </Box>
    </RequireAuth>
  );
}

function initials(n: string) {
  const p = n.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase();
}
