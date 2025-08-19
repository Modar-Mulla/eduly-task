"use client";

import * as React from "react";
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "@/shared-fe/i18n/useTranslation";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchor);

  return (
    <>
      <IconButton aria-label="Change language" onClick={(e) => setAnchor(e.currentTarget)}>
        <LanguageIcon />
      </IconButton>
      <Menu open={open} anchorEl={anchor} onClose={() => setAnchor(null)}>
        {[
          { code: "en", label: "English" },
          { code: "ar", label: "العربية" },
        ].map((opt) => (
          <MenuItem
            key={opt.code}
            selected={locale === (opt.code as any)}
            onClick={() => {
              setLocale(opt.code as any);
              setAnchor(null);
            }}
          >
            <ListItemIcon sx={{ minWidth: 28 }}>
              {locale === opt.code ? <CheckIcon fontSize="small" /> : null}
            </ListItemIcon>
            <ListItemText>{opt.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
