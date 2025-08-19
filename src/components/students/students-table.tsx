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

import StudentDetailDrawer from "@/components/dashboard/student-detail-drawer";
import { useTranslation } from "@/shared-fe/i18n/useTranslation";
import type { StudentDto } from "@/shared-fe/types/dto";
import {
  fetchStudents,
  type StudentsQuery,
} from "@/shared-fe/api/students-client";

const STATUS_OPTIONS = ["All", "Not Started", "In Progress", "Completed"] as const;

export default function StudentsTable() {
  const { t } = useTranslation();
  const [rows, setRows] = React.useState<StudentDto[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<(typeof STATUS_OPTIONS)[number]>("All");
  const [pageSize, setPageSize] = React.useState(10);

  const [selected, setSelected] = React.useState<StudentDto | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  
  const controllerRef = React.useRef<AbortController | null>(null);

  const load = React.useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      try {
        const q: StudentsQuery = {
          q: search || undefined,
          status: status !== "All" ? status : undefined,
        };
        const data = await fetchStudents(q, signal);
        if (!signal?.aborted) setRows(data.students);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          
        }
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [search, status]
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


  const columns: GridColDef<StudentDto>[] = [
    {
      field: "name",
      headerName: t("grid.name"),
      flex: 1,
      minWidth: 160,
      sortable: true,
    },
    {
      field: "progress",
      headerName: t("grid.progress"),
      minWidth: 140,
      sortable: false,
      valueGetter: (_value, row) =>
        `${row.completed ?? 0}/${row.totalQuestions ?? 0}`,
    },
    {
      field: "avgTimeSec",
      headerName: t("grid.avgTime"),
      minWidth: 140,
      type: "number",
      valueGetter: (value) =>
        typeof value === "number" ? value : Number(value ?? NaN),
      valueFormatter: (value) =>
        typeof value === "number" && Number.isFinite(value)
          ? `${Math.round(value)}s`
          : "—",
      sortable: true,
    },
    {
      field: "score",
      headerName: t("grid.score"),
      minWidth: 120,
      type: "number",
      valueGetter: (value) =>
        typeof value === "number" ? value : Number(value ?? NaN),
      valueFormatter: (value) =>
        typeof value === "number" && Number.isFinite(value) ? String(value) : "—",
      sortable: true,
    },
    {
      field: "status",
      headerName: t("grid.status"),
      minWidth: 150,
      type: "singleSelect",
      valueOptions: ["Not Started", "In Progress", "Completed"],
      renderCell: (params) => {
        const val = params.value as string | undefined;
        const color =
          val === "Completed"
            ? "success"
            : val === "In Progress"
            ? "warning"
            : "default";
        return <Chip size="small" label={val ?? "—"} color={color as any} />;
      },
      sortable: true,
    },
  ];

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("grid.search")}
          aria-label={t("grid.search")}
        />
        <TextField
          select
          size="small"
          value={status}
          onChange={(e) => setStatus(e.target.value as (typeof STATUS_OPTIONS)[number])}
          sx={{ minWidth: 180 }}
          label={t("grid.status")}
        >
          {STATUS_OPTIONS.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </TextField>
        <Typography variant="caption" sx={{ ml: "auto" }} color="text.secondary">
          {t("grid.live")} •
        </Typography>
      </Stack>

      <div aria-label={t("page.students.title")}>
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
      </div>

      <StudentDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        student={selected}
      />
    </Box>
  );
}
