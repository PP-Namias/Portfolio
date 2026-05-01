import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type: string; [key: string]: unknown }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    if (!body?._type) {
      return NextResponse.json({ message: 'Bad Request: Missing _type' }, { status: 400 });
    }

    const type = body._type;
    revalidateTag(type);
    
    // Revalidate associated tags based on document type
    const typeToTagMap: Record<string, string[]> = {
      blogPost: ['blog'],
      project: ['projects'],
      experience: ['experience'],
      certification: ['certifications'],
      profile: ['profile'],
    };

    const tags = typeToTagMap[type] || [];
    tags.forEach(tag => revalidateTag(tag));

    return NextResponse.json({ 
      status: 200, 
      revalidated: true, 
      now: Date.now(), 
      tags: [type, ...tags]
    });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
