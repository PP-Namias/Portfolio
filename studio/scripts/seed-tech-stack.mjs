#!/usr/bin/env node

/**
 * Seed Tech Stack to Sanity CMS
 *
 * Parses the resume technical skills and upserts them
 * into the techStack singleton document in Sanity.
 *
 * Usage:
 *   node scripts/seed-tech-stack.mjs
 *
 * Environment variables (required):
 *   SANITY_API_WRITE_TOKEN - Sanity API token with write permissions
 *   NEXT_PUBLIC_SANITY_PROJECT_ID - Sanity project ID
 *   NEXT_PUBLIC_SANITY_DATASET - Sanity dataset name (usually "production")
 */

const SANITY_API_VERSION = 'v2024-01-01';
const TECH_STACK_DOCUMENT_ID = 'techStack';

// ─── Tech Skills Data ────────────────────────────────────────────────────────
// Organized by category with proficiency ratings (1-5)
// 5 = Expert, 4 = Advanced, 3 = Intermediate, 2 = Basic, 1 = Familiar

const TECH_CATEGORIES = [
  {
    category: 'Software Engineering & Full Stack',
    skills: [
      { name: 'TypeScript', proficiency: 5 },
      { name: 'JavaScript (ES6+)', proficiency: 5 },
      { name: 'React', proficiency: 5 },
      { name: 'Next.js (App Router)', proficiency: 5 },
      { name: 'NestJS', proficiency: 4 },
      { name: 'Node.js', proficiency: 5 },
      { name: 'Express.js', proficiency: 5 },
      { name: 'Spring Boot', proficiency: 4 },
      { name: 'Flutter', proficiency: 3 },
      { name: 'Electron', proficiency: 4 },
      { name: 'Vite', proficiency: 4 },
    ],
  },
  {
    category: 'AI, ML & Automation',
    skills: [
      { name: 'LLM Orchestration (OpenAI/Gemini API)', proficiency: 5 },
      { name: 'Prompt Engineering', proficiency: 5 },
      { name: 'Context-Injection', proficiency: 5 },
      { name: 'RAG Systems', proficiency: 5 },
      { name: 'Vector Databases (Pinecone/Milvus)', proficiency: 4 },
      { name: 'TensorFlow', proficiency: 3 },
      { name: 'PyTorch', proficiency: 3 },
      { name: 'Scikit-learn', proficiency: 3 },
      { name: 'MLOps Pipelines', proficiency: 3 },
      { name: 'AI Agent Development (n8n)', proficiency: 4 },
      { name: 'NLP', proficiency: 4 },
      { name: 'Computer Vision', proficiency: 3 },
      { name: 'LangChain', proficiency: 4 },
      { name: 'LangGraph', proficiency: 4 },
    ],
  },
  {
    category: 'Cloud, DevOps & Infrastructure',
    skills: [
      { name: 'Docker', proficiency: 4 },
      { name: 'Kubernetes (Basic)', proficiency: 2 },
      { name: 'CI/CD Pipeline Architecture', proficiency: 5 },
      { name: 'GCP', proficiency: 3 },
      { name: 'Azure', proficiency: 3 },
      { name: 'Cloudflare', proficiency: 4 },
      { name: 'Vercel', proficiency: 5 },
      { name: 'Railway', proficiency: 4 },
      { name: 'Distributed Tracing (Jaeger)', proficiency: 4 },
      { name: 'Grafana Monitoring', proficiency: 4 },
      { name: 'SSR/ISR', proficiency: 5 },
      { name: 'Terraform', proficiency: 3 },
      { name: 'Infrastructure as Code (IaC)', proficiency: 3 },
    ],
  },
  {
    category: 'Security, Testing & Quality',
    skills: [
      { name: 'OWASP Top 10', proficiency: 5 },
      { name: 'Penetration Testing', proficiency: 4 },
      { name: 'TDD', proficiency: 5 },
      { name: 'E2E Testing (Playwright/Puppeteer)', proficiency: 5 },
      { name: 'Jest/Vitest', proficiency: 5 },
      { name: 'RBAC', proficiency: 5 },
      { name: 'OAuth 2.0', proficiency: 4 },
      { name: 'JWT', proficiency: 5 },
      { name: 'HMAC Verification', proficiency: 5 },
      { name: 'CSP/HSTS Hardening', proficiency: 5 },
      { name: 'Data Encryption', proficiency: 4 },
      { name: 'Security Auditing', proficiency: 4 },
    ],
  },
  {
    category: 'Databases & Data Systems',
    skills: [
      { name: 'PostgreSQL', proficiency: 5 },
      { name: 'SQLite', proficiency: 4 },
      { name: 'Supabase', proficiency: 4 },
      { name: 'Firebase', proficiency: 4 },
      { name: 'Redis', proficiency: 4 },
      { name: 'Drizzle ORM', proficiency: 5 },
      { name: 'Prisma', proficiency: 4 },
      { name: 'ETL Pipeline Design', proficiency: 4 },
      { name: 'Data Structures & Algorithms (DSA)', proficiency: 5 },
      { name: 'Complex Data-Filtering', proficiency: 5 },
      { name: 'GraphQL', proficiency: 4 },
      { name: 'Data Modeling', proficiency: 5 },
    ],
  },
  {
    category: 'Hardware & IoT',
    skills: [
      { name: 'C', proficiency: 4 },
      { name: 'C++', proficiency: 4 },
      { name: 'Python', proficiency: 5 },
      { name: 'Raspberry Pi', proficiency: 4 },
      { name: 'Arduino', proficiency: 4 },
      { name: 'MQTT Protocols', proficiency: 4 },
      { name: 'IoT Gateway Design', proficiency: 4 },
      { name: 'I2C/SPI Sensor Integration', proficiency: 4 },
      { name: 'Embedded Systems', proficiency: 3 },
    ],
  },
  {
    category: 'Tools & Platforms',
    skills: [
      { name: 'Git', proficiency: 5 },
      { name: 'GitHub', proficiency: 5 },
      { name: 'Figma', proficiency: 3 },
      { name: 'Linux', proficiency: 4 },
      { name: 'REST APIs', proficiency: 5 },
      { name: 'WebSocket', proficiency: 4 },
      { name: 'Sanity CMS', proficiency: 5 },
      { name: 'Three.js', proficiency: 3 },
      { name: 'React Native', proficiency: 3 },
      { name: 'tRPC', proficiency: 4 },
      { name: 'Zod', proficiency: 5 },
    ],
  },
];

// ─── Helper: Generate logo identifier from name ──────────────────────────────
function generateLogoId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── Build technologies array ────────────────────────────────────────────────
function buildTechnologies() {
  const technologies = [];

  for (const cat of TECH_CATEGORIES) {
    for (const skill of cat.skills) {
      technologies.push({
        _type: 'object',
        name: skill.name,
        logo: generateLogoId(skill.name),
        category: cat.category,
        proficiency: skill.proficiency,
      });
    }
  }

  return technologies;
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!token || !projectId || !dataset) {
    console.error('❌ Missing required environment variables:');
    console.error('   - SANITY_API_WRITE_TOKEN');
    console.error('   - NEXT_PUBLIC_SANITY_PROJECT_ID');
    console.error('   - NEXT_PUBLIC_SANITY_DATASET');
    process.exit(1);
  }

  const technologies = buildTechnologies();
  const totalSkills = technologies.length;
  const totalCategories = TECH_CATEGORIES.length;

  console.log(`\n🚀 Seeding Tech Stack to Sanity CMS...`);
  console.log(`   Project: ${projectId}`);
  console.log(`   Dataset: ${dataset}`);
  console.log(`   Categories: ${totalCategories}`);
  console.log(`   Technologies: ${totalSkills}\n`);

  // Build the mutation payload
  const doc = {
    _type: 'techStack',
    _id: TECH_STACK_DOCUMENT_ID,
    title: 'Tech Stack',
    technologies,
  };

  const url = `https://${projectId}.api.sanity.io/${SANITY_API_VERSION}/data/mutate/${dataset}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mutations: [{ createOrReplace: doc }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`\n❌ Sanity mutation failed: ${response.status}`);
    console.error(errorText);
    process.exit(1);
  }

  const result = await response.json();

  console.log(`✅ Tech Stack seeded successfully!`);
  console.log(`   Document ID: ${result.results?.[0]?.id || TECH_STACK_DOCUMENT_ID}`);
  console.log(`   Operation: ${result.results?.[0]?.operation || 'createOrReplace'}\n`);

  // Print summary by category
  console.log('📋 Summary by category:');
  for (const cat of TECH_CATEGORIES) {
    console.log(`   ${cat.category}: ${cat.skills.length} skills`);
  }

  console.log('\n🎯 Proficiency levels:');
  console.log('   5 = Expert | 4 = Advanced | 3 = Intermediate | 2 = Basic | 1 = Familiar');
  console.log('');
}

main().catch((err) => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
