#!/usr/bin/env node

/**
 * Content Taxonomy Migration Script
 * Automatically updates blog posts and projects with optimized categories and tags
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the new taxonomy structure
const BLOG_CATEGORY_MAP = {
  'Examples': 'DELETE', // Remove example content
  'Development Operations': 'Technical',
  'Professional': 'Career',
  'Technical': 'Technical',
  'Guides': 'Insights',
  'Front-end': 'Technical',
  'Professional Profile': 'Career',
  'Personal': 'Personal',
  'Education & Speaking': 'Insights',
  'AI Projects': 'Projects',
  'Professional Experience': 'Career',
  'About Me': 'Personal'
};

const PROJECT_CATEGORY_MAP = {
  'Design & Development': 'Design & Creative',
  'Visual Design': 'Design & Creative',
  'Web Development': 'Web Development',
  'AI & Gaming': 'AI & Automation',
  'Enterprise Software': 'Enterprise Solutions',
  'E-Commerce': 'Web Development',
  'Full-Stack Development': 'Web Development',
  'AI & Automation': 'AI & Automation',
  'AI Development': 'AI & Automation'
};

// Standardized tags mapping
const TAG_STANDARDIZATION_MAP = {
  // Technology standardization
  'JavaScript & TypeScript': 'TypeScript',
  'React.js': 'React',
  'React TypeScript': 'React',
  'Express.js': 'Node.js',
  'PostgreSQL': 'Database',
  'MongoDB': 'Database',
  'OpenAI': 'AI/ML',
  'Machine Learning': 'AI/ML',
  'Azure': 'Cloud',
  'Railway': 'Cloud',
  'Vercel': 'Cloud',
  'GitHub Actions': 'DevOps',
  'CI/CD': 'DevOps',
  
  // Remove redundant personal tags
  'Kenneth Namias': '',
  'Kenneth Namias Career': '',
  'John Kenneth Ryan Namias': '',
  'UCC Congressional Campus': 'Education',
  
  // Topic standardization
  'Programming': 'Tutorial',
  'Development Tools': 'Best-Practices',
  'Technology Stack': '',
  'Blogging': '',
  'Demo': '',
  'Example': '',
  'Foo': '',
  'Bar': '',
  'Fuwari': '',
  
  // Specific consolidations
  'Technical Skills': 'Tutorial',
  'Full Stack Developer': 'Full-Stack',
  'Full Stack': 'Full-Stack',
  'AI Agent': 'AI/ML',
  'Business Intelligence': 'Enterprise',
  'Financial Technology': 'FinTech',
  'Data Analytics': 'AI/ML',
  'Process Optimization': 'Automation',
  'Educational Technology': 'EdTech',
  'Workflow Automation': 'Automation',
  'AI Assistants': 'AI/ML',
  'GPT Technology': 'AI/ML',
  'Business Automation': 'Automation',
  'Productivity Tools': 'Productivity',
  'Custom AI Solutions': 'AI/ML',
  'Development Infrastructure': 'DevOps',
  'Automated Testing': 'DevOps',
  'Environment Setup': 'DevOps',
  'N8N Automation': 'Automation'
};

// Maximum allowed tags per content
const MAX_TAGS_PER_CONTENT = 5;

// Core approved tags
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

function updateFrontmatter(content, newCategory, newTags) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    console.log('No frontmatter found');
    return content;
  }
  
  let frontmatter = match[1];
  
  // Update category
  if (newCategory && newCategory !== 'DELETE') {
    frontmatter = frontmatter.replace(/category:\s*["']?[^"'\n]*["']?/g, `category: "${newCategory}"`);
  }
  
  // Update tags
  if (newTags && newTags.length > 0) {
    const tagsString = `tags: [${newTags.map(tag => `"${tag}"`).join(', ')}]`;
    frontmatter = frontmatter.replace(/tags:\s*\[[^\]]*\]/g, tagsString);
  }
  
  return content.replace(frontmatterRegex, `---\n${frontmatter}\n---`);
}

function standardizeTags(tags) {
  if (!tags) return [];
  
  let standardizedTags = tags.map(tag => {
    // Apply standardization map
    const standardized = TAG_STANDARDIZATION_MAP[tag];
    if (standardized === '') return null; // Remove this tag
    return standardized || tag;
  }).filter(tag => tag !== null);
  
  // Remove duplicates
  standardizedTags = [...new Set(standardizedTags)];
  
  // Filter to only approved tags
  standardizedTags = standardizedTags.filter(tag => APPROVED_TAGS.includes(tag));
  
  // Limit to maximum allowed
  return standardizedTags.slice(0, MAX_TAGS_PER_CONTENT);
}

function extractFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return null;
  
  const frontmatter = {};
  const lines = match[1].split('\n');
  
  for (const line of lines) {
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
  }
  
  return frontmatter;
}

function processFile(filePath, categoryMap) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatter = extractFrontmatter(content);
    
    if (!frontmatter) {
      console.log(`No frontmatter found in ${filePath}`);
      return;
    }
    
    console.log(`\n📄 Processing: ${path.basename(filePath)}`);
    console.log(`   Current category: ${frontmatter.category}`);
    console.log(`   Current tags: ${frontmatter.tags ? frontmatter.tags.join(', ') : 'none'}`);
    
    // Map category
    const newCategory = categoryMap[frontmatter.category] || frontmatter.category;
    
    if (newCategory === 'DELETE') {
      console.log(`   ❌ MARKED FOR DELETION (Example/Demo content)`);
      return;
    }
    
    // Standardize tags
    const newTags = standardizeTags(frontmatter.tags);
    
    console.log(`   ✅ New category: ${newCategory}`);
    console.log(`   ✅ New tags: ${newTags.join(', ')}`);
    
    // Update content
    const updatedContent = updateFrontmatter(content, newCategory, newTags);
    
    // Write back to file
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`   💾 Updated successfully`);
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath, categoryMap) {
  console.log(`\n🔍 Processing directory: ${dirPath}`);
  
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);
    
    if (file.isDirectory()) {
      processDirectory(fullPath, categoryMap);
    } else if (file.name.endsWith('.md')) {
      processFile(fullPath, categoryMap);
    }
  }
}

function main() {
  console.log('🚀 Starting Content Taxonomy Migration...\n');
  
  const postsDir = path.join(__dirname, 'src', 'content', 'posts');
  const projectsDir = path.join(__dirname, 'src', 'content', 'projects');
  
  console.log('📝 Processing Blog Posts...');
  if (fs.existsSync(postsDir)) {
    processDirectory(postsDir, BLOG_CATEGORY_MAP);
  } else {
    console.log('❌ Posts directory not found');
  }
  
  console.log('\n🚀 Processing Projects...');
  if (fs.existsSync(projectsDir)) {
    processDirectory(projectsDir, PROJECT_CATEGORY_MAP);
  } else {
    console.log('❌ Projects directory not found');
  }
  
  console.log('\n✅ Migration completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Review the changes made to your content files');
  console.log('2. Remove any files marked for deletion');
  console.log('3. Test your site to ensure everything works correctly');
  console.log('4. Update your navigation and filtering components if needed');
  console.log('5. Create tag and category landing pages');
}

// Run the migration
main();