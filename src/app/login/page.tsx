"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { z } from "zod";

import { useTranslation } from "@/shared-fe/i18n/useTranslation";
import { useAuth } from "@/shared-fe/hooks/useAuth";

const LoginSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email().optional().or(z.literal("")),
  remember: z.boolean().default(true),
});

export default function LoginPage() {
  const { login, user } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();

  const next = params.get("next") || "/dashboard";

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // If already logged in, bounce to next
  React.useEffect(() => {
    if (user) router.replace(next);
  }, [user, router, next]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = LoginSchema.safeParse({ name, email, remember });
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || "Invalid input";
      setError(msg);
      return;
    }

    setSubmitting(true);
    try {
      login(
        {
          id: "me",
          name: parsed.data.name.trim(),
          email: parsed.data.email || undefined,
        },
        { token: "mock-token", persist: parsed.data.remember }
      );
      router.replace(next);
    } catch (err) {
      setError("Failed to log in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{ display: "grid", placeItems: "center", minHeight: "80dvh", px: 2 }}
    >
      <Paper
        elevation={0}
        sx={(theme) => ({
          p: 3,
          width: 420,
          maxWidth: "100%",
          border: `1px solid ${theme.palette.divider}`,
        })}
      >
        <Stack component="form" onSubmit={onSubmit} spacing={2}>
          <Typography
            variant="h5"
            component="h1"
            data-testid="login-title"
            sx={{ mb: 2 }}
          >
            {t("auth.login")}
          </Typography>

          {error ? (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          ) : null}

          <TextField
            label={t("auth.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            autoComplete="name"
          />

          <TextField
            label={t("auth.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
            }
            label={t("auth.remember") ?? "Remember me"}
          />

          <Stack direction="row" gap={1} alignItems="center">
            <Button type="submit" variant="contained" disabled={submitting}>
              {t("auth.submit")}
            </Button>
            <Typography variant="caption" color="text.secondary">
              {t("auth.needAccount")}
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
