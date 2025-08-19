"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "@/shared-fe/i18n/useTranslation";

export default function page() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      <Paper
        elevation={0}
        sx={(theme) => ({
          p: { xs: 3, md: 4 },
          mb: 3,
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 3,
          border: `1px solid ${theme.palette.divider}`,
        })}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: 140, sm: 180 },
            aspectRatio: "2048/648",
          }}
        >
          <Image
            src={"/logo.png"}
            alt="Eduly"
            fill
            priority
            sizes="(max-width: 600px) 120px, (max-width: 900px) 160px, 180px"
            style={{ objectFit: "contain" }}
          />
        </Box>

        <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h4" fontWeight={700}>
            {t("home.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("home.subtitle")}
          </Typography>

          <Stack
            direction="row"
            spacing={1.5}
            sx={{ pt: 1 }}
            useFlexGap
            flexWrap="wrap"
          >
            <Button
              component={Link}
              href="/dashboard"
              variant="contained"
              color="primary"
            >
              {t("home.cta.dashboard")}
            </Button>
            <Button
              component={Link}
              href="/login"
              variant="outlined"
              color="primary"
            >
              {t("home.cta.login")}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Tile
            href="/students"
            title={t("nav.students")}
            desc={t("home.sections.students")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Tile
            href="/exams"
            title={t("nav.exams")}
            desc={t("home.sections.exams")}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Tile
            href="/settings"
            title={t("nav.settings")}
            desc={t("home.sections.settings")}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

function Tile({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Paper
      component={Link}
      href={href}
      elevation={0}
      sx={(theme) => ({
        display: "block",
        p: 2,
        height: "100%",
        textDecoration: "none",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        transition: "background-color .2s ease, transform .15s ease",
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
          transform: "translateY(-1px)",
        },
        "&:focus-visible": {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
      })}
    >
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {desc}
      </Typography>
    </Paper>
  );
}
