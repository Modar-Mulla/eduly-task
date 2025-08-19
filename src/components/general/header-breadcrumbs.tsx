"use client";

import * as React from "react";
import Link from "next/link";
import { Breadcrumbs, Typography, Stack } from "@mui/material";

export default function HeaderBreadcrumbs({
  title,
  links,
  action,
}: {
  title: string;
  links: Array<{ name: string; href?: string }>;
  action?: React.ReactNode;
}) {
  return (
    <Stack spacing={1.5} sx={{ mb: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
        <Breadcrumbs aria-label="breadcrumbs">
          {links.map((l, i) =>
            l.href ? (
              <Typography
                key={i}
                component={Link}
                href={l.href}
                color="text.secondary"
                sx={{ textDecoration: "none", "&:hover": { color: "text.primary" } }}
              >
                {l.name}
              </Typography>
            ) : (
              <Typography key={i} color="text.primary">
                {l.name}
              </Typography>
            )
          )}
        </Breadcrumbs>
        {action}
      </Stack>
    </Stack>
  );
}
