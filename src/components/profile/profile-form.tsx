"use client";

import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Stack,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Typography,
  Grid,
} from "@mui/material";

import { useTranslation } from "@/shared-fe/i18n/useTranslation";

import type { ProfileDto, ProfileUpdateDto } from "@/shared-fe/types/profile";
import { fetchProfile, updateProfile } from "@/shared-fe/api/profile-client";
import { useAuth } from "@/shared-fe/hooks/useAuth";

export default function ProfileForm() {
  const { t, locale, setLocale } = useTranslation();
  const { user, login } = useAuth();

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const [profile, setProfile] = React.useState<ProfileDto | null>(null);


  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [language, setLanguage] = React.useState<"en" | "ar">("en");
  const [bio, setBio] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>(
    undefined
  );

  React.useEffect(() => {
    (async () => {
      try {
        const p = await fetchProfile();
        setProfile(p);
        setName(p.name ?? "");
        setEmail(p.email ?? "");
        setLanguage((p.language as "en" | "ar") ?? "en");
        setBio(p.bio ?? "");
        setAvatarUrl(p.avatarUrl ?? undefined);
      } catch {
        setError(t("common.loadFailed") ?? "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [t]);

  const handleAvatarChange = async (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);
    try {
      const payload: ProfileUpdateDto = {
        name: name.trim(),
        email: email.trim() || undefined,
        language,
        bio: bio.trim() || undefined,
        avatarUrl, 
      };
      const updated = await updateProfile(payload);
      setProfile(updated);

     
      login(
        {
          id: user?.id ?? "me",
          name: updated.name,
          email: updated.email ?? undefined,
        },
        { persist: true }
      );

    
      if (language !== locale) setLocale(language);

      setToast(t("profile.saved"));
    } catch {
      setError(t("common.saveFailed") ?? "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t("common.loading")}
      </Typography>
    );
  }

  return (
    <>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      ) : null}

      <Box component="form" onSubmit={onSubmit} noValidate>
        <Grid container spacing={2}>
          {/* Left: avatar + bio */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2} alignItems="center" sx={{ py: 1 }}>
              <Avatar
                alt={name || "Avatar"}
                src={avatarUrl}
                sx={{ width: 96, height: 96, fontSize: 32 }}
              >
                {initials(name)}
              </Avatar>
              <Button component="label" variant="outlined" size="small">
                {t("profile.avatar.change")}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    handleAvatarChange(e.currentTarget.files?.[0] ?? null)
                  }
                />
              </Button>
              <TextField
                label={t("profile.bio")}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                multiline
                minRows={3}
                inputProps={{ maxLength: 280 }}
                fullWidth
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <Typography variant="subtitle2" color="text.secondary">
                {t("profile.account")}
              </Typography>
              <TextField
                label={t("profile.name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label={t("profile.email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                fullWidth
              />

              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {t("profile.preferences")}
              </Typography>
              <TextField
                select
                label={t("profile.language")}
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "ar")}
                sx={{ maxWidth: 240 }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ar">العربية</MenuItem>
              </TextField>

              <Stack direction="row" gap={1} sx={{ pt: 1 }}>
                <Button type="submit" variant="contained" disabled={saving}>
                  {t("profile.save")}
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Box>

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
    </>
  );
}

function initials(n: string) {
  const parts = n.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}
