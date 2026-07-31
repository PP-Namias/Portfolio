import type { Citation } from '../graph/types';
import type { BenchmarkCase } from './cases';

export interface BenchmarkCaseResult {
  caseId: string;
  query: string;
  intent: string;
  status: string;
  latencyMs: number;
  usedContext: boolean;
  retrievedDocIds: string[];
  citations: Citation[];
  response: string;
  retrievalHit: boolean | null;
  keywordHit: boolean | null;
  grounded: boolean;
  citationCoverage: number | null;
}

export interface BenchmarkMetrics {
  retrievalHitRate: number | null;
  keywordHitRate: number | null;
  groundedResponseRate: number;
  citationCoverage: number | null;
  noAnswerRate: number;
  avgLatencyMs: number;
}

export interface BenchmarkReport {
  timestamp: string;
  cases: BenchmarkCaseResult[];
  metrics: BenchmarkMetrics;
}

export interface BenchmarkCaseEvidence {
  intent: string;
  status: string;
  latencyMs: number;
  usedContext: boolean;
  retrievedDocIds: string[];
  citations: Citation[];
  response: string;
}

function mean(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function retrieveHit(expected: string[], retrieved: string[]): boolean {
  return expected.every((prefix) => retrieved.some((docId) => docId.startsWith(prefix)));
}

function extractCitationIndices(response: string): number[] {
  const matches = response.match(/\[(\d{1,2})\]/g) ?? [];
  return [...new Set(matches.map((m) => Number.parseInt(m.slice(1, -1), 10)))].filter((n) =>
    Number.isFinite(n),
  );
}

function evaluateCase(caseSpec: BenchmarkCase, evidence: BenchmarkCaseEvidence): BenchmarkCaseResult {
  const expectedIds = caseSpec.expectedDocIds ?? null;
  const retrievalHit = expectedIds ? retrieveHit(expectedIds, evidence.retrievedDocIds) : null;

  const lowerResponse = evidence.response.toLowerCase();
  const keywordHit =
    caseSpec.keywords && caseSpec.keywords.length > 0
      ? caseSpec.keywords.every((keyword) => lowerResponse.includes(keyword.toLowerCase()))
      : null;

  const cited = extractCitationIndices(evidence.response);
  const validIndices = new Set(evidence.citations.map((citation) => citation.index));
  const citedValid = cited.filter((index) => validIndices.has(index));

  const grounded = evidence.usedContext && citedValid.length > 0;
  const citationCoverage =
    evidence.citations.length > 0 ? citedValid.length / evidence.citations.length : null;

  return {
    caseId: caseSpec.id,
    query: caseSpec.query,
    intent: evidence.intent,
    status: evidence.status,
    latencyMs: evidence.latencyMs,
    usedContext: evidence.usedContext,
    retrievedDocIds: evidence.retrievedDocIds,
    citations: evidence.citations,
    response: evidence.response,
    retrievalHit,
    keywordHit,
    grounded,
    citationCoverage,
  };
}

export function scoreBenchmark(
  cases: BenchmarkCase[],
  evidence: BenchmarkCaseEvidence[],
  timestamp = new Date().toISOString(),
): BenchmarkReport {
  const evaluated = cases.map((caseSpec, index) => evaluateCase(caseSpec, evidence[index]!));

  const retrievalHits = evaluated
    .filter((item) => item.retrievalHit !== null)
    .map((item) => (item.retrievalHit ? 1 : 0));
  const keywordHits = evaluated.filter((item) => item.keywordHit !== null).map((item) => (item.keywordHit ? 1 : 0));
  const groundedRates = evaluated.filter((item) => item.usedContext).map((item) => (item.grounded ? 1 : 0));
  const coverages = evaluated.map((item) => item.citationCoverage).filter((v): v is number => v !== null);
  const noAnswers = evaluated.filter((item) => item.status === 'validate:no-answer-fallback').length;
  const latencies = evaluated.map((item) => item.latencyMs);

  return {
    timestamp,
    cases: evaluated,
    metrics: {
      retrievalHitRate: mean(retrievalHits),
      keywordHitRate: mean(keywordHits),
      groundedResponseRate:
        groundedRates.length > 0 ? groundedRates.reduce<number>((a, b) => a + b, 0) / groundedRates.length : 0,
      citationCoverage: mean(coverages),
      noAnswerRate: evaluated.length > 0 ? noAnswers / evaluated.length : 0,
      avgLatencyMs: mean(latencies) ?? 0,
    },
  };
}
