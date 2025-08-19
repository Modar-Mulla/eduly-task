import { NextResponse } from "next/server";
import { advanceTick } from "@/services/live-domain";
import { LiveStateDto } from "@/shared-fe/types/dto";


const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function GET() {
 
  await wait(300 + Math.floor(Math.random() * 400));

  
  const raw = advanceTick();

  const parsed = LiveStateDto.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid live state", issues: parsed.error.issues },
      { status: 500 }
    );
  }
  return NextResponse.json(parsed.data, { status: 200 });
}
