#!/usr/bin/env node

/**
 * Sanity Content Auditor
 * Checks content for completeness, consistency, and quality.
 */

import { createClient } from '@sanity/client';

const PROJECT_ID = process.env.SANITY_PROJECT_ID || 'nl0qw78w';
const DATASET = process.env.SANITY_DATASET || 'production';
const TOKEN = process.env.SANITY_API_READ_TOKEN;

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const issues = [];

function addIssue(type, severity, document, field, message) {
  issues.push({ type, severity, document, field, message });
}

async function auditProjects() {
  const docs = await client.fetch('*[_type == "project"]{_id, title, image, description, tags, liveURL, repositoryURL}');
  
  for (const doc of docs) {
    if (!doc.title) {
      addIssue('missing_field', 'critical', doc._id, 'title', 'Project has no title');
    }
    if (!doc.image) {
      addIssue('missing_image', 'warning', doc._id, 'image', 'Project has no image');
    }
    if (!doc.description) {
      addIssue('missing_field', 'warning', doc._id, 'description', 'Project has no description');
    }
    if (doc.image && !doc.image.alt) {
      addIssue('missing_alt_text', 'warning', doc._id, 'image.alt', 'Image missing alt text');
    }
    if (doc.liveURL && !isValidUrl(doc.liveURL)) {
      addIssue('invalid_url', 'warning', doc._id, 'liveURL', `Invalid live URL: ${doc.liveURL}`);
    }
    if (doc.repositoryURL && !isValidUrl(doc.repositoryURL)) {
      addIssue('invalid_url', 'warning', doc._id, 'repositoryURL', `Invalid repository URL: ${doc.repositoryURL}`);
    }
  }
  
  return docs.length;
}

async function auditExperience() {
  const docs = await client.fetch('*[_type == "experience"]{_id, position, company, startedAt, endedAt}');
  
  for (const doc of docs) {
    if (!doc.position) {
      addIssue('missing_field', 'critical', doc._id, 'position', 'Experience has no position');
    }
    if (!doc.company) {
      addIssue('missing_field', 'critical', doc._id, 'company', 'Experience has no company');
    }
    if (!doc.startedAt) {
      addIssue('missing_field', 'warning', doc._id, 'startedAt', 'Experience has no start date');
    }
  }
  
  return docs.length;
}

async function auditCertifications() {
  const docs = await client.fetch('*[_type == "certification"]{_id, title, issuer, issuedAt}');
  
  for (const doc of docs) {
    if (!doc.title) {
      addIssue('missing_field', 'warning', doc._id, 'title', 'Certification has no title');
    }
    if (!doc.issuer) {
      addIssue('missing_field', 'warning', doc._id, 'issuer', 'Certification has no issuer');
    }
  }
  
  return docs.length;
}

async function auditBlogPosts() {
  const docs = await client.fetch('*[_type == "blog"]{_id, title, slug, content, publishedAt}');
  
  for (const doc of docs) {
    if (!doc.title) {
      addIssue('missing_field', 'warning', doc._id, 'title', 'Blog post has no title');
    }
    if (!doc.slug) {
      addIssue('missing_field', 'warning', doc._id, 'slug', 'Blog post has no slug');
    }
    if (!doc.content) {
      addIssue('missing_field', 'warning', doc._id, 'content', 'Blog post has no content');
    }
  }
  
  return docs.length;
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

function generateReport(results) {
  const critical = issues.filter(i => i.severity === 'critical').length;
  const warnings = issues.filter(i => i.severity === 'warning').length;
  
  const report = {
    summary: {
      totalDocuments: results.reduce((sum, r) => sum + r, 0),
      issuesFound: issues.length,
      critical,
      warnings,
    },
    issues,
  };
  
  return report;
}

async function main() {
  console.log('Auditing Sanity content...\n');
  
  const results = await Promise.all([
    auditProjects(),
    auditExperience(),
    auditCertifications(),
    auditBlogPosts(),
  ]);
  
  const report = generateReport(results);
  
  console.log(JSON.stringify(report, null, 2));
  
  if (report.summary.critical > 0) {
    console.log(`\n✗ ${report.summary.critical} critical issue(s) found`);
    process.exit(1);
  } else if (report.summary.issuesFound > 0) {
    console.log(`\n⚠ ${report.summary.warnings} warning(s) found`);
  } else {
    console.log('\n✓ No issues found');
  }
}

main().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
