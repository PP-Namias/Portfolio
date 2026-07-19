import { NextRequest, NextResponse } from 'next/server';
import { reindexAll, getStats, resetVectorIndex } from '@/lib/rag/indexer';

function isAuthorized(request: NextRequest): boolean {
  const expected = process.env.REINDEX_SECRET?.trim();
  if (!expected) return false;
  const provided = request.headers.get('x-reindex-secret')?.trim();
  if (!provided) return false;

  try {
    const { timingSafeEqual } = require('node:crypto');
    const expectedBuf = Buffer.from(expected);
    const providedBuf = Buffer.from(provided);
    if (expectedBuf.length !== providedBuf.length) return false;
    return timingSafeEqual(expectedBuf, providedBuf);
  } catch {
    return expected === provided;
  }
}

export async function GET() {
  const stats = await getStats();
  return NextResponse.json(stats);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await reindexAll();
    return NextResponse.json({
      success: true,
      indexed: result.indexed,
      failed: result.failed,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await resetVectorIndex();
    return NextResponse.json({ success: true, message: 'Vector index reset' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
