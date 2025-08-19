"use client";

import * as React from "react";
import { Box, Paper } from "@mui/material";

import { useTranslation } from "@/shared-fe/i18n/useTranslation"; // adjust if using I18nProvider
import HeaderBreadcrumbs from "@/components/general/header-breadcrumbs";
import ExamsTable from "@/components/exams/exams-table";

export default function page() {
  const { t } = useTranslation();
  return (
    <Box>
      <HeaderBreadcrumbs
        title={t("page.exams.title")}
        links={[
          { name: t("nav.dashboard"), href: "/dashboard" },
          { name: t("nav.exams") },
        ]}
      />
      <Paper sx={{ p: 2 }}>
        <ExamsTable />
      </Paper>
    </Box>
  );
}
