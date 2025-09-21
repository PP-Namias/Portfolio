#!/usr/bin/env node

/**
 * Content Taxonomy Validation Script
 * Validates that all content follows the new tagging guidelines
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Approved taxonomy
const APPROVED_BLOG_CATEGORIES = ['Technical', 'Projects', 'Career', 'Insights', 'Personal'];
const APPROVED_PROJECT_CATEGORIES = ['Web Development', 'AI & Automation', 'Enterprise Solutions', 'Design & Creative'];

const APPROVED_TAGS = [
  // Technology (10)
  'React', 'TypeScript', 'Node.js', 'AI/ML', 'DevOps', 'Full-Stack', 
  'Database', 'Cloud', 'Mobile', 'API',
  
  // Topics (8)
  'Tutorial', 'Case-Study', 'Best-Practices', 'Automation', 
  'Business-Intelligence', 'Education', 'Open-Source', 'Enterprise',
  
  // Industry (7)
  'FinTech', 'EdTech', 'E-Commerce', 'Healthcare', 'Productivity', 'Gaming', 'SaaS'
];

const FORBIDDEN_TAGS = [
  // Personal names
  'Kenneth Namias', 'John Kenneth Ryan Namias', 'Kenneth',
  
  // Institution names
  'UCC Congressional Campus', 'UCC',
  
  // Generic terms
  'Programming', 'Development', 'Technology', 'Software', 'Computer',
  
  // Demo/Example tags
  'Demo', 'Example', 'Test', 'Sample', 'Foo', 'Bar', 'Fuwari',
  
  // Redundant technology terms
  'React.js', 'JavaScript', 'Express.js', 'PostgreSQL', 'MongoDB',
  'OpenAI', 'Machine Learning', 'Azure', 'Railway', 'Vercel'
];

const MAX_TAGS = 5;
const MIN_TAGS = 2;

class ContentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.validFiles = 0;
    this.totalFiles = 0;
  }

  extractFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);
    
    if (!match) return null;
    
    const frontmatter = {};
    const lines = match[1].split('\n');
    
    for (const line of lines) {
      if (line.includes('title:')) {
        const titleMatch = line.match(/title:\s*["']?([^"'\n]*)["']?/);
        if (titleMatch) frontmatter.title = titleMatch[1];
      }
      
      if (line.includes('category:')) {
        const categoryMatch = line.match(/category:\s*["']?([^"'\n]*)["']?/);
        if (categoryMatch) frontmatter.category = categoryMatch[1];
      }
      
      if (line.includes('tags:')) {
        const tagsMatch = line.match(/tags:\s*\[([^\]]*)\]/);
        if (tagsMatch) {
          frontmatter.tags = tagsMatch[1]
            .split(',')
            .map(tag => tag.trim().replace(/["']/g, ''))
            .filter(tag => tag.length > 0);
        }
      }
      
      if (line.includes('draft:')) {
        const draftMatch = line.match(/draft:\s*(true|false)/);
        if (draftMatch) frontmatter.draft = draftMatch[1] === 'true';
      }
    }
    
    return frontmatter;
  }

  validateCategory(category, isProject = false) {
    const approvedCategories = isProject ? APPROVED_PROJECT_CATEGORIES : APPROVED_BLOG_CATEGORIES;
    
    if (!category) {
      return { valid: false, message: 'Missing category' };
    }
    
    if (!approvedCategories.includes(category)) {
      return { 
        valid: false, 
        message: `Invalid category: "${category}". Must be one of: ${approvedCategories.join(', ')}` 
      };
    }
    
    return { valid: true };
  }

  validateTags(tags) {
    const issues = [];
    
    if (!tags || tags.length === 0) {
      issues.push('Missing tags');
      return { valid: false, issues };
    }
    
    if (tags.length < MIN_TAGS) {
      issues.push(`Too few tags (${tags.length}). Minimum: ${MIN_TAGS}`);
    }
    
    if (tags.length > MAX_TAGS) {
      issues.push(`Too many tags (${tags.length}). Maximum: ${MAX_TAGS}`);
    }
    
    // Check for forbidden tags
    const forbiddenFound = tags.filter(tag => FORBIDDEN_TAGS.includes(tag));
    if (forbiddenFound.length > 0) {
      issues.push(`Forbidden tags found: ${forbiddenFound.join(', ')}`);
    }
    
    // Check for unapproved tags
    const unapprovedTags = tags.filter(tag => !APPROVED_TAGS.includes(tag));
    if (unapprovedTags.length > 0) {
      issues.push(`Unapproved tags: ${unapprovedTags.join(', ')}`);
    }
    
    // Check for duplicates
    const duplicates = tags.filter((tag, index) => tags.indexOf(tag) !== index);
    if (duplicates.length > 0) {
      issues.push(`Duplicate tags: ${duplicates.join(', ')}`);
    }
    
    return { valid: issues.length === 0, issues };
  }

  validateContent(filePath, isProject = false) {
    this.totalFiles++;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const frontmatter = this.extractFrontmatter(content);
      
      if (!frontmatter) {
        this.errors.push(`${filePath}: No frontmatter found`);
        return;
      }
      
      // Skip drafts
      if (frontmatter.draft) {
        console.log(`⏭️  Skipping draft: ${path.basename(filePath)}`);
        return;
      }
      
      const fileErrors = [];
      const fileWarnings = [];
      
      // Validate category
      const categoryValidation = this.validateCategory(frontmatter.category, isProject);
      if (!categoryValidation.valid) {
        fileErrors.push(`Category: ${categoryValidation.message}`);
      }
      
      // Validate tags
      const tagValidation = this.validateTags(frontmatter.tags);
      if (!tagValidation.valid) {
        for (const issue of tagValidation.issues) {
          fileErrors.push(`Tags: ${issue}`);
        }
      }
      
      // Check tag composition requirements
      if (frontmatter.tags && frontmatter.tags.length > 0) {
        const technologyTags = ['React', 'TypeScript', 'Node.js', 'AI/ML', 'DevOps', 'Full-Stack', 'Database', 'Cloud', 'Mobile', 'API'];
        const topicTags = ['Tutorial', 'Case-Study', 'Best-Practices', 'Automation', 'Business-Intelligence', 'Education', 'Open-Source', 'Enterprise'];
        
        const hasTechnologyTag = frontmatter.tags.some(tag => technologyTags.includes(tag));
        const hasTopicTag = frontmatter.tags.some(tag => topicTags.includes(tag));
        
        if (!hasTechnologyTag) {
          fileWarnings.push('Missing technology tag (recommended)');
        }
        
        if (!hasTopicTag) {
          fileWarnings.push('Missing topic tag (recommended)');
        }
      }
      
      // Report results
      const fileName = path.basename(filePath);
      const relativePath = path.relative(process.cwd(), filePath);
      
      if (fileErrors.length === 0) {
        this.validFiles++;
        console.log(`✅ ${fileName}`);
        
        if (fileWarnings.length > 0) {
          fileWarnings.forEach(warning => {
            console.log(`   ⚠️  ${warning}`);
            this.warnings.push(`${relativePath}: ${warning}`);
          });
        }
      } else {
        console.log(`❌ ${fileName}`);
        fileErrors.forEach(error => {
          console.log(`   🚨 ${error}`);
          this.errors.push(`${relativePath}: ${error}`);
        });
        
        if (fileWarnings.length > 0) {
          fileWarnings.forEach(warning => {
            console.log(`   ⚠️  ${warning}`);
            this.warnings.push(`${relativePath}: ${warning}`);
          });
        }
      }
      
      // Show current content for reference
      if (frontmatter.category || frontmatter.tags) {
        console.log(`   📂 Category: ${frontmatter.category || 'None'}`);
        console.log(`   🏷️  Tags: ${frontmatter.tags ? frontmatter.tags.join(', ') : 'None'}`);
      }
      
    } catch (error) {
      this.errors.push(`${filePath}: Error reading file - ${error.message}`);
    }
  }

  validateDirectory(dirPath, isProject = false) {
    if (!fs.existsSync(dirPath)) {
      console.log(`❌ Directory not found: ${dirPath}`);
      return;
    }
    
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);
      
      if (file.isDirectory()) {
        this.validateDirectory(fullPath, isProject);
      } else if (file.name.endsWith('.md') && file.name !== 'README.md') {
        this.validateContent(fullPath, isProject);
      }
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 VALIDATION REPORT');
    console.log('='.repeat(60));
    
    const successRate = ((this.validFiles / this.totalFiles) * 100).toFixed(1);
    
    console.log(`📈 Success Rate: ${successRate}% (${this.validFiles}/${this.totalFiles} files)`);
    console.log(`🚨 Errors: ${this.errors.length}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n🚨 ERRORS TO FIX:');
      for (const error of this.errors) {
        console.log(`   ${error}`);
      }
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS (RECOMMENDATIONS):');
      for (const warning of this.warnings) {
        console.log(`   ${warning}`);
      }
    }
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('\n🎉 ALL CONTENT PASSES VALIDATION!');
      console.log('Your content taxonomy is perfectly optimized! 🚀');
    } else {
      console.log('\n📋 NEXT STEPS:');
      if (this.errors.length > 0) {
        console.log('1. Fix all errors listed above');
        console.log('2. Run validation again');
      }
      if (this.warnings.length > 0) {
        console.log('3. Consider addressing warnings for optimal organization');
      }
      console.log('4. Use the migration script to automate fixes where possible');
    }
    
    console.log('\n📚 REFERENCE:');
    console.log('- Approved blog categories:', APPROVED_BLOG_CATEGORIES.join(', '));
    console.log('- Approved project categories:', APPROVED_PROJECT_CATEGORIES.join(', '));
    console.log('- Total approved tags:', APPROVED_TAGS.length);
    console.log('- Tag limits: Min', MIN_TAGS, '| Max', MAX_TAGS);
  }

  run() {
    console.log('🔍 Content Taxonomy Validation Started...\n');
    
    const postsDir = path.join(__dirname, 'src', 'content', 'posts');
    const projectsDir = path.join(__dirname, 'src', 'content', 'projects');
    
    console.log('📝 Validating Blog Posts...');
    this.validateDirectory(postsDir, false);
    
    console.log('\n🚀 Validating Projects...');
    this.validateDirectory(projectsDir, true);
    
    this.generateReport();
  }
}

// Run validation
const validator = new ContentValidator();
validator.run();