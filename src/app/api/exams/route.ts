import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ExamDtoSchema, ExamStatus } from "@/shared-fe/types/exams";

const QuerySchema = z.object({
  q: z.string().optional(),
  status: ExamStatus.optional(),
});

const BASE = [
  {
    id: "e1",
    title: "Math Final 2025",
    subject: "Mathematics",
    startsAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), 
    durationMin: 90,
    totalStudents: 42,
    totalQuestions: 40,
    completedCount: 0,
    avgScore: 0,
    status: "Scheduled" as const,
  },
  {
    id: "e2",
    title: "Physics Midterm",
    subject: "Physics",
    startsAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    durationMin: 60,
    totalStudents: 30,
    totalQuestions: 30,
    completedCount: 12,
    avgScore: 58,
    status: "In Progress" as const,
  },
  {
    id: "e3",
    title: "History Quiz",
    subject: "History",
    startsAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    durationMin: 30,
    totalStudents: 18,
    totalQuestions: 15,
    completedCount: 18,
    avgScore: 76,
    status: "Completed" as const,
  },
];

export async function GET(req: NextRequest) {
  
  const delay = 300 + Math.floor(Math.random() * 400);
  await new Promise((r) => setTimeout(r, delay));

  const { searchParams } = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    q: searchParams.get("q") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: "Bad query" }, { status: 400 });

  const { q, status } = parsed.data;

 
  const snap = BASE.map((e) => {
    let completed = e.completedCount;
    let avg = e.avgScore;
    let st = e.status;

    if (e.status === "In Progress") {
      
      if (Math.random() < 0.6) {
        completed = Math.min(e.totalStudents, completed + Math.floor(Math.random() * 3));
        avg = Math.max(0, Math.min(100, Math.round(avg + (Math.random() * 6 - 3))));
      }
      if (completed >= e.totalStudents) {
        st = "Completed";
        avg = Math.max(0, Math.min(100, Math.round(avg)));
      }
    }
    if (e.status === "Scheduled") {
     
      if (new Date(e.startsAt).getTime() <= Date.now()) st = "In Progress";
    }

    return { ...e, completedCount: completed, avgScore: avg, status: st };
  });

  let filtered = snap;
  if (q) {
    const qq = q.toLowerCase();
    filtered = filtered.filter((e) => e.title.toLowerCase().includes(qq) || e.subject.toLowerCase().includes(qq));
  }
  if (status) filtered = filtered.filter((e) => e.status === status);

 
  filtered.forEach((e) => ExamDtoSchema.parse(e));

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    exams: filtered,
  });
}
