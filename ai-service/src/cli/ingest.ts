import { parseArgs } from 'node:util';

import { getEnv } from '../config/env';
import { logger } from '../lib/logger';
import { getIndexStats, incrementalIndex, reindexAll } from '../vector/indexer';

const { values } = parseArgs({
  options: {
    full: { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
    reset: { type: 'boolean', default: false },
  },
});

async function main(): Promise<void> {
  getEnv();

  const result = values.full
    ? await reindexAll({ dryRun: values['dry-run'], reset: values.reset })
    : await incrementalIndex({ dryRun: values['dry-run'] });

  logger.info({ result }, `ingest ${result.mode} complete`);
  logger.info({ stats: await getIndexStats() }, 'index stats');
}

main().catch((error) => {
  logger.error({ err: String(error) }, 'ingest failed');
  process.exitCode = 1;
});
