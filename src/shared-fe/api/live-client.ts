"use client";

import { LiveStateDto } from "@/shared-fe/types/dto";

export async function fetchLiveState(signal?: AbortSignal) {
  const res = await fetch("/api/live", { method: "GET", signal, cache: "no-store" });
  if (!res.ok) throw new Error(`Live API ${res.status}`);
  const json = await res.json();
  const parsed = LiveStateDto.parse(json);
  return parsed;
}
