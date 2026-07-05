import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

const SANITY_REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET;

const TYPE_TO_TAG: Record<string, string> = {
  profile: "cms:profile",
  siteSettings: "cms:siteSettings",
  techStack: "cms:techStack",
  project: "cms:projects",
  experience: "cms:experiences",
  certification: "cms:certifications",
  education: "cms:education",
  socialLink: "cms:profile",
  testimonial: "cms:testimonials",
  award: "cms:awards",
  bookmark: "cms:bookmarks",
  post: "cms:posts",
  category: "cms:posts",
};

interface WebhookBody {
  _type?: string;
  _id?: string;
}

export async function POST(request: NextRequest) {
  if (!SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Missing secret" }, { status: 500 });
  }

  const body = (await request.json()) as WebhookBody;
  const secret = request.headers.get("x-sanity-secret");

  if (secret !== SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const { _type, _id } = body;

  if (_type && TYPE_TO_TAG[_type]) {
    revalidateTag(TYPE_TO_TAG[_type], "default");
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/projects");
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ revalidated: true, type: _type, id: _id });
}
