import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '..', '..', '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'nl0qw78w',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-02-19',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const UPDATES = [
  {
    slug: 'hi-welcome-to-my-blog-portfolio',
    publishedAt: '2026-05-20T06:00:00.000Z',
    readTime: '4 min read',
    featured: true,
  },
  {
    slug: 'gitgoing-computer-science-github-webinar',
    publishedAt: '2026-02-28T08:00:00.000Z',
    readTime: '6 min read',
    featured: true,
  },
  {
    slug: 'my-experience-as-a-developer-in-2026',
    publishedAt: '2026-06-05T13:41:10.271Z',
    readTime: '8 min read',
    featured: false,
  },
];

async function main() {
  console.log('Fetching existing blog posts...');

  const posts = await client.fetch(`*[_type == "post" && slug.current in $slugs]{_id, slug, title}`, {
    slugs: UPDATES.map((u) => u.slug),
  });

  if (posts.length === 0) {
    console.log('No matching posts found. Check slugs.');
    process.exit(1);
  }

  console.log(`Found ${posts.length} posts to update:`);
  for (const post of posts) {
    console.log(`  - ${post.title} (_id: ${post._id})`);
  }

  console.log('\nApplying updates...');

  const transaction = client.transaction();

  for (const post of posts) {
    const update = UPDATES.find((u) => u.slug === post.slug.current);
    if (!update) continue;

    transaction.patch(post._id, (patch) =>
      patch.set({
        publishedAt: update.publishedAt,
        readTime: update.readTime,
        featured: update.featured,
      })
    );
  }

  const result = await transaction.commit();
  console.log(`\nDone! ${result.results.length} posts updated.`);

  for (const res of result.results) {
    const post = posts.find((p) => p._id === res.id);
    const update = UPDATES.find((u) => u.slug === post?.slug.current);
    console.log(`  ✅ ${post?.title}: publishedAt=${update?.publishedAt}, readTime=${update?.readTime}`);
  }
}

main().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
