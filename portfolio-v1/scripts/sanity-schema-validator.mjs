#!/usr/bin/env node

/**
 * Sanity Schema Validator
 * Checks schemas for common issues and best practices.
 */

import { readdir, readFile } from 'fs/promises';
import { join, extname } from 'path';

const SCHEMAS_DIR = join(process.cwd(), 'studio', 'schemaTypes');
const RESERVED_WORDS = ['document', 'type', 'name', 'title', 'fields', 'preview'];

let totalIssues = 0;

async function validateSchema(filePath) {
  const content = await readFile(filePath, 'utf-8');
  const issues = [];
  
  // Check for required fields
  if (!content.includes('title:')) {
    issues.push('Missing title field');
  }
  if (!content.includes('name:')) {
    issues.push('Missing name field');
  }
  if (!content.includes('type:')) {
    issues.push('Missing type field');
  }
  
  // Check for preview config
  if (content.includes('type: \'document\'') || content.includes("type: 'singleton'")) {
    if (!content.includes('preview:')) {
      issues.push('Missing preview config for document/singleton type');
    }
  }
  
  // Check for validation on required fields
  const fieldBlocks = content.match(/\{[\s\S]*?name:\s*'[^']+'[\s\S]*?\}/g) || [];
  for (const block of fieldBlocks) {
    if (block.includes('validation:') && !block.includes('Rule =>')) {
      // Has validation but might not be properly formatted
    }
  }
  
  // Check for deprecated types
  if (content.includes('type: \'richDate\'')) {
    issues.push('Using deprecated type "richDate" - use "date" instead');
  }
  if (content.includes('type: \'color\'')) {
    issues.push('Using deprecated type "color" - use custom component instead');
  }
  
  // Check for duplicate field names
  const fieldNames = [...content.matchAll(/name:\s*'([^']+)'/g)].map(m => m[1]);
  const uniqueNames = new Set(fieldNames);
  if (fieldNames.length !== uniqueNames.size) {
    const duplicates = fieldNames.filter((name, i) => fieldNames.indexOf(name) !== i);
    issues.push(`Duplicate field names: ${[...new Set(duplicates)].join(', ')}`);
  }
  
  // Check for reserved word usage in field names
  for (const name of fieldNames) {
    if (RESERVED_WORDS.includes(name)) {
      issues.push(`Field name "${name}" is a reserved word`);
    }
  }
  
  return issues;
}

async function main() {
  console.log('Validating Sanity schemas...\n');
  
  const files = await readdir(SCHEMAS_DIR);
  const schemaFiles = files.filter(f => extname(f) === '.ts' && !f.startsWith('_'));
  
  for (const file of schemaFiles) {
    const filePath = join(SCHEMAS_DIR, file);
    const issues = await validateSchema(filePath);
    
    if (issues.length === 0) {
      console.log(`✓ ${file}`);
    } else {
      console.log(`✗ ${file} - ${issues.length} issue(s):`);
      issues.forEach(issue => console.log(`  - ${issue}`));
      totalIssues += issues.length;
    }
  }
  
  console.log(`\n${totalIssues === 0 ? '✓ All schemas valid' : `✗ ${totalIssues} issue(s) found`}`);
  process.exit(totalIssues > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Validator failed:', err);
  process.exit(1);
});
