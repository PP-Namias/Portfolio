# Graph Report - Portfolio (2026-07-03)

## Corpus Check

- 10 files · ~1,657 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 14 nodes · 5 edges · 9 communities (4 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness

- Built from commit: `75b5d827`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)

- [[_COMMUNITY_pre-commit-zizmor.sh|pre-commit-zizmor.sh]]
- [[_COMMUNITY_setup-pentestagent.sh script|setup-pentestagent.sh script]]
- [[_COMMUNITY_backup.sh script|backup.sh script]]
- [[_COMMUNITY_restore.sh script|restore.sh script]]
- [[_COMMUNITY_verify.sh script|verify.sh script]]

## God Nodes (most connected - your core abstractions)

1. `pre-commit-zizmor.sh script` - 1 edges
2. `setup-pentestagent.sh script` - 1 edges
3. `backup.sh script` - 1 edges
4. `restore.sh script` - 1 edges
5. `verify.sh script` - 1 edges

## Surprising Connections (you probably didn't know these)

- None detected - all connections are within the same source files.

## Import Cycles

- None detected.

## Communities (9 total, 5 thin omitted)

## Knowledge Gaps

- **5 isolated node(s):** `pre-commit-zizmor.sh script`, `setup-pentestagent.sh script`, `backup.sh script`, `restore.sh script`, `verify.sh script`
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **What connects `pre-commit-zizmor.sh script`, `setup-pentestagent.sh script`, `backup.sh script` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
