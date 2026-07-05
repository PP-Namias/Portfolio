import { NextResponse } from "next/server";
import { draftMode } from "next/headers";

export async function GET() {
  const draft = await draftMode();
  draft.disable();
  return NextResponse.json({ disabled: true });
}
