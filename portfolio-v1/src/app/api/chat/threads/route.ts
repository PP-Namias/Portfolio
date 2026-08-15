import { NextRequest, NextResponse } from 'next/server';
import { listThreads, createThread } from '@/lib/chat/persistence';

export async function GET() {
  try {
    const threads = listThreads();
    return NextResponse.json({ threads });
  } catch (error) {
    console.error('[Threads API] Failed to list threads:', error);
    return NextResponse.json({ error: 'Failed to list threads.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const title = typeof body.title === 'string' && body.title.trim()
      ? body.title.trim()
      : 'New Conversation';

    const id = `thread_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    const thread = createThread(id, title);

    return NextResponse.json({ thread }, { status: 201 });
  } catch (error) {
    console.error('[Threads API] Failed to create thread:', error);
    return NextResponse.json({ error: 'Failed to create thread.' }, { status: 500 });
  }
}
