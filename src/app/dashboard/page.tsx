import { Suspense } from "react";
import { Grid, Paper, Skeleton, Stack } from "@mui/material";
import ExamOverview from "@/components/dashboard/exam-overview";
import StudentGrid from "@/components/dashboard/student-grid";

export default function DashboardPage() {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 12, lg: 6 }}>
        <Paper sx={{ p: 2 }}>
          <Suspense fallback={<Skeleton variant="rounded" height={420} />}>
            <ExamOverview />
          </Suspense>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 2 }}>
          <Suspense
            fallback={
              <Stack gap={1}>
                <Skeleton height={56} />
                <Skeleton height={320} />
              </Stack>
            }
          >
            <StudentGrid />
          </Suspense>
        </Paper>
      </Grid>
    </Grid>
  );
}
