---
title: 'Architecture Behind This Portfolio\'s AI Chat'
slug: 'architecture-behind-this-portfolios-ai-chat'
excerpt: 'How I built the AI chat on this very portfolio — streaming responses, context management, RAG, and edge deployment with Cloudflare Workers.'
featured: false
publishedAt: '2026-09-28T10:00:00Z'
published: true
author: 'PP Namias'
tags: [ ai-chat, architecture, rag ]
readTime: '7 min read'
---

The AI chat on this portfolio isn't a simple Q&A bot. It's a carefully architected system that balances streaming performance, context management, and cost efficiency — all deployed at the edge.

This post breaks down exactly how it works.

## System Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Browser     │────▶│  Edge Worker  │────▶│  OpenAI API  │
│  (React)     │◀────│  (Cloudflare) │◀────│  GPT-4       │
└─────────────┘     └──────────────┘     └─────────────┘
                          │
                          ▼
                    ┌──────────────┐
                    │  Context     │
                    │  Manager     │
                    └──────────────┘
```

## Streaming Architecture

The most important design decision was streaming. Users see responses appear word by word, creating a natural conversation feel.

### Frontend

```typescript
// Simplified streaming consumer
async function consumeStream(response: Response) {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    const text = decoder.decode(value);
    setResponse(prev => prev + text);
  }
}
```

### Backend (Edge Worker)

```typescript
// Edge worker streaming handler
export async function handleChatStream(req: Request) {
  const { messages } = await req.json();

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ],
    stream: true,
    max_tokens: 1024,
  });

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) controller.enqueue(content);
        }
        controller.close();
      },
    }),
    { headers: { 'Content-Type': 'text/plain' } }
  );
}
```

## Context Management

The chat needs to remember the conversation. I use a two-level approach:

1. **Recent history** — last N messages included in every request (short-term memory)
2. **Context window management** — when the conversation gets too long, older messages are summarized or dropped

```typescript
function buildContext(messages: Message[]): Message[] {
  // Keep system prompt + last 10 messages
  const recentMessages = messages.slice(-10);

  // If total tokens exceed limit, summarize older content
  if (estimateTokens(recentMessages) > 4000) {
    return trimToFit(recentMessages, 4000);
  }

  return recentMessages;
}
```

## RAG Integration

The chat knows about my portfolio content through Retrieval-Augmented Generation (RAG). When you ask about my projects, skills, or experience, the system:

1. **Vectorizes** your question
2. **Searches** a vector index of my portfolio content
3. **Retrieves** the most relevant chunks
4. **Injects** them into the prompt context

This means the AI can answer specific questions about my work without being explicitly trained on it.

```typescript
async function retrieveContext(query: string): Promise<string> {
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });

  const results = await vectorDb.search(embedding.data[0].embedding, {
    limit: 5,
    minScore: 0.7,
  });

  return results.map(r => r.content).join('\n\n');
}
```

## Edge Deployment

Everything runs on Cloudflare Workers — no cold starts, global distribution, minimal latency.

**Why edge?**
- Serverless streaming works better at the edge (closer to users)
- No cold start penalty for AI requests
- Built-in rate limiting and DDoS protection
- Cost-effective for variable traffic

## Rate Limiting

Without rate limiting, a single user could drain the API budget. I implemented:

```typescript
const rateLimiter = new RateLimiter({
  windowMs: 60_000,  // 1 minute
  maxRequests: 10,     // 10 messages per minute
});

export async function handleChat(req: Request) {
  const ip = req.headers.get('cf-connecting-ip') ?? 'unknown';
  const allowed = await rateLimiter.check(ip);

  if (!allowed) {
    return new Response('Rate limit exceeded', { status: 429 });
  }

  return handleChatStream(req);
}
```

## Security Considerations

- **Input sanitization** — prevents prompt injection attacks
- **Rate limiting** — prevents abuse
- **CORS policies** — restricts access to the portfolio domain
- **No sensitive data** — the system prompt avoids sharing personal information
- **Token limits** — prevents runaway costs

## Key Metrics

| Metric | Value |
|--------|-------|
| Average response time | ~2-3 seconds (streaming) |
| Context window | ~4000 tokens |
| Rate limit | 10 messages/minute |
| Deployment | Cloudflare Workers (edge) |

## What I'd Do Differently

If I rebuilt this today, I'd:

1. **Add conversation persistence** — save chats across sessions so users can return to previous conversations
2. **Improve RAG chunking** — better document segmentation for more accurate retrieval
3. **Add feedback mechanism** — let users rate responses to improve quality
4. **Multi-model support** — let users choose between different AI models

---

*The AI chat is one of the most technically interesting features on this portfolio. If you haven't tried it yet, go ask it a question.*
