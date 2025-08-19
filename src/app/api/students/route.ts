import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { StudentDtoSchema, StudentStatus } from "@/shared-fe/types/students";

const QuerySchema = z.object({
  q: z.string().optional(),
  status: StudentStatus.optional(),
});

const BASE: Array<z.infer<typeof StudentDtoSchema>> = [
  { id: "1", name: "Alice Johnson", completed: 12, totalQuestions: 20, avgTimeSec: 18.2, score: 64, status: "In Progress" },
  { id: "2", name: "Ben Carter", completed: 20, totalQuestions: 20, avgTimeSec: 15.1, score: 88, status: "Completed" },
  { id: "3", name: "Carla Diaz", completed: 0, totalQuestions: 20, avgTimeSec: 0, score: 0, status: "Not Started" },
  { id: "4", name: "Deon Patel", completed: 7, totalQuestions: 20, avgTimeSec: 22.5, score: 41, status: "In Progress" },
  { id: "5", name: "Ella Zhang", completed: 19, totalQuestions: 20, avgTimeSec: 16.9, score: 82, status: "In Progress" },
];

export async function GET(req: NextRequest) {
  // artificial delay 300–700ms
  const delay = 300 + Math.floor(Math.random() * 400);
  await new Promise((r) => setTimeout(r, delay));

  const { searchParams } = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    q: searchParams.get("q") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Bad query" }, { status: 400 });
  }
  const { q, status } = parsed.data;

  const snap = BASE.map((s) => {
    const rand = (min: number, max: number) => Math.random() * (max - min) + min;
    let completed = s.completed;
    let score = s.score;
    let avgTimeSec = s.avgTimeSec;

    if (s.status === "In Progress" && completed < s.totalQuestions && Math.random() < 0.4) {
      completed = Math.min(s.totalQuestions, completed + 1);
      score = Math.max(0, Math.min(100, Math.round(score + rand(-2, 3))));
      avgTimeSec = Math.max(8, avgTimeSec + rand(-1.5, 1.2));
    }
    const newStatus: typeof s.status =
      completed >= s.totalQuestions ? "Completed" :
        completed === 0 ? "Not Started" : "In Progress";
    return { ...s, completed, score, avgTimeSec, status: newStatus };
  });

  let filtered = snap;
  if (q) {
    const qq = q.toLowerCase();
    filtered = filtered.filter((s) => s.name.toLowerCase().includes(qq));
  }
  if (status) {
    filtered = filtered.filter((s) => s.status === status);
  }

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    students: filtered,
  });
}
