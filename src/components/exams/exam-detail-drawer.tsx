"use client";

import * as React from "react";
import {
  Box,
  Chip,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "@/shared-fe/i18n/useTranslation";
import type { ExamDto } from "@/shared-fe/types/exams";

export default function ExamDetailDrawer({
  open,
  onClose,
  exam,
}: {
  open: boolean;
  onClose: () => void;
  exam: ExamDto | null;
}) {
  const { t } = useTranslation();
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: { xs: "100%", sm: 420 } } } }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">{t("exams.detailTitle")}</Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {exam?.title ?? "—"}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        {exam ? (
          <Stack spacing={1.25}>
            <Row label={t("exams.subject")} value={exam.subject} />
            <Row
              label={t("exams.startsAt")}
              value={new Date(exam.startsAt).toLocaleString()}
            />
            <Row
              label={t("exams.duration")}
              value={`${exam.durationMin} min`}
            />
            <Row label={t("exams.students")} value={`${exam.totalStudents}`} />
            <Row
              label={t("exams.questions")}
              value={`${exam.totalQuestions}`}
            />
            <Row
              label={t("exams.completed")}
              value={`${Math.round(
                (exam.completedCount / Math.max(1, exam.totalStudents)) * 100
              )}%`}
            />
            <Row
              label={t("exams.avgScore")}
              value={`${Math.round(exam.avgScore)}%`}
            />
            <Row
              label={t("grid.status")}
              value={
                <Chip
                  size="small"
                  label={exam.status}
                  color={
                    exam.status === "Completed"
                      ? "success"
                      : exam.status === "In Progress"
                      ? "warning"
                      : "default"
                  }
                />
              }
            />
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2">{t("drawer.mock")}</Typography>
            <List dense disablePadding>
              <ListItem disableGutters>
                <ListItemText
                  primary={t("drawer.correct")}
                  secondary={Math.round(
                    (exam.avgScore / 100) * exam.totalQuestions
                  )}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText
                  primary={t("drawer.flagged")}
                  secondary={Math.round(0.05 * exam.totalQuestions)}
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
      <Box sx={{ typography: "body2" }}>{value}</Box>
    </Stack>
  );
}
