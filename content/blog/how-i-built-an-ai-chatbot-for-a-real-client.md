---
title: 'How I Built an AI Chatbot for a Real Client'
slug: 'how-i-built-an-ai-chatbot-for-a-real-client'
excerpt: 'From concept to production — how I designed, built, and deployed an AI-powered chatbot system for Wilshire Financial Network with streaming, RAG, and real-world impact.'
featured: false
publishedAt: '2026-01-15T10:00:00Z'
published: true
author: 'PP Namias'
tags: [ ai, chatbot, llm, client-work ]
readTime: '7 min read'
---

Building an AI chatbot for a real client is a completely different experience from building one for a portfolio. Suddenly, it's not about cool technology — it's about reliability, accuracy, and user trust.

## The Brief

Wilshire Financial Network needed a chatbot that could:

- Answer client questions about financial products and services
- Provide accurate, compliant responses
- Handle multiple conversation topics simultaneously
- Scale to hundreds of concurrent users
- Integrate with their existing website

## Architecture

I designed a system that combined streaming responses with retrieval-augmented generation (RAG) for accuracy:

- **Frontend:** React with streaming response handling
- **Backend:** API routes with proper error handling and rate limiting
- **AI Layer:** OpenAI GPT models with RAG context injection
- **Knowledge Base:** Curated financial documents indexed for retrieval
- **Deployment:** Cloudflare Workers for edge computing

```typescript
// Streaming response handler
async function handleChatStream(req: Request): Promise<Response> {
  const { message, context } = await req.json();

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: buildSystemPrompt(context) },
      { role: 'user', content: message }
    ],
    stream: true,
  });

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) controller.enqueue(content);
        }
        controller.close();
      },
    }),
    { headers: { 'Content-Type': 'text/plain' } }
  );
}
```

## The Hard Parts

### Streaming Was Tricky
Getting streaming right — where the user sees the response appear word by word — required careful handling. The frontend needed to buffer incoming chunks, update the UI smoothly, and handle interruptions gracefully.

### RAG Accuracy
The chatbot needed to answer financial questions accurately. One wrong answer could have real consequences. I implemented a RAG pipeline that:

1. **Chunked** the knowledge base documents into searchable segments
2. **Embedded** them using vector embeddings
3. **Retrieved** the most relevant chunks for each query
4. **Injected** them into the prompt context

### Rate Limiting
Financial advisors use the system during business hours. Without rate limiting, a single user could overwhelm the API. I implemented:

- Per-user rate limits
- Queue management for burst traffic
- Graceful degradation messages
- Admin monitoring dashboard

## Key Features

### Streaming Responses
Users see the AI's response appear in real-time, creating a natural conversation feel. No waiting for the full response to generate.

### Context Awareness
The bot remembers the conversation history within a session. Users can ask follow-up questions without repeating context.

### Admin Dashboard
A monitoring dashboard shows:
- Active conversations
- Usage metrics
- Response times
- Error rates
- Token usage

### Security
- Input sanitization to prevent prompt injection
- Session-based authentication
- Rate limiting per user
- Conversation logging for compliance

## Results

The chatbot has been running in production, handling real client inquiries alongside the human support team:

- **Instant responses** to common queries
- **24/7 availability** — answers questions outside business hours
- **Reduced response time** from hours to seconds for routine questions
- **Human handoff** when the AI detects complex issues

## What I Learned

### Client Communication
Building for a client means constant communication. Weekly demos, feature requests, feedback loops. The technical work is only half the job — understanding what the client actually needs is the other half.

### Production Mindset
A portfolio project that crashes is fine. A client chatbot that goes down is a crisis. I learned to think about:

- Error handling at every level
- Monitoring and alerting
- Graceful degradation
- Backup and recovery plans

### AI Limitations
AI is powerful but not perfect. I learned to set expectations — the chatbot handles common questions well, but complex financial advice still needs a human advisor. The system is designed as a support tool, not a replacement.

## The Full Stack

```typescript
// Tech stack overview
const techStack = {
  frontend: ['React', 'TypeScript', 'Tailwind CSS'],
  backend: ['Node.js', 'API Routes', 'Edge Functions'],
  ai: ['OpenAI GPT-4', 'RAG Pipeline', 'Vector Embeddings'],
  infra: ['Cloudflare Workers', 'Edge Deployment'],
  monitoring: ['Error Tracking', 'Usage Analytics', 'Logging'],
};
```

---

*This project taught me that AI in production is as much about reliability and user experience as it is about the model itself. Up next: automating enterprise workflows.*
