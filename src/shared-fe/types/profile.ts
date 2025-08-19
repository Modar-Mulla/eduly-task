import { z } from "zod";

export const ProfileDtoSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.email().optional().nullable(),
  role: z.enum(["Admin", "Teacher", "Proctor"]).default("Teacher"),
  language: z.enum(["en", "ar"]).default("en"),
  avatarUrl: z.url().optional().nullable(), 
  bio: z.string().max(280).optional().nullable(),
}).transform((p) => ({
  ...p,
  avatarUrl: p.avatarUrl ?? undefined,
  email: p.email ?? undefined,
  bio: p.bio ?? undefined,
}));
export type ProfileDto = z.infer<typeof ProfileDtoSchema>;

export const ProfileUpdateDtoSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email().optional(),
  language: z.enum(["en", "ar"]).optional(),
  avatarUrl: z.string().optional(), 
  bio: z.string().max(280).optional(),
});
export type ProfileUpdateDto = z.infer<typeof ProfileUpdateDtoSchema>;

export const ProfileResponseSchema = ProfileDtoSchema;
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;
