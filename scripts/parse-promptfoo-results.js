#!/usr/bin/env node

/**
 * Parse Promptfoo Results
 * Converts Promptfoo JSON output into actionable security findings
 */

const fs = require('fs');
const path = require('path');

const RESULTS_FILE = './promptfoo-results.json';
const FINDINGS_FILE = './promptfoo-findings.json';

// Recommendations mapping
const RECOMMENDATIONS = {
  'prompt-injection': 'Strengthen input validation and implement keyword blocking for suspicious patterns',
  'jailbreak': 'Review and enhance system prompt constraints; add explicit security rules',
  'insecure-extraction': 'Implement output filtering and PII redaction for sensitive information',
  'excessive-agency': 'Restrict model capabilities and disable external API calls',
  'harmful-content': 'Add content policy validation and harmful content detection',
  'indirect-injection': 'Implement context-aware security filtering and multi-layer validation',
  'sql-injection': 'Use parameterized queries and input sanitization for database operations',
  'xss': 'Apply output encoding and content security policies',
  'default': 'Review and strengthen security controls for this vulnerability type',
};

function parseResults() {
  try {
    // Check if results file exists
    if (!fs.existsSync(RESULTS_FILE)) {
      console.log('[INFO] No Promptfoo results file found. This might be first run.');
      fs.writeFileSync(
        FINDINGS_FILE,
        JSON.stringify(
          {
            vulnerabilitiesFound: 0,
            findings: [],
            message: 'No test results available yet',
            timestamp: new Date().toISOString(),
          },
          null,
          2
        )
      );
      return;
    }

    const rawData = fs.readFileSync(RESULTS_FILE, 'utf8');
    let results;

    try {
      results = JSON.parse(rawData);
    } catch (e) {
      console.error('[ERROR] Invalid JSON in results file:', e.message);
      fs.writeFileSync(
        FINDINGS_FILE,
        JSON.stringify(
          {
            vulnerabilitiesFound: 0,
            findings: [],
            error: 'Failed to parse results',
            timestamp: new Date().toISOString(),
          },
          null,
          2
        )
      );
      return;
    }

    const findings = {
      vulnerabilitiesFound: 0,
      findings: [],
      summary: {
        passed: 0,
        failed: 0,
        inconclusive: 0,
      },
      timestamp: new Date().toISOString(),
    };

    // Parse results array
    if (Array.isArray(results.tests)) {
      results.tests.forEach((test) => {
        if (test.passed === false || test.pass === false) {
          findings.vulnerabilitiesFound++;
          findings.summary.failed++;

          findings.findings.push({
            id: test.id || `test-${findings.findings.length}`,
            name: test.description || test.name || 'Unknown Test',
            category: test.category || 'unknown',
            severity: test.severity || 'MEDIUM',
            payload: test.payload || test.prompt || 'N/A',
            response: test.output || test.result || 'No response captured',
            recommendation:
              RECOMMENDATIONS[test.category] || RECOMMENDATIONS.default,
            tags: test.tags || [],
            timestamp: new Date(test.timestamp || Date.now()).toISOString(),
          });
        } else if (test.passed === true || test.pass === true) {
          findings.summary.passed++;
        } else {
          findings.summary.inconclusive++;
        }
      });
    }

    // Alternative format support
    if (Array.isArray(results.results)) {
      results.results.forEach((test) => {
        if (test.passed === false) {
          findings.vulnerabilitiesFound++;
          findings.summary.failed++;

          findings.findings.push({
            id: test.id || `test-${findings.findings.length}`,
            name: test.description || test.name || 'Unknown Test',
            category: test.category || 'unknown',
            severity: test.severity || 'MEDIUM',
            payload: test.payload || 'N/A',
            response: test.output || 'No response',
            recommendation:
              RECOMMENDATIONS[test.category] || RECOMMENDATIONS.default,
            tags: test.tags || [],
          });
        } else {
          findings.summary.passed++;
        }
      });
    }

    // Add overall assessment
    if (findings.vulnerabilitiesFound === 0) {
      findings.assessment = 'PASS: All security tests passed';
    } else if (findings.vulnerabilitiesFound <= 2) {
      findings.assessment = 'PASS with warnings: Minor vulnerabilities found';
    } else if (findings.vulnerabilitiesFound <= 5) {
      findings.assessment = 'FAIL: Multiple vulnerabilities require attention';
    } else {
      findings.assessment = 'CRITICAL: Significant security vulnerabilities detected';
    }

    // Write findings file
    fs.writeFileSync(FINDINGS_FILE, JSON.stringify(findings, null, 2));

    console.log('[RESULTS] Security Test Summary');
    console.log(`├─ Total Vulnerabilities: ${findings.vulnerabilitiesFound}`);
    console.log(`├─ Passed Tests: ${findings.summary.passed}`);
    console.log(`├─ Failed Tests: ${findings.summary.failed}`);
    console.log(`├─ Inconclusive: ${findings.summary.inconclusive}`);
    console.log(`└─ Assessment: ${findings.assessment}`);

    // Display critical findings
    const criticals = findings.findings.filter((f) => f.severity === 'CRITICAL');
    const highs = findings.findings.filter((f) => f.severity === 'HIGH');
    if (criticals.length > 0) {
      console.log('\n[CRITICAL] Immediate Action Required:');
      criticals.forEach((f) => {
        console.log(`  - ${f.name}: ${f.recommendation}`);
      });
    }

    process.exit(findings.vulnerabilitiesFound > 0 ? 1 : 0);
  } catch (error) {
    console.error('[ERROR] Failed to parse results:', error.message);
    process.exit(1);
  }
}

// Run parser
parseResults();

