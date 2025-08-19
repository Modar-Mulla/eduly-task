"use client";

import * as React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { fetchLiveState } from "@/shared-fe/api/live-client";
import { usePolling } from "@/shared-fe/hooks/usePolling";
import { LiveStateDto, StudentDto } from "@/shared-fe/types/dto";
import StudentDetailDrawer from "./student-detail-drawer";
import { useTranslation } from "@/shared-fe/i18n/useTranslation";

export default function StudentGrid() {
  const { t } = useTranslation();
  const [state, setState] = React.useState<LiveStateDto | null>(null);
  const [selected, setSelected] = React.useState<StudentDto | null>(null);

  const load = React.useCallback(async () => {
    const data = await fetchLiveState();
    setState(data);
  }, []);
  React.useEffect(() => {
    load();
  }, [load]);
  usePolling(load, 3000, 5000);

  if (!state) return null;

  const rows = state.students;

  const columns = [
    {
      field: "name",
      headerName: t("grid.name"),
      flex: 1,
      minWidth: 140,
      sortable: true,
    },
    {
      field: "progress",
      headerName: t("grid.progress"),
      minWidth: 120,
      flex: 0.6,
      sortable: false,
      valueGetter: (_value, row) =>
        `${row.completed ?? 0}/${row.totalQuestions ?? 0}`,
    },
    {
      field: "avgTimeSec",
      headerName: t("grid.avgTime"),
      minWidth: 120,
      flex: 0.6,
      type: "number",
      valueGetter: (value) =>
        typeof value === "number" ? value : Number(value ?? NaN),
      valueFormatter: (value) =>
        typeof value === "number" && Number.isFinite(value)
          ? `${Math.round(value)}s`
          : "—",
      sortComparator: (a, b) =>
        (Number.isFinite(a as number) ? (a as number) : -Infinity) -
        (Number.isFinite(b as number) ? (b as number) : -Infinity),
    },
    {
      field: "score",
      headerName: t("grid.score"),
      minWidth: 110,
      flex: 0.5,
      type: "number",
      sortable: true,
      renderCell: (params) => <CellDelta value={Number(params.value) || 0} />,
    },
    {
      field: "status",
      headerName: t("grid.status"),
      minWidth: 140,
      flex: 0.8,
      sortable: true,
      type: "singleSelect",
      valueOptions: ["Not Started", "In Progress", "Completed"],
    },
  ] as GridColDef<StudentDto>[];

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {t("grid.students")}
      </Typography>

      <div data-testid="dashboard-table" style={{ height: 420, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(r) => r.id}
          loading={!state}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10]}
          initialState={{
            sorting: { sortModel: [{ field: "score", sort: "desc" }] },
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          onRowClick={(p) => setSelected(p.row)}
        />
      </div>

      <StudentDetailDrawer
        open={Boolean(selected)}
        student={selected}
        onClose={() => setSelected(null)}
      />
    </Box>
  );
}

function CellDelta({ value }: { value: number }) {
  const [flash, setFlash] = React.useState(false);
  const prev = React.useRef(value);
  React.useEffect(() => {
    if (prev.current !== value) {
      setFlash(true);
      const id = setTimeout(() => setFlash(false), 400);
      prev.current = value;
      return () => clearTimeout(id);
    }
  }, [value]);
  return (
    <Stack
      sx={{
        px: 1,
        py: 0.5,
        borderRadius: 1,
        bgcolor: flash ? "action.selected" : "transparent",
        transition: "background-color .3s ease",
      }}
      direction="row"
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      <Typography component="span">{value}</Typography>
    </Stack>
  );
}
