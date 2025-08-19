"use client";

import * as React from "react";
import {
  Box,
  Chip,
  Stack,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import { useTranslation } from "@/shared-fe/i18n/useTranslation";
import type { ExamDto } from "@/shared-fe/types/exams";
import { fetchExams, type ExamsQuery } from "@/shared-fe/api/exams-client";
import ExamDetailDrawer from "./exam-detail-drawer";

const STATUS = ["All", "Scheduled", "In Progress", "Completed"] as const;

export default function ExamsTable() {
  const { t } = useTranslation();
  const [rows, setRows] = React.useState<ExamDto[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<typeof STATUS[number]>("All");
  const [pageSize, setPageSize] = React.useState(10);

  const [selected, setSelected] = React.useState<ExamDto | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);


  const controllerRef = React.useRef<AbortController | null>(null);

  const load = React.useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      try {
        const query: ExamsQuery = {
          q: q || undefined,
          status:
            status !== "All"
              ? (status as "Scheduled" | "In Progress" | "Completed")
              : undefined,
        };
        const data = await fetchExams(query, signal);
        if (!signal?.aborted) setRows(data.exams);
      } catch (err: any) {
      
        if (err?.name !== "AbortError") {
           console.error(err);
        }
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [q, status]
  );

  React.useEffect(() => {
    controllerRef.current?.abort();

    const ctrl = new AbortController();
    controllerRef.current = ctrl;

    void load(ctrl.signal);

    
    return () => {
      if (!ctrl.signal.aborted) ctrl.abort();
    };
  }, [load]);

  
  React.useEffect(() => {
    const id = setInterval(() => {
      controllerRef.current?.abort();
      const ctrl = new AbortController();
      controllerRef.current = ctrl;
      void load(ctrl.signal);
    }, 5000);
    return () => clearInterval(id);
  }, [load]);

  const fmtPct = (n: unknown) =>
    typeof n === "number" && Number.isFinite(n) ? `${Math.round(n)}%` : "—";

  const columns = React.useMemo<GridColDef<ExamDto>[]>(
    () => [
      { field: "title", headerName: t("exams.title"), flex: 1, minWidth: 180 },
      {
        field: "subject",
        headerName: t("exams.subject"),
        minWidth: 140,
        flex: 0.6,
      },
      {
        field: "startsAt",
        headerName: t("exams.startsAt"),
        minWidth: 200,
        type: "dateTime",
        
        valueGetter: (value) => (value ? new Date(String(value)) : null),
      },
      {
        field: "totalStudents",
        headerName: t("exams.students"),
        type: "number",
        minWidth: 120,
      },
      {
        field: "totalQuestions",
        headerName: t("exams.questions"),
        type: "number",
        minWidth: 130,
      },
      {
        field: "completedPct",
        headerName: t("exams.completed"),
        minWidth: 140,
        type: "number",
        valueGetter: (_value, row) => {
          const total = row.totalStudents ?? 0;
          const done = row.completedCount ?? 0;
          return total ? Math.round((done / total) * 100) : 0;
        },
        valueFormatter: (value) => fmtPct(value as number),
        sortComparator: (a?: number, b?: number) => (a ?? -1) - (b ?? -1),
      },
      {
        field: "avgScore",
        headerName: t("exams.avgScore"),
        minWidth: 120,
        type: "number",
        valueGetter: (value) =>
          typeof value === "number" ? value : Number(value ?? NaN),
        valueFormatter: (value) => fmtPct(value as number),
      },
      {
        field: "status",
        headerName: t("grid.status"),
        minWidth: 150,
        type: "singleSelect",
        valueOptions: ["Scheduled", "In Progress", "Completed"],
        renderCell: (p) => {
          const s = p.value as ExamDto["status"] | undefined;
          const color =
            s === "Completed"
              ? "success"
              : s === "In Progress"
              ? "warning"
              : "default";
          return <Chip size="small" label={s ?? "—"} color={color as any} />;
        },
      },
    ],
    [t]
  );

  return (
    <Box>
      <Stack
        direction="row"
        gap={1.5}
        alignItems="center"
        sx={{ mb: 1.5 }}
        useFlexGap
        flexWrap="wrap"
      >
        <TextField
          size="small"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("exams.search")}
          aria-label={t("exams.search")}
        />
        <TextField
          select
          size="small"
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof STATUS[number])}
          sx={{ minWidth: 200 }}
          label={t("grid.status")}
        >
          {STATUS.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <Typography
          variant="caption"
          sx={{ ml: "auto" }}
          color="text.secondary"
        >
          {t("grid.live")} •
        </Typography>
      </Stack>

      <DataGrid
        rows={rows}
        getRowId={(r) => r.id}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 25]}
        paginationModel={{ page: 0, pageSize }}
        onPaginationModelChange={(m) => setPageSize(m.pageSize)}
        onRowClick={(p) => {
          setSelected(p.row);
          setDrawerOpen(true);
        }}
        sx={{ "& .MuiDataGrid-virtualScroller": { overflowX: "auto" } }}
      />

      <ExamDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        exam={selected}
      />
    </Box>
  );
}
