import { config } from 'dotenv';
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function migrateData() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('Missing SANITY_API_WRITE_TOKEN');
    process.exit(1);
  }

  console.log('--- Executing Phase 3: Automated Migration ---');
  const dataDir = path.join(process.cwd(), 'portfolio-resources', 'data');
  
  try {
    // Migrate Profile
    const profilePath = path.join(dataDir, 'profile.json');
    if (fs.existsSync(profilePath)) {
      const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
      await client.createOrReplace({
        _type: 'profile',
        _id: 'singleton-profile',
        ...profile
      });
      console.log('✅ Migrated Profile');
    }

    // Migrate Projects
    const projectsPath = path.join(dataDir, 'projects.json');
    if (fs.existsSync(projectsPath)) {
      const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
      for (const p of projects) {
        await client.createOrReplace({
          _type: 'project',
          _id: `project-${p.id}`,
          ...p
        });
      }
      console.log(`✅ Migrated ${projects.length} Projects`);
    }

    console.log('--- Migration Script Complete ---');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateData();
