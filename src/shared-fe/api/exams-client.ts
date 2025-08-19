import { ExamsResponseSchema, type ExamsResponse } from "@/shared-fe/types/exams";

export type ExamsQuery = {
  q?: string;
  status?: "Scheduled" | "In Progress" | "Completed";
};

export async function fetchExams(query: ExamsQuery = {}, signal?: AbortSignal): Promise<ExamsResponse> {
  const qs = new URLSearchParams();
  if (query.q) qs.set("q", query.q);
  if (query.status) qs.set("status", query.status);
  const res = await fetch(`/api/exams?${qs.toString()}`, { cache: "no-store", signal });
  if (!res.ok) throw new Error(`exams ${res.status}`);
  const json = await res.json();
  return ExamsResponseSchema.parse(json);
}
