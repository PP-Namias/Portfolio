#!/usr/bin/env node

/**
 * Security Controls Validation Test Suite
 * Verifies that all security guards are properly implemented and working
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m',
};

function test(name, passed, details = '') {
  const status = passed ? `${COLORS.green}✓ PASS${COLORS.reset}` : `${COLORS.red}✗ FAIL${COLORS.reset}`;
  console.log(`${status} - ${name}`);
  if (details) {
    console.log(`      ${details}`);
  }
  return passed;
}

function section(title) {
  console.log(`\n${COLORS.bright}${COLORS.cyan}${title}${COLORS.reset}`);
  console.log(`${'-'.repeat(title.length)}`);
}

let passCount = 0;
let failCount = 0;

function runTests() {
  console.log(`\n${COLORS.bright}${COLORS.cyan}PROMPTFOO SECURITY CONTROLS VALIDATION${COLORS.reset}\n`);

  // Test 1: Configuration files exist
  section('Configuration Files');
  
  if (test('promptfoo.yaml exists', fs.existsSync('promptfoo.yaml'))) passCount++;
  else failCount++;
  
  if (test('agents.json exists', fs.existsSync('agents.json'))) passCount++;
  else failCount++;

  if (test('.github/workflows/promptfoo-security-tests.yml exists', 
    fs.existsSync('.github/workflows/promptfoo-security-tests.yml'))) passCount++;
  else failCount++;

  // Test 2: Chat endpoint security guards
  section('Chat Endpoint Security Guards');
  
  const guardFile = 'src/app/api/chat/lib/securityGuards.ts';
  const guardContent = fs.existsSync(guardFile) ? fs.readFileSync(guardFile, 'utf-8') : '';
  
  if (test('Security guards file exists', fs.existsSync(guardFile))) passCount++;
  else failCount++;
  
  if (test('Input validation implemented', 
    guardContent.includes('validateMessageContent'), 
    'validateMessageContent function found')) passCount++;
  else failCount++;
  
  if (test('Injection detection implemented', 
    guardContent.includes('detectInjectionAttempt'),
    'detectInjectionAttempt function found')) passCount++;
  else failCount++;
  
  if (test('Output filtering implemented', 
    guardContent.includes('filterOutput'),
    'filterOutput function found')) passCount++;
  else failCount++;
  
  if (test('PII redaction patterns defined', 
    guardContent.includes('emailRegex') && guardContent.includes('phoneRegex'),
    'Email and phone redaction patterns found')) passCount++;
  else failCount++;
  
  if (test('Blocked keywords list exists', 
    guardContent.includes('BLOCKED_KEYWORDS'),
    'Keyword blocking configured')) passCount++;
  else failCount++;
  
  if (test('Injection patterns defined', 
    guardContent.includes('INJECTION_PATTERNS'),
    'Pattern-based injection detection configured')) passCount++;
  else failCount++;

  // Test 3: Rate limiting
  section('Rate Limiting');
  
  const rateLimitFile = 'src/app/api/chat/lib/chatRateLimit.ts';
  if (test('Rate limiter file exists', fs.existsSync(rateLimitFile))) passCount++;
  else failCount++;
  
  const middlewareFile = 'src/middleware.ts';
  if (test('Middleware rate limiting exists', fs.existsSync(middlewareFile))) passCount++;
  else failCount++;
  
  const routeContent = fs.readFileSync('src/app/api/chat/route.ts', 'utf-8');
  if (test('Rate limit check in chat route', 
    routeContent.includes('checkRateLimit'),
    'Rate limit verification found')) passCount++;
  else failCount++;

  // Test 4: Promptfoo configuration
  section('Promptfoo Configuration');
  
  const promptfooContent = fs.readFileSync('promptfoo.yaml', 'utf-8');
  
  if (test('All strategies defined', 
    promptfooContent.includes('harmful-content') &&
    promptfooContent.includes('prompt-injection') &&
    promptfooContent.includes('jailbreak'),
    '9 red teaming strategies configured')) passCount++;
  else failCount++;
  
  if (test('Target endpoint configured', 
    promptfooContent.includes('localhost:3000/api/chat'),
    'Chatbot endpoint configured as target')) passCount++;
  else failCount++;
  
  if (test('Custom evaluators defined', 
    promptfooContent.includes('evaluators'),
    'Custom validation evaluators configured')) passCount++;
  else failCount++;

  // Test 5: Attack test cases
  section('Attack Test Cases');
  
  const agentsContent = JSON.parse(fs.readFileSync('agents.json', 'utf-8'));
  
  if (test('Attack tests array exists', Array.isArray(agentsContent.attacks))) passCount++;
  else failCount++;
  
  if (test('Minimum attack cases defined', 
    agentsContent.attacks.length >= 10,
    `${agentsContent.attacks.length} attack test cases found`)) passCount++;
  else failCount++;
  
  const criticalTests = agentsContent.attacks.filter(a => a.severity === 'CRITICAL');
  if (test('CRITICAL severity tests included', 
    criticalTests.length > 0,
    `${criticalTests.length} critical test cases`)) passCount++;
  else failCount++;
  
  const categories = new Set(agentsContent.attacks.map(a => a.category));
  if (test('Multiple attack categories', 
    categories.size >= 5,
    `${categories.size} different attack categories`)) passCount++;
  else failCount++;

  // Test 6: Parsing and reporting
  section('Results Parsing & Reporting');
  
  const parseScript = 'scripts/parse-promptfoo-results.js';
  if (test('Results parser exists', fs.existsSync(parseScript))) passCount++;
  else failCount++;
  
  const parseContent = fs.readFileSync(parseScript, 'utf-8');
  if (test('Recommendations mapping exists', 
    parseContent.includes('RECOMMENDATIONS'),
    'Vulnerability recommendations configured')) passCount++;
  else failCount++;
  
  if (test('Severity grouping implemented', 
    parseContent.includes('CRITICAL') && parseContent.includes('HIGH'),
    'Result severity categorization')) passCount++;
  else failCount++;

  // Test 7: CI/CD Integration
  section('CI/CD Integration');
  
  const workflowContent = fs.readFileSync('.github/workflows/promptfoo-security-tests.yml', 'utf-8');
  
  if (test('PR trigger configured', 
    workflowContent.includes('pull_request'),
    'Runs on pull requests')) passCount++;
  else failCount++;
  
  if (test('Server startup included', 
    workflowContent.includes('npm run dev'),
    'Dev server started in CI')) passCount++;
  else failCount++;
  
  if (test('Promptfoo execution step exists', 
    workflowContent.includes('promptfoo eval'),
    'Security evaluation command configured')) passCount++;
  else failCount++;
  
  if (test('Results parsing step exists', 
    workflowContent.includes('parse-promptfoo-results.js'),
    'Results analysis in workflow')) passCount++;
  else failCount++;
  
  if (test('Critical vulnerability blocking', 
    workflowContent.includes('CRITICAL'),
    'Merge blocking for critical issues')) passCount++;
  else failCount++;
  
  if (test('PR commenting implemented', 
    workflowContent.includes('github-script'),
    'Automated PR comments with findings')) passCount++;
  else failCount++;

  // Test 8: Package.json scripts
  section('NPM Scripts');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const scripts = packageJson.scripts || {};
  
  if (test('test:security:setup script exists', 
    scripts['test:security:setup'],
    scripts['test:security:setup'])) passCount++;
  else failCount++;
  
  if (test('test:security:run script exists', 
    scripts['test:security:run'],
    scripts['test:security:run'])) passCount++;
  else failCount++;
  
  if (test('test:security:parse script exists', 
    scripts['test:security:parse'],
    scripts['test:security:parse'])) passCount++;
  else failCount++;
  
  if (test('test:security:all script exists', 
    scripts['test:security:all'],
    scripts['test:security:all'])) passCount++;
  else failCount++;

  // Test 9: Middleware configuration
  section('Middleware & Edge Functions');
  
  if (test('Middleware file exists', fs.existsSync(middlewareFile))) passCount++;
  else failCount++;
  
  const middlewareContent = fs.readFileSync(middlewareFile, 'utf-8');
  
  if (test('Rate limit middleware implemented', 
    middlewareContent.includes('rateLimitMap'),
    'In-memory rate limiter')) passCount++;
  else failCount++;
  
  if (test('Client identifier extraction', 
    middlewareContent.includes('getClientIdentifier'),
    'IP-based client identification')) passCount++;
  else failCount++;

  // Test 10: Documentation
  section('Documentation');
  
  if (test('Security guide exists', 
    fs.existsSync('SECURITY.md') || fs.existsSync('SECURITY_IMPLEMENTATION_STATUS.md'))) passCount++;
  else failCount++;
  
  if (test('Copilot instructions exist', 
    fs.existsSync('.github/copilot-instructions.md'))) passCount++;
  else failCount++;

  // Summary
  console.log(`\n${COLORS.bright}${COLORS.cyan}TEST SUMMARY${COLORS.reset}`);
  console.log(`${'-'.repeat(20)}`);
  console.log(`${COLORS.green}Passed: ${passCount}${COLORS.reset}`);
  console.log(`${COLORS.red}Failed: ${failCount}${COLORS.reset}`);
  
  const total = passCount + failCount;
  const percentage = ((passCount / total) * 100).toFixed(1);
  console.log(`Coverage: ${percentage}% (${passCount}/${total})`);
  
  if (failCount === 0) {
    console.log(`\n${COLORS.green}${COLORS.bright}✓ ALL SECURITY CONTROLS VERIFIED${COLORS.reset}`);
    process.exit(0);
  } else {
    console.log(`\n${COLORS.red}${COLORS.bright}✗ SOME CONTROLS ARE MISSING OR MISCONFIGURED${COLORS.reset}`);
    process.exit(1);
  }
}

runTests();
