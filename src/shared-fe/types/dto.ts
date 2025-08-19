import { z } from "zod";

export const ExamStatusEnum = z.enum(["Not Started", "In Progress", "Completed"]);
export type ExamStatus = z.infer<typeof ExamStatusEnum>;

export const StudentDto = z.object({
  id: z.string(),
  name: z.string(),
  completed: z.number().int().nonnegative(),
  totalQuestions: z.number().int().positive(),
  avgTimeSec: z.number().nonnegative(),
  score: z.number().min(0).max(100),
  status: ExamStatusEnum,
});
export type StudentDto = z.infer<typeof StudentDto>;

export const ExamInfoDto = z.object({
  title: z.string(),
  subject: z.string(),
  dateISO: z.string(), 
  time24h: z.string(), 
  totalStudents: z.number().int().nonnegative(),
  totalQuestions: z.number().int().positive(),
});
export type ExamInfoDto = z.infer<typeof ExamInfoDto>;

export const LiveSnapshotDto = z.object({
  ts: z.number(),
  avgScore: z.number(),
  pctCompleted: z.number(),
  statusDist: z.object({
    "Not Started": z.number().int().nonnegative(),
    "In Progress": z.number().int().nonnegative(),
    "Completed": z.number().int().nonnegative(),
  }),
});
export type LiveSnapshotDto = z.infer<typeof LiveSnapshotDto>;

export const LiveStateDto = z.object({
  exam: ExamInfoDto,
  students: z.array(StudentDto),
  snapshot: LiveSnapshotDto,
});
export type LiveStateDto = z.infer<typeof LiveStateDto>;
