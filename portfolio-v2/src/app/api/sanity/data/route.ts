import { NextResponse } from "next/server";
import { getCmsContent } from "@/sanity/lib/get-cms-content";
import { fallbackCmsContent } from "@/sanity/lib/fallback";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cms = await getCmsContent();
    const data = {
      ...fallbackCmsContent,
      ...Object.fromEntries(
        Object.entries(cms).filter(([, value]) => value !== null)
      ),
    };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(fallbackCmsContent);
  }
}
