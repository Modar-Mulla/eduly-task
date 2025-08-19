"use client";

import { alpha, createTheme, type Theme } from "@mui/material/styles";
import { gridClasses } from "@mui/x-data-grid";
import type {} from "@mui/x-data-grid/themeAugmentation";

type Mode = "light" | "dark";

const BRAND = { primary: "#ff0054", navy: "#04063e", white: "#ffffff" };

// Greys inspired by minimals.cc
const GREY = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#454F5B",
  800: "#212B36",
  900: "#161C24",
};

export function createMinimalsTheme(mode: Mode) {
  const isLight = mode === "light";

  return createTheme({
    cssVariables: true,
    palette: {
      mode,
      primary: { main: BRAND.primary, contrastText: BRAND.white },
      secondary: { main: BRAND.navy, contrastText: BRAND.white },
      // MUI accepts a grey scale object; casting keeps strict TS happy
      grey: GREY as any,
      background: {
        default: isLight ? GREY[100] : GREY[900],
        paper: isLight ? BRAND.white : GREY[800],
      },
      text: {
        primary: isLight ? GREY[800] : BRAND.white,
        secondary: isLight ? GREY[600] : GREY[400],
        disabled: isLight ? GREY[500] : GREY[600],
      },
      divider: isLight ? GREY[300] : alpha(BRAND.white, 0.1),
      action: {
        hover: alpha(BRAND.primary, isLight ? 0.04 : 0.06),
        selected: alpha(BRAND.primary, isLight ? 0.08 : 0.12),
        disabled: alpha(GREY[500], 0.38),
        disabledBackground: alpha(GREY[500], 0.12),
        focus: alpha(BRAND.primary, 0.24),
        active: isLight ? GREY[600] : GREY[300],
      },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily:
        'var(--font-roboto), Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      h6: { fontWeight: 700 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            borderRadius: 12,
            border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          }),
        },
      },
      MuiAppBar: {
        styleOverrides: {
          colorTransparent: ({ theme }: { theme: Theme }) => ({
            backgroundColor: alpha(
              theme.palette.mode === "light" ? BRAND.white : BRAND.navy,
              0.8
            ),
            backdropFilter: "saturate(180%) blur(6px)",
          }),
        },
      },
      MuiButton: {
        styleOverrides: {
          containedPrimary: ({ theme }: { theme: Theme }) => ({
            boxShadow: "none",
            ":hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.9),
            },
          }),
          outlinedPrimary: ({ theme }: { theme: Theme }) => ({
            borderColor: alpha(theme.palette.primary.main, 0.32),
            ":hover": {
              borderColor: theme.palette.primary.main,
              background: alpha(theme.palette.primary.main, 0.06),
            },
          }),
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          }),
        },
      },
      MuiLink: {
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            color: theme.palette.primary.main,
          }),
        },
      },
      // DataGrid to match the minimals look (header bg, borders, hover/selected)
      MuiDataGrid: {
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            [`& .${gridClasses.columnHeaders}`]: {
              backgroundColor: alpha(theme.palette.primary.main, 0.06),
              borderBottom: `1px solid ${alpha(
                theme.palette.primary.main,
                0.15
              )}`,
            },
            [`& .${gridClasses.row}`]: {
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              },
              "&.Mui-selected": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              },
            },
          }),
        },
      },
    },
  });
}
