---
name: webhook-design
description: Design and implement webhooks for event-driven architecture.
---

# Webhook Design Skill

Design and implement secure, reliable webhooks for event-driven integrations.

## When to use this skill

- Integrating with third-party services
- Setting up real-time notifications
- Implementing event-driven workflows
- Configuring Sanity webhooks
- Building automated pipelines

## Workflow

1. **Define events** — Identify trigger events
2. **Design payload** — Create consistent payload structure
3. **Implement security** — Add signature verification
4. **Handle failures** — Implement retry logic
5. **Monitor** — Track delivery and failures

## Webhook Handler (Next.js)

```typescript
// app/api/webhooks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-webhook-signature');

  if (!verifySignature(body, signature!, process.env.WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);

  switch (event.type) {
    case 'content.updated':
      // Handle content update
      break;
    case 'content.deleted':
      // Handle content deletion
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
```

## Sanity Webhook Configuration

```typescript
// app/api/sanity/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-sanity-webhook-secret');

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const body = await request.json();
  const { _type, slug } = body;

  // Revalidate based on document type
  switch (_type) {
    case 'post':
      revalidatePath('/blog');
      revalidatePath(`/blog/${slug}`);
      break;
    case 'project':
      revalidatePath('/projects');
      revalidatePath(`/projects/${slug}`);
      break;
  }

  return NextResponse.json({ revalidated: true });
}
```

## Best Practices

- Verify signatures on all incoming webhooks
- Return 200 quickly, process asynchronously
- Implement idempotency keys
- Log all webhook events
- Set up retry handling
- Use queues for high-volume webhooks

## Checklist

- [ ] Signature verification implemented
- [ ] Payload validation added
- [ ] Error handling configured
- [ ] Retry logic implemented
- [ ] Logging in place
- [ ] Monitoring and alerts set up
