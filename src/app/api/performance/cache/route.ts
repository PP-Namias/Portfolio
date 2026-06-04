import { NextRequest, NextResponse } from 'next/server';
import { stats, flush } from '@/lib/cache';
import { getCmsQueryCacheStats } from '@/lib/cms-content.server';

export async function GET(request: NextRequest) {
  const shouldFlush = request.nextUrl.searchParams.get('flush') === 'true';

  if (shouldFlush) {
    const flushed = await flush();
    return NextResponse.json({ flushed, status: 'ok' });
  }

  const cacheStats = await stats();
  const cmsStats = getCmsQueryCacheStats();

  const response = NextResponse.json({
    layer1: {
      name: 'In-Memory',
      size: cacheStats.l1.size,
      keys: cacheStats.l1.keys,
      memoryEstimateBytes: cacheStats.l1.memoryEstimateBytes,
    },
    layer2: {
      name: 'Upstash Redis',
      size: cacheStats.l2.size,
      redisConnected: cacheStats.l2.redisConnected,
    },
    cmsQueryCache: cmsStats,
    timestamp: new Date().toISOString(),
  });

  response.headers.set('Cache-Control', 'no-cache, private');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}
