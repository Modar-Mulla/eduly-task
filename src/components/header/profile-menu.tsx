"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Avatar,
  Box,
  ButtonBase,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  Button,
} from "@mui/material";
import { Logout, Person, Settings, Login } from "@mui/icons-material";
import { useTranslation } from "@/shared-fe/i18n/useTranslation";
import { useAuth } from "@/shared-fe/hooks/useAuth";

type User = {
  name: string;
  email?: string;
  avatarUrl?: string;
};

type ProfileMenuProps = {
  user?: User | null;
  onLogout?: () => void | Promise<void>;
};

export default function ProfileMenu({
  user: userProp,
  onLogout,
}: ProfileMenuProps) {
  const { t } = useTranslation();
  const { user: authUser, logout, isHydrated } = useAuth();
  const pathname = usePathname();

  const user = authUser ?? userProp ?? null;

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "profile-menu" : undefined;

  const handleOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleClose();
    try {
      if (onLogout) {
        await onLogout();
      } else {
        await logout();
      }
    } catch {}
  };

  if (!isHydrated) {
    return <Box sx={{ width: 120, height: 36 }} aria-hidden />;
  }

  if (!user) {
    const next = encodeURIComponent(pathname || "/");
    return (
      <Button
        component={Link}
        href={`/login?next=${next}`}
        variant="outlined"
        size="small"
        startIcon={<Login fontSize="small" />}
        aria-label={t("auth.login")}
      >
        {t("auth.login")}
      </Button>
    );
  }

  const initials = getInitials(user.name);

  return (
    <>
      <Tooltip title={t("nav.account") ?? "Account"}>
        <ButtonBase
          aria-controls={id}
          aria-haspopup="menu"
          aria-expanded={open ? "true" : undefined}
          onClick={handleOpen}
          sx={{
            borderRadius: 999,
            px: 1,
            py: 0.5,
            gap: 1,
            display: "flex",
            alignItems: "center",
            "&:focus-visible": {
              outline: (theme) => `2px solid ${theme.palette.primary.main}`,
              outlineOffset: 2,
            },
          }}
        >
          <Avatar alt={user.name} sx={{ width: 28, height: 28 }}>
            {initials}
          </Avatar>

          <Typography
            variant="body2"
            sx={{ display: { xs: "none", md: "inline-block" } }}
          >
            {user.name}
          </Typography>
        </ButtonBase>
      </Tooltip>

      <Menu
        id={id}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { elevation: 3 } }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Stack spacing={0.25}>
            <Typography variant="subtitle2">{user.name}</Typography>
            {user.email ? (
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            ) : null}
          </Stack>
        </Box>
        <Divider />

        <MenuItem
          component={Link}
          href="/profile"
          onClick={handleClose}
          aria-label={t("nav.profile")}
        >
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          {t("nav.profile")}
        </MenuItem>

        <MenuItem
          component={Link}
          href="/settings"
          onClick={handleClose}
          aria-label={t("nav.settings")}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          {t("nav.settings")}
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout} aria-label={t("nav.logout")}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {t("nav.logout")}
        </MenuItem>
      </Menu>
    </>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}
