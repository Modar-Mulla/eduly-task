"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { AppBar, Box, IconButton, Toolbar, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { usePathname } from "next/navigation";

import { useTranslation } from "@/shared-fe/i18n/useTranslation";
import { DRAWER_WIDTH } from "@/shared-fe/nav/nav-config";
import ModeToggle from "@/shared-fe/theme/mode-toggle";
import ProfileMenu from "@/components/header/profile-menu";
import Sidebar from "@/components/nav/sidebar";
import { useAuth } from "@/shared-fe/hooks/useAuth";
import LanguageSwitcher from "../header/language-switcher";

export default function Chrome({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const pathname = usePathname();


  const { user, isHydrated } = useAuth();

 
  const [navOpen, setNavOpen] = React.useState(false);
  React.useEffect(() => setNavOpen(mdUp), [mdUp]);
  const toggleNav = () => setNavOpen((v) => !v);

  const logoSrc = "/logo.png";
  const mainOffset = navOpen && mdUp ? DRAWER_WIDTH : 0;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100dvh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >  
      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        sx={{ backdropFilter: "saturate(180%) blur(6px)" }}
      >
        <Toolbar sx={{ gap: 1 }}>
         
          <IconButton
            onClick={toggleNav}
            edge="start"
            aria-label={t("nav.open")}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>

         
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              flexGrow: 1,
            }}
          >
            <Link href="/dashboard" aria-label={t("nav.dashboard")}>
              <Box
                sx={{
                  position: "relative",
                  width: { xs: 120, sm: 160, md: 180 },
                  aspectRatio: "2048 / 648",
                }}
              >
                <Image
                  src={logoSrc}
                  alt="Eduly"
                  fill
                  priority
                  sizes="(max-width: 600px) 120px, (max-width: 900px) 160px, 180px"
                  style={{ objectFit: "contain" }}
                />
              </Box>
            </Link>
          </Box>

          <LanguageSwitcher/>
          <ModeToggle />

      
          {isHydrated ? (
            user ? (
              <ProfileMenu user={user} />
            ) : (
              <Button
                component={Link}
                href={`/login?next=${encodeURIComponent(pathname || "/")}`}
                variant="outlined"
                size="small"
                aria-label={t("auth.login")}
              >
                {t("auth.login")}
              </Button>
            )
          ) : (
           
            <Box sx={{ width: 88, height: 32 }} aria-hidden />
          )}
        </Toolbar>
      </AppBar>

      
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

  
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          ml: { md: `${mainOffset}px` },
          width: { md: `calc(100% - ${mainOffset}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
