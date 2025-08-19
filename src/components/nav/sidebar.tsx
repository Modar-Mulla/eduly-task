"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useTranslation } from "@/shared-fe/i18n/useTranslation";
import { DRAWER_WIDTH, NAV_ITEMS } from "@/shared-fe/nav/nav-config";

type Props = {
  open: boolean;
  onClose: () => void;
};

function NavList({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <List component="nav" aria-label={t("nav.main")}>
      {NAV_ITEMS.map(({ key, href, icon: Icon }) => {
        const selected = pathname?.startsWith(href) ?? false;
        return (
          <ListItemButton
            key={href}
            component={Link}
            href={href}
            selected={selected}
            onClick={onItemClick}
            sx={{ borderRadius: 1.5, mx: 1, my: 0.25 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t(key)} />
          </ListItemButton>
        );
      })}
    </List>
  );
}

export default function Sidebar({ open, onClose }: Props) {
  const { t } = useTranslation();

  const logoSrc = "/logo.png";

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ px: 1.5, gap: 1, justifyContent: "space-between" }}>
        <Box
          component={Link}
          href="/dashboard"
          aria-label={t("nav.dashboard")}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            textDecoration: "none",
            color: "text.primary",
          }}
        >
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
        </Box>

        <IconButton
          aria-label={t("nav.close")}
          onClick={onClose}
          size="small"
          edge="end"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Toolbar>

      <Divider />
      <Box sx={{ p: 1.5, flex: 1, overflow: "auto" }}>
        <NavList onItemClick={onClose} />
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        slotProps={{ paper: { sx: { width: DRAWER_WIDTH } } }}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="persistent"
        open={open}
        onClose={onClose}
        slotProps={{
          paper: { sx: { width: DRAWER_WIDTH, borderRightStyle: "solid" } },
        }}
        sx={{ display: { xs: "none", md: "block" } }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
