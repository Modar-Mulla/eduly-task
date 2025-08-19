import {
  ProfileResponseSchema,
  type ProfileResponse,
  type ProfileUpdateDto,
} from "@/shared-fe/types/profile";

export async function fetchProfile(signal?: AbortSignal): Promise<ProfileResponse> {
  const res = await fetch("/api/profile", { cache: "no-store", signal });
  if (!res.ok) throw new Error(`profile ${res.status}`);
  const json = await res.json();
  return ProfileResponseSchema.parse(json);
}

export async function updateProfile(payload: ProfileUpdateDto, signal?: AbortSignal): Promise<ProfileResponse> {
  const res = await fetch("/api/profile", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
    signal,
  });
  if (!res.ok) throw new Error(`profile ${res.status}`);
  const json = await res.json();
  return ProfileResponseSchema.parse(json);
}
