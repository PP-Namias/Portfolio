#!/usr/bin/env node

/**
 * Local Security Test Runner
 * Runs comprehensive local security tests without CI/CD
 * Usage: npm run test:security:local
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(level, message) {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const prefix = `[${timestamp}]`;
  
  switch (level) {
    case 'info':
      console.log(`${COLORS.cyan}${prefix}${COLORS.reset} ${message}`);
      break;
    case 'success':
      console.log(`${COLORS.green}${prefix}${COLORS.reset} ${COLORS.green}✓${COLORS.reset} ${message}`);
      break;
    case 'warn':
      console.log(`${COLORS.yellow}${prefix}${COLORS.reset} ${COLORS.yellow}⚠${COLORS.reset} ${message}`);
      break;
    case 'error':
      console.log(`${COLORS.red}${prefix}${COLORS.reset} ${COLORS.red}✗${COLORS.reset} ${message}`);
      break;
  }
}

function section(title) {
  console.log(`\n${COLORS.bright}${COLORS.blue}${'='.repeat(60)}${COLORS.reset}`);
  console.log(`${COLORS.bright}${title}${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.blue}${'='.repeat(60)}${COLORS.reset}\n`);
}

async function runCommand(cmd, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      resolve(code);
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

async function waitForServer(maxAttempts = 30) {
  log('info', 'Waiting for dev server to be ready...');
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'GET',
        timeout: 2000,
      });
      if (response.ok || response.status === 405) {
        log('success', 'Dev server is ready!');
        return true;
      }
    } catch (e) {
      // Server not ready yet
    }
    
    log('info', `Attempt ${i + 1}/${maxAttempts}: Waiting for server...`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  
  return false;
}

async function runSecurityTests() {
  section('PROMPTFOO AI CHATBOT SECURITY TEST SUITE');
  
  try {
    // Step 1: Check prerequisites
    section('1. Prerequisites Check');
    
    log('info', 'Checking Node.js version...');
    const nodeVersion = await runCommand('node', ['--version']);
    if (nodeVersion === 0) {
      log('success', 'Node.js is available');
    }
    
    log('info', 'Checking Promptfoo installation...');
    const promptfooCheck = await runCommand('npx', ['promptfoo', '--version']);
    if (promptfooCheck === 0) {
      log('success', 'Promptfoo is installed');
    } else {
      log('warn', 'Installing Promptfoo...');
      await runCommand('npm', ['install', '-D', 'promptfoo', '@promptfoo/redteam']);
    }
    
    // Step 2: Verify configuration files
    section('2. Configuration Verification');
    
    const configFiles = ['promptfoo.yaml', 'agents.json'];
    for (const file of configFiles) {
      if (fs.existsSync(file)) {
        const size = fs.statSync(file).size;
        log('success', `${file} found (${size} bytes)`);
      } else {
        log('error', `${file} not found!`);
        process.exit(1);
      }
    }
    
    // Step 3: Security guards check
    section('3. Security Guards Verification');
    
    const guardFile = 'src/app/api/chat/lib/securityGuards.ts';
    if (fs.existsSync(guardFile)) {
      const content = fs.readFileSync(guardFile, 'utf-8');
      const hasFiltering = content.includes('filterOutput');
      const hasInjectionDetection = content.includes('detectInjectionAttempt');
      const hasRateLimit = content.includes('checkRateLimit');
      
      log('success', `Security guards file found`);
      log('info', `  - Output filtering: ${hasFiltering ? '✓' : '✗'}`);
      log('info', `  - Injection detection: ${hasInjectionDetection ? '✓' : '✗'}`);
      log('info', `  - Rate limiting: ${hasRateLimit ? '✓' : '✗'}`);
    } else {
      log('error', `Security guards not found at ${guardFile}`);
      process.exit(1);
    }
    
    // Step 4: Start development server
    section('4. Development Server Start');
    
    log('info', 'Starting Next.js development server...');
    const serverProcess = spawn('npm', ['run', 'dev'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: true,
    });
    
    const serverReady = await waitForServer();
    if (!serverReady) {
      log('error', 'Development server failed to start!');
      process.kill(-serverProcess.pid);
      process.exit(1);
    }
    
    // Step 5: Run Promptfoo setup
    section('5. Promptfoo Setup');
    
    log('info', 'Running Promptfoo red team setup...');
    await runCommand('npx', ['promptfoo', 'redteam', 'setup', '--force']);
    log('success', 'Promptfoo red team setup complete');
    
    // Step 6: Execute security tests
    section('6. Security Test Execution');
    
    log('info', 'Running security evaluation...');
    const testResult = await runCommand('npx', [
      'promptfoo',
      'eval',
      '--config',
      'promptfoo.yaml',
      '--output',
      './promptfoo-results.json',
      '--no-cache',
      '--verbose',
    ]);
    
    if (testResult === 0) {
      log('success', 'Security tests completed');
    } else {
      log('warn', 'Security tests completed with warnings');
    }
    
    // Step 7: Parse results
    section('7. Results Analysis');
    
    log('info', 'Parsing test results...');
    await runCommand('node', ['scripts/parse-promptfoo-results.js']);
    
    // Step 8: Display findings
    section('8. Security Findings');
    
    if (fs.existsSync('promptfoo-findings.json')) {
      const findings = JSON.parse(fs.readFileSync('promptfoo-findings.json', 'utf-8'));
      
      log('info', `Total Vulnerabilities: ${findings.vulnerabilitiesFound}`);
      log('info', `Assessment: ${findings.assessment}`);
      
      if (findings.summary) {
        log('info', `Passed: ${findings.summary.passed || 0}`);
        log('info', `Failed: ${findings.summary.failed || 0}`);
        log('info', `Inconclusive: ${findings.summary.inconclusive || 0}`);
      }
      
      if (findings.vulnerabilitiesFound > 0) {
        log('warn', `\nDetailed Findings:`);
        
        const bySeverity = {
          CRITICAL: [],
          HIGH: [],
          MEDIUM: [],
          LOW: [],
        };
        
        findings.findings.forEach((f) => {
          if (bySeverity[f.severity]) {
            bySeverity[f.severity].push(f);
          }
        });
        
        ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].forEach((severity) => {
          if (bySeverity[severity].length > 0) {
            log('warn', `\n${severity} Issues (${bySeverity[severity].length}):`);
            bySeverity[severity].forEach((f) => {
              log('warn', `  - ${f.name}`);
              log('info', `    Category: ${f.category}`);
              log('info', `    Recommendation: ${f.recommendation}`);
            });
          }
        });
      } else {
        log('success', 'No vulnerabilities detected!');
      }
    } else {
      log('warn', 'Results file not found');
    }
    
    // Step 9: Cleanup
    section('9. Cleanup');
    
    log('info', 'Stopping development server...');
    process.kill(-serverProcess.pid);
    
    log('success', 'Cleanup complete');
    
    // Step 10: Final summary
    section('SECURITY TEST SUMMARY');
    
    if (fs.existsSync('promptfoo-findings.json')) {
      const findings = JSON.parse(fs.readFileSync('promptfoo-findings.json', 'utf-8'));
      
      if (findings.vulnerabilitiesFound === 0) {
        log('success', 'All security tests PASSED!');
        log('success', 'AI Chatbot is secure for deployment.');
        process.exit(0);
      } else {
        log('error', `${findings.vulnerabilitiesFound} vulnerabilities found.`);
        log('warn', 'Please review findings and apply recommended fixes.');
        process.exit(1);
      }
    }
  } catch (error) {
    log('error', `Test suite failed: ${error.message}`);
    process.exit(1);
  }
}

// Run tests
runSecurityTests();
