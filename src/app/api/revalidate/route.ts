import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  const tagName = req.nextUrl.searchParams.get('tag');

  if (!tagName) {
    return NextResponse.json({ message: 'Missing tag param' }, { status: 400 });
  }

  try {
    revalidateTag(tagName, undefined as any);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
