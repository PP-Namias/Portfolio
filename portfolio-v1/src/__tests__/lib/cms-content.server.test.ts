import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

vi.mock('next/headers', () => ({
  draftMode: () => Promise.resolve({ isEnabled: false }),
}));

import { querySanity } from '@/lib/cms-content.server';

describe('querySanity E2E fixture seam', () => {
  let fixturePath: string;

  beforeEach(async () => {
    fixturePath = join(tmpdir(), `cms-e2e-fixture-${Date.now()}.json`);
    await writeFile(
      fixturePath,
      JSON.stringify({
        profile: { fullName: 'E2E Hero Name', title: 'E2E Role' },
        post: [{ title: 'E2E Post One', slug: 'e2e-post-one', excerpt: 'First', published: true }],
      }),
    );
  });

  afterEach(async () => {
    await rm(fixturePath, { force: true });
    delete process.env.E2E_CMS_FILE;
  });

  it('returns fixture data when E2E_CMS_FILE is set', async () => {
    process.env.E2E_CMS_FILE = fixturePath;

    const result = await querySanity<{ fullName?: string }>('*[_type == "profile"][0]{fullName}');

    expect(result?.fullName).toBe('E2E Hero Name');
  });

  it('resolves list queries against fixture arrays', async () => {
    process.env.E2E_CMS_FILE = fixturePath;

    const result = await querySanity<Array<{ title?: string }>>('*[_type == "post"]{title}');

    expect(result?.[0]?.title).toBe('E2E Post One');
  });

  it('falls through to the real path when E2E_CMS_FILE is unset', async () => {
    const result = await querySanity<{ fullName?: string }>('*[_type == "profile"][0]{fullName}');

    expect(result).toBeNull();
  });

  it('falls through when the queried type is missing from the fixture', async () => {
    process.env.E2E_CMS_FILE = fixturePath;

    const result = await querySanity<unknown>('*[_type == "aboutSection"][0]{...}');

    expect(result).toBeNull();
  });

  it('falls through when the fixture file cannot be read', async () => {
    process.env.E2E_CMS_FILE = join(tmpdir(), 'does-not-exist.json');

    const result = await querySanity<{ fullName?: string }>('*[_type == "profile"][0]{fullName}');

    expect(result).toBeNull();
  });
});