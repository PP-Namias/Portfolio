import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { parseArgs } from 'node:util';

import { defaultCases, type BenchmarkCase } from './cases';
import { scoreBenchmark, type BenchmarkCaseEvidence } from './score';
import { getEnv, isVectorStoreConfigured } from '../config/env';
import { runRag } from '../graph/build-graph';
import { logger } from '../lib/logger';
import { embedText } from '../vector/embeddings';
import { queryVectors } from '../vector/upstash-store';

const REPORT_PATH = 'benchmarks/latest-report.json';

const { values } = parseArgs({
  options: {
    'cases-file': { type: 'string' },
  },
});

async function loadCases(): Promise<BenchmarkCase[]> {
  if (!values['cases-file']) {
    return defaultCases;
  }
  try {
    const raw = await readFile(values['cases-file'], 'utf8');
    return JSON.parse(raw) as BenchmarkCase[];
  } catch (error) {
    logger.warn({ err: String(error) }, 'could not load custom cases, using defaults');
    return defaultCases;
  }
}

async function retrieveDocIds(query: string): Promise<string[]> {
  const embedding = await embedText(query);
  const results = await queryVectors(embedding, 12, true);
  const env = getEnv();
  return results
    .filter((result) => (result.score ?? 0) >= env.similarityThreshold)
    .map((result) => (result.metadata?.docId as string | undefined) ?? result.id)
    .filter((docId, index, all) => all.indexOf(docId) === index);
}

async function main(): Promise<void> {
  const env = getEnv();
  const cases = await loadCases();
  logger.info({ caseCount: cases.length }, 'benchmark started');

  const evidence: BenchmarkCaseEvidence[] = [];
  for (const caseSpec of cases) {
    const startedAt = performance.now();
    const result = await runRag(caseSpec.query);
    const retrievedDocIds = isVectorStoreConfigured(env)
      ? await retrieveDocIds(result.reformulatedQuery || caseSpec.query)
      : [];
    evidence.push({
      intent: result.intent,
      status: result.status,
      latencyMs: Math.round(performance.now() - startedAt),
      usedContext: result.usedContext,
      retrievedDocIds,
      citations: result.citations,
      response: result.response,
    });
    logger.info({ caseId: caseSpec.id, intent: result.intent, status: result.status }, 'case evaluated');
  }

  const report = scoreBenchmark(cases, evidence);
  await mkdir(dirname(REPORT_PATH), { recursive: true });
  await writeFile(join(process.cwd(), REPORT_PATH), JSON.stringify(report, null, 2), 'utf8');

  const { metrics } = report;
  logger.info(
    {
      retrievalHitRate: metrics.retrievalHitRate,
      keywordHitRate: metrics.keywordHitRate,
      groundedResponseRate: metrics.groundedResponseRate,
      citationCoverage: metrics.citationCoverage,
      noAnswerRate: metrics.noAnswerRate,
      avgLatencyMs: metrics.avgLatencyMs,
    },
    `benchmark complete -> ${REPORT_PATH}`,
  );
}

main().catch((error) => {
  logger.error({ err: String(error) }, 'benchmark failed');
  process.exitCode = 1;
});
