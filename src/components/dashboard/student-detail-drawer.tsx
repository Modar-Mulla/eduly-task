"use client";

import * as React from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import { StudentDto } from "@/shared-fe/types/dto";
import { useTranslation } from "@/shared-fe/i18n/useTranslation";

export default function StudentDetailDrawer({
  open,
  onClose,
  student,
}: {
  open: boolean;
  onClose: () => void;
  student: StudentDto | null;
}) {
  const { t } = useTranslation();
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ p: 2 }} role="dialog" aria-label={t("drawer.title")}>
        <Typography variant="h6">{t("drawer.title")}</Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {student?.name ?? "—"}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        {student ? (
          <Stack spacing={1.5}>
            <Row
              label={t("grid.status")}
              value={
                <Chip
                  size="small"
                  label={student.status}
                  color={chipColor(student.status)}
                />
              }
            />
            <Row
              label={t("grid.progress")}
              value={`${student.completed}/${student.totalQuestions}`}
            />
            <Row
              label={t("grid.avgTime")}
              value={`${Math.round(student.avgTimeSec)}s`}
            />
            <Row label={t("grid.score")} value={`${student.score}`} />
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2">{t("drawer.mock")}</Typography>
            <List dense disablePadding>
              <ListItem disableGutters>
                <ListItemText
                  primary={t("drawer.correct")}
                  secondary={Math.round(
                    (student.score / 100) * student.totalQuestions
                  )}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText
                  primary={t("drawer.flagged")}
                  secondary={Math.max(
                    0,
                    Math.round(
                      (student.totalQuestions - student.completed) * 0.1
                    )
                  )}
                />
              </ListItem>
            </List>
          </Stack>
        ) : (
          <Typography color="text.secondary">—</Typography>
        )}
      </Box>
    </Drawer>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" component="div">
        {value}
      </Typography>
    </Stack>
  );
}

function chipColor(status: string) {
  switch (status) {
    case "Completed":
      return "success";
    case "In Progress":
      return "warning";
    default:
      return "default";
  }
}
