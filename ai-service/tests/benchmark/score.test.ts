import { describe, expect, it } from 'vitest';

import type { BenchmarkCase } from '../../src/benchmark/cases';
import { scoreBenchmark, type BenchmarkCaseEvidence } from '../../src/benchmark/score';

const citation = (index: number, docType = 'project') => ({
  index,
  docId: `p${index}`,
  docType,
  title: `Title ${index}`,
  urlPath: '/',
  score: 0.9,
});

function evidence(overrides: Partial<BenchmarkCaseEvidence>): BenchmarkCaseEvidence {
  return {
    intent: 'portfolio',
    status: 'validate:done',
    latencyMs: 100,
    usedContext: true,
    retrievedDocIds: ['project:p1', 'experience:e1'],
    citations: [citation(1), citation(2)],
    response: 'A grounded answer [1] and [2].',
    ...overrides,
  };
}

describe('scoreBenchmark', () => {
  it('scores full retrieval hits, keyword hits, grounding, and citation coverage', () => {
    const cases: BenchmarkCase[] = [
      { id: 'a', query: 'q1', expectedDocIds: ['project:'], keywords: ['grounded'] },
    ];
    const report = scoreBenchmark(cases, [evidence({})]);

    expect(report.metrics.retrievalHitRate).toBe(1);
    expect(report.metrics.keywordHitRate).toBe(1);
    expect(report.metrics.groundedResponseRate).toBe(1);
    expect(report.metrics.citationCoverage).toBe(1);
    expect(report.metrics.noAnswerRate).toBe(0);
    expect(report.metrics.avgLatencyMs).toBe(100);
    expect(report.cases[0]?.retrievalHit).toBe(true);
    expect(report.cases[0]?.grounded).toBe(true);
  });

  it('flags retrieval misses and ungrounded answers', () => {
    const cases: BenchmarkCase[] = [
      { id: 'a', query: 'q1', expectedDocIds: ['skill:'], keywords: ['missing'] },
    ];
    const report = scoreBenchmark(
      cases,
      [
        evidence({
          retrievedDocIds: ['project:p1'],
          response: 'Answer without markers and without the keyword.',
        }),
      ],
    );

    expect(report.cases[0]?.retrievalHit).toBe(false);
    expect(report.cases[0]?.keywordHit).toBe(false);
    expect(report.cases[0]?.grounded).toBe(false);
    expect(report.metrics.retrievalHitRate).toBe(0);
    expect(report.metrics.keywordHitRate).toBe(0);
    expect(report.metrics.groundedResponseRate).toBe(0);
    expect(report.metrics.citationCoverage).toBe(0);
  });

  it('treats cases without expectations as null and excludes them from rates', () => {
    const cases: BenchmarkCase[] = [{ id: 'a', query: 'q1' }];
    const report = scoreBenchmark(cases, [evidence({})]);

    expect(report.cases[0]?.retrievalHit).toBeNull();
    expect(report.cases[0]?.keywordHit).toBeNull();
    expect(report.metrics.retrievalHitRate).toBeNull();
    expect(report.metrics.keywordHitRate).toBeNull();
  });

  it('ignores citation markers that do not map to cited chunks', () => {
    const cases: BenchmarkCase[] = [{ id: 'a', query: 'q1' }];
    const report = scoreBenchmark(cases, [evidence({ response: 'Claims [1] and bogus [9].' })]);

    expect(report.cases[0]?.grounded).toBe(true);
    expect(report.cases[0]?.citationCoverage).toBe(0.5);
    expect(report.metrics.citationCoverage).toBe(0.5);
  });

  it('counts no-answer fallbacks in the noAnswerRate', () => {
    const cases: BenchmarkCase[] = [{ id: 'a', query: 'q1' }, { id: 'b', query: 'q2' }];
    const report = scoreBenchmark(
      cases,
      [
        evidence({ status: 'validate:no-answer-fallback', response: 'I do not have that information.' }),
        evidence({ status: 'validate:done' }),
      ],
    );

    expect(report.metrics.noAnswerRate).toBe(0.5);
  });

  it('returns zero rates for empty evidence lists', () => {
    const report = scoreBenchmark([], []);
    expect(report.metrics.groundedResponseRate).toBe(0);
    expect(report.metrics.noAnswerRate).toBe(0);
    expect(report.metrics.retrievalHitRate).toBeNull();
    expect(report.cases).toEqual([]);
  });
});
