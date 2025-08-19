import { NextRequest, NextResponse } from "next/server";
import {
  ProfileDtoSchema,
  ProfileUpdateDtoSchema,
  type ProfileDto,
} from "@/shared-fe/types/profile";

let current: ProfileDto = ProfileDtoSchema.parse({
  id: "me",
  name: "Mero",
  email: "mero@example.com",
  role: "Teacher",
  language: "en",
  avatarUrl: undefined,
  bio: "",
});

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function GET() {
  await delay(300 + Math.floor(Math.random() * 400));
  return NextResponse.json(current);
}

export async function PUT(req: NextRequest) {
  await delay(300 + Math.floor(Math.random() * 400));
  const body = await req.json().catch(() => ({}));
  const parsed = ProfileUpdateDtoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }
  current = ProfileDtoSchema.parse({ ...current, ...parsed.data });
  return NextResponse.json(current);
}
