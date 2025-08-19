import { z } from "zod";

export const StudentStatus = z.enum(["Not Started", "In Progress", "Completed"]);

export const StudentDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  completed: z.number().int().nonnegative(),
  totalQuestions: z.number().int().positive(),
  avgTimeSec: z.number().nonnegative(),
  score: z.number().int().min(0).max(100),
  status: StudentStatus,
});

export type StudentDto = z.infer<typeof StudentDtoSchema>;

export const StudentsResponseSchema = z.object({
  updatedAt: z.string(),
  students: z.array(StudentDtoSchema),
});

export type StudentsResponse = z.infer<typeof StudentsResponseSchema>;
