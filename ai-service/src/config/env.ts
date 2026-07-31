import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

loadEnv({ path: ['.env.local', '.env', '../.env.local'], quiet: true });

function first(...candidates: Array<string | undefined>): string | undefined {
  for (const candidate of candidates) {
    if (candidate && candidate.trim()) {
      return candidate.trim();
    }
  }
  return undefined;
}

const EnvSchema = z.object({
  nodeEnv: z.enum(['development', 'test', 'production']).default('development'),
  sanityProjectId: z.string().min(1),
  sanityDataset: z.string().min(1).default('production'),
  sanityToken: z.string().optional(),
  geminiApiKey: z.string().min(1),
  upstashVectorUrl: z.string().url().optional(),
  upstashVectorToken: z.string().optional(),
  port: z.coerce.number().int().positive().default(8787),
  host: z.string().min(1).default('0.0.0.0'),
  corsOrigins: z.array(z.string().min(1)).default(['http://localhost:3000']),
  reindexSecret: z.string().optional(),
  llmModel: z.string().min(1).default('gemini-2.5-flash'),
  llmFallbackModel: z.string().min(1).default('gemini-1.5-pro'),
  embeddingModel: z.string().min(1).default('text-embedding-004'),
  ragTopK: z.coerce.number().int().positive().default(6),
  similarityThreshold: z.coerce.number().min(0).max(1).default(0.6),
  maxTokens: z.coerce.number().int().positive().default(1024),
  temperature: z.coerce.number().min(0).max(1).default(0.3),
});

export type EnvConfig = z.infer<typeof EnvSchema>;

let cached: EnvConfig | null = null;

export function getEnv(): EnvConfig {
  if (cached) {
    return cached;
  }

  const parsed = EnvSchema.safeParse({
    nodeEnv: process.env.NODE_ENV,
    sanityProjectId: first(process.env.SANITY_PROJECT_ID, process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
    sanityDataset: first(process.env.SANITY_DATASET, process.env.NEXT_PUBLIC_SANITY_DATASET),
    sanityToken: first(process.env.SANITY_API_TOKEN, process.env.SANITY_API_READ_TOKEN),
    geminiApiKey: process.env.GOOGLE_GEMINI_API_KEY,
    upstashVectorUrl: process.env.UPSTASH_VECTOR_URL,
    upstashVectorToken: process.env.UPSTASH_VECTOR_TOKEN,
    port: process.env.AI_SERVICE_PORT,
    host: process.env.AI_SERVICE_HOST,
    corsOrigins: (process.env.AI_SERVICE_CORS_ORIGINS ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    reindexSecret: first(process.env.AI_SERVICE_REINDEX_SECRET, process.env.REINDEX_SECRET),
    llmModel: process.env.AI_LLM_MODEL,
    llmFallbackModel: process.env.AI_LLM_FALLBACK_MODEL,
    embeddingModel: process.env.AI_EMBEDDING_MODEL,
    ragTopK: process.env.AI_RAG_TOP_K,
    similarityThreshold: process.env.AI_RAG_SIMILARITY_THRESHOLD,
    maxTokens: process.env.AI_MAX_TOKENS,
    temperature: process.env.AI_TEMPERATURE,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid environment configuration: ${issues}`);
  }

  cached = parsed.data;
  return cached;
}

export function isVectorStoreConfigured(env: EnvConfig = getEnv()): boolean {
  return Boolean(env.upstashVectorUrl && env.upstashVectorToken);
}
