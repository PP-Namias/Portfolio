import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { draftMode } from "next/headers";
import { client } from "@/sanity/lib/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const redirect = searchParams.get("redirect") || "/";

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const safeRedirect = redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";

  const token = process.env.SANITY_API_READ_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Missing SANITY_API_READ_TOKEN" }, { status: 500 });
  }

  const sanityClient = client.withConfig({
    token,
    perspective: "previewDrafts",
    useCdn: false,
  });

  try {
    await sanityClient.fetch("*[_type == 'profile'][0]._id");
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(safeRedirect, request.url));
}
