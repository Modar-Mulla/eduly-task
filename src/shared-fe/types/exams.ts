import { z } from "zod";

export const ExamStatus = z.enum(["Scheduled", "In Progress", "Completed"]);

export const ExamDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  subject: z.string(),
  startsAt: z.string(),
  durationMin: z.number().int().positive(),
  totalStudents: z.number().int().nonnegative(),
  totalQuestions: z.number().int().positive(),
  completedCount: z.number().int().nonnegative(),
  avgScore: z.number().min(0).max(100),
  status: ExamStatus,
});

export type ExamDto = z.infer<typeof ExamDtoSchema>;

export const ExamsResponseSchema = z.object({
  updatedAt: z.string(),
  exams: z.array(ExamDtoSchema),
});

export type ExamsResponse = z.infer<typeof ExamsResponseSchema>;
