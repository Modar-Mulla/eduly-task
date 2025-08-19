// src/shared-fe/theme/ThemeProvider.tsx
"use client";

import * as React from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  alpha,
  darken,
  lighten,
} from "@mui/material";
import { useTranslation } from "../i18n/useTranslation";

type Mode = "light" | "dark";
export const ColorModeContext = React.createContext<{ mode: Mode; toggle: () => void }>({
  mode: "light",
  toggle: () => {},
});

const BRAND = { white: "#ffffff", accent: "#ff0054", navy: "#04063e" };

function buildTheme(mode: Mode, dir: "ltr" | "rtl", locale: "en" | "ar") {
  const isLight = mode === "light";
  const primary = BRAND.accent;
  const backgroundDefault = isLight ? BRAND.white : BRAND.navy;
  const backgroundPaper = isLight ? BRAND.white : lighten(BRAND.navy, 0.04);
  const textPrimary = isLight ? BRAND.navy : BRAND.white;
  const textSecondary = isLight ? alpha(BRAND.navy, 0.7) : alpha(BRAND.white, 0.72);

  const fontStack =
    locale === "ar"
      ? 'var(--font-cairo), var(--font-roboto), system-ui, -apple-system, "Segoe UI", Arial, sans-serif'
      : 'var(--font-roboto), system-ui, -apple-system, "Segoe UI", Arial, sans-serif';

  const base = createTheme({
    cssVariables: true,
    direction: dir, 
    palette: {
      mode,
      primary: { main: primary, contrastText: BRAND.white },
      secondary: { main: BRAND.navy, contrastText: BRAND.white },
      background: { default: backgroundDefault, paper: backgroundPaper },
      text: { primary: textPrimary, secondary: textSecondary },
      divider: isLight ? alpha(BRAND.navy, 0.12) : alpha(BRAND.white, 0.12),
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: fontStack,
      h6: { fontWeight: 700 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: `1px solid ${alpha(isLight ? BRAND.navy : BRAND.white, 0.08)}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          colorTransparent: {
            backgroundColor: alpha(isLight ? BRAND.white : BRAND.navy, 0.8),
            backdropFilter: "saturate(180%) blur(6px)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          containedPrimary: ({ theme }) => ({
            boxShadow: "none",
            ":hover": { backgroundColor: darken(theme.palette.primary.main, 0.08) },
          }),
          outlinedPrimary: ({ theme }) => ({
            borderColor: alpha(theme.palette.primary.main, 0.3),
            ":hover": {
              borderColor: theme.palette.primary.main,
              background: alpha(theme.palette.primary.main, 0.06),
            },
          }),
        },
      },
    },
  });

  return base;
}

export function RootThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<Mode>("light");
  const toggle = React.useCallback(() => setMode(m => (m === "light" ? "dark" : "light")), []);

  const { dir, locale } = useTranslation(); 

  const theme = React.useMemo(
    () => buildTheme(mode, dir, locale),
    [mode, dir, locale]
  );

  return (
    <ColorModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
