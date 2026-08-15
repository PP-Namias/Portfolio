import { NextRequest, NextResponse } from 'next/server';
import { getThread, updateThread, deleteThread, getThreadMessages } from '@/lib/chat/persistence';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const thread = getThread(id);
    if (!thread) {
      return NextResponse.json({ error: 'Thread not found.' }, { status: 404 });
    }

    const messages = getThreadMessages(id);

    return NextResponse.json({ thread, messages });
  } catch (error) {
    console.error('[Thread API] Failed to get thread:', error);
    return NextResponse.json({ error: 'Failed to get thread.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const title = typeof body.title === 'string' && body.title.trim()
      ? body.title.trim()
      : null;

    if (!title) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
    }

    const thread = updateThread(id, { title });
    if (!thread) {
      return NextResponse.json({ error: 'Thread not found.' }, { status: 404 });
    }

    return NextResponse.json({ thread });
  } catch (error) {
    console.error('[Thread API] Failed to update thread:', error);
    return NextResponse.json({ error: 'Failed to update thread.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deleted = deleteThread(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Thread not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Thread API] Failed to delete thread:', error);
    return NextResponse.json({ error: 'Failed to delete thread.' }, { status: 500 });
  }
}
