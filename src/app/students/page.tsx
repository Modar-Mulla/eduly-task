"use client";

import * as React from "react";
import { Box, Paper } from "@mui/material";
import { useTranslation } from "@/shared-fe/i18n/useTranslation";
import HeaderBreadcrumbs from "@/components/general/header-breadcrumbs";
import StudentsTable from "@/components/students/students-table";


export default function StudentsPage() {
  const { t } = useTranslation();
  return (
    <Box>
      <HeaderBreadcrumbs
        title={t("page.students.title")}
        links={[
          { name: t("nav.dashboard"), href: "/dashboard" },
          { name: t("nav.students") },
        ]}
      />
      <Paper sx={{ p: 2 }}>
        <StudentsTable />
      </Paper>
    </Box>
  );
}
