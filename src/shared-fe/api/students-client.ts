import { StudentsResponseSchema, type StudentsResponse } from "@/shared-fe/types/students";

export type StudentsQuery = {
  q?: string;
  status?: "Not Started" | "In Progress" | "Completed";
};

export async function fetchStudents(query: StudentsQuery = {}, signal?: AbortSignal): Promise<StudentsResponse> {
  const qs = new URLSearchParams();
  if (query.q) qs.set("q", query.q);
  if (query.status) qs.set("status", query.status);
  const res = await fetch(`/api/students?${qs.toString()}`, { cache: "no-store", signal });
  if (!res.ok) throw new Error(`students ${res.status}`);
  const json = await res.json();
  return StudentsResponseSchema.parse(json);
}
