"use client";

import * as React from "react";
import { CardHeader, Divider, Stack, Typography, Chip } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { fetchLiveState } from "@/shared-fe/api/live-client";
import { usePolling } from "@/shared-fe/hooks/usePolling";
import { LiveStateDto } from "@/shared-fe/types/dto";
import { useTranslation } from "@/shared-fe/i18n/useTranslation";

export default function ExamOverview() {
  const { t } = useTranslation();
  const [state, setState] = React.useState<LiveStateDto | null>(null);

  const load = React.useCallback(async () => {
    const data = await fetchLiveState();
    setState(data);
  }, []);
  React.useEffect(() => {
    load();
  }, [load]);
  usePolling(load, 3000, 5000);

  if (!state) return null;

  const { exam, snapshot } = state;

  return (
    <Stack spacing={2} aria-live="polite" aria-label={t("a11y.live")}>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6">
              {t("exam.title")}: {exam.title}
            </Typography>
            <Chip
              size="small"
              label={`${t("exam.subject")}: ${exam.subject}`}
              color="primary"
            />
          </Stack>
        }
        subheader={`${t("exam.datetime")}: ${exam.dateISO} • ${exam.time24h}`}
      />
      <Divider />
      <Stack direction="row" spacing={3} flexWrap="wrap">
        <Stat label={t("exam.totalStudents")} value={exam.totalStudents} />
        <Stat label={t("exam.totalQuestions")} value={exam.totalQuestions} />
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Stack flex={1}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {t("charts.statusDist")}
          </Typography>
          <PieChart
            height={260}
            series={[
              {
                data: [
                  {
                    id: 0,
                    value: snapshot.statusDist["Not Started"],
                    label: t("status.notStarted"),
                  },
                  {
                    id: 1,
                    value: snapshot.statusDist["In Progress"],
                    label: t("status.inProgress"),
                  },
                  {
                    id: 2,
                    value: snapshot.statusDist["Completed"],
                    label: t("status.completed"),
                  },
                ],
                highlightScope: { fade: "global", highlight: "item" },
                faded: { innerRadius: 30, additionalRadius: -30 },
              },
            ]}
          />
        </Stack>

        <Stack flex={1}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {t("charts.liveAverages")}
          </Typography>
          <LineChart
            height={260}
            xAxis={[
              {
                data: [snapshot.ts - 12000, snapshot.ts - 6000, snapshot.ts],
                scaleType: "time",
              },
            ]}
            series={[
              {
                id: "avgScore",
                label: t("charts.avgScore"),
                data: [
                  snapshot.avgScore - 5,
                  snapshot.avgScore - 2,
                  snapshot.avgScore,
                ],
              },
              {
                id: "pctCompleted",
                label: t("charts.pctCompleted"),
                data: [
                  snapshot.pctCompleted - 5,
                  snapshot.pctCompleted - 2,
                  snapshot.pctCompleted,
                ],
              },
            ]}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack role="group" aria-label={label}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6">{value}</Typography>
    </Stack>
  );
}
