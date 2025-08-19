"use client";

import * as React from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import { useTranslation } from "@/shared-fe/i18n/useTranslation";

import HeaderBreadcrumbs from "@/components/general/header-breadcrumbs";
import RequireAuth from "@/components/auth/require-auth";
import { ColorModeContext } from "@/shared-fe/theme/theme-provider";
import { useAuth } from "@/shared-fe/hooks/useAuth";

type Density = "compact" | "standard" | "comfortable";

type SettingsState = {
  themeMode: "light" | "dark";
  language: "en" | "ar";
  gridDensity: Density;
  notifications: {
    email: boolean;
    desktop: boolean;
  };
};

const LS_SETTINGS_KEY = "app.settings";

function loadSettings(): Partial<SettingsState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_SETTINGS_KEY);
    return raw ? (JSON.parse(raw) as SettingsState) : null;
  } catch {
    return null;
  }
}

export default function SettingsPage() {
  const { t, locale, setLocale } = useTranslation();
  const colorCtx = React.useContext(ColorModeContext);
  const { user, logout } = useAuth();

  const stored = loadSettings();
  const [state, setState] = React.useState<SettingsState>(() => ({
    themeMode: stored?.themeMode ?? colorCtx.mode,
    language: stored?.language ?? (locale as "en" | "ar"),
    gridDensity: stored?.gridDensity ?? "standard",
    notifications: {
      email: stored?.notifications?.email ?? true,
      desktop: stored?.notifications?.desktop ?? false,
    },
  }));

  const [toast, setToast] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (state.language !== locale) setLocale(state.language);
  }, [state.language, locale, setLocale]);

  React.useEffect(() => {
    if (state.themeMode !== colorCtx.mode) {
      colorCtx.toggle();
    }
  }, [state.themeMode]);

  const handleRequestDesktop = async () => {
    if (!("Notification" in window)) {
      setError(t("settings.notifications.unsupported"));
      return;
    }
    try {
      const p = await Notification.requestPermission();
      const granted = p === "granted";
      setState((s) => ({
        ...s,
        notifications: { ...s.notifications, desktop: granted },
      }));
      setToast(
        granted
          ? t("settings.notifications.enabled")
          : t("settings.notifications.denied")
      );
    } catch {
      setError(t("settings.notifications.error"));
    }
  };

  return (
    <RequireAuth>
      <Box>
        <HeaderBreadcrumbs
          title={t("page.settings.title")}
          links={[
            { name: t("nav.dashboard"), href: "/dashboard" },
            { name: t("nav.settings") },
          ]}
        />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                {t("settings.preferences")}
              </Typography>

              <Stack spacing={2}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography variant="body1">
                      {t("settings.theme")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t("settings.theme.desc")}
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={state.themeMode === "dark"}
                        onChange={(e) =>
                          setState((s) => ({
                            ...s,
                            themeMode: e.target.checked ? "dark" : "light",
                          }))
                        }
                      />
                    }
                    label={
                      state.themeMode === "dark"
                        ? t("settings.dark")
                        : t("settings.light")
                    }
                    sx={{ m: 0 }}
                  />
                </Stack>

                <Divider />

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box sx={{ pr: 2, flex: 1 }}>
                    <Typography variant="body1">
                      {t("settings.language")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t("settings.language.desc")}
                    </Typography>
                  </Box>
                  <TextField
                    select
                    size="small"
                    value={state.language}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        language: e.target.value as "en" | "ar",
                      }))
                    }
                    sx={{ minWidth: 180 }}
                    aria-label={t("settings.language")}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="ar">العربية</MenuItem>
                  </TextField>
                </Stack>

                <Divider />

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box sx={{ pr: 2, flex: 1 }}>
                    <Typography variant="body1">
                      {t("settings.density")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t("settings.density.desc")}
                    </Typography>
                  </Box>
                  <TextField
                    select
                    size="small"
                    value={state.gridDensity}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        gridDensity: e.target.value as Density,
                      }))
                    }
                    sx={{ minWidth: 180 }}
                    aria-label={t("settings.density")}
                  >
                    <MenuItem value="compact">
                      {t("settings.density.compact")}
                    </MenuItem>
                    <MenuItem value="standard">
                      {t("settings.density.standard")}
                    </MenuItem>
                    <MenuItem value="comfortable">
                      {t("settings.density.comfortable")}
                    </MenuItem>
                  </TextField>
                </Stack>

                <Divider />

                <Stack gap={1}>
                  <Typography variant="body1">
                    {t("settings.notifications.title")}
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={state.notifications.email}
                        onChange={(e) =>
                          setState((s) => ({
                            ...s,
                            notifications: {
                              ...s.notifications,
                              email: e.target.checked,
                            },
                          }))
                        }
                      />
                    }
                    label={t("settings.notifications.email")}
                  />

                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={state.notifications.desktop}
                          onChange={() => handleRequestDesktop()}
                        />
                      }
                      label={t("settings.notifications.desktop")}
                    />
                    <Button size="small" onClick={handleRequestDesktop}>
                      {t("settings.notifications.permission")}
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                {t("settings.account")}
              </Typography>

              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  {t("settings.loggedInAs")}
                </Typography>
                <Typography variant="body1">
                  {user?.name} {user?.email ? `• ${user.email}` : ""}
                </Typography>

                <Stack direction="row" gap={1} sx={{ mt: 2 }}>
                  <Button
                    component={Link}
                    href="/profile"
                    variant="outlined"
                    size="small"
                  >
                    {t("nav.profile")}
                  </Button>
                  <Button
                    component={Link}
                    href="/dashboard"
                    variant="outlined"
                    size="small"
                  >
                    {t("nav.dashboard")}
                  </Button>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="error">
                  {t("settings.danger")}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t("settings.danger.desc")}
                </Typography>
                <Stack direction="row" gap={1} sx={{ mt: 1 }}>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => logout()}
                  >
                    {t("nav.logout")}
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Snackbar
          open={Boolean(toast)}
          autoHideDuration={2400}
          onClose={() => setToast(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setToast(null)}
            severity="success"
            variant="filled"
          >
            {toast}
          </Alert>
        </Snackbar>

        <Snackbar
          open={Boolean(error)}
          autoHideDuration={2400}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setError(null)}
            severity="error"
            variant="filled"
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </RequireAuth>
  );
}
