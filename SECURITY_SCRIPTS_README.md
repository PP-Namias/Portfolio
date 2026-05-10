/**
 * Package.json Scripts for Security Testing
 * Add these scripts to package.json for easy security testing
 */

// Scripts to add to package.json:
{
  "test:security:local": "node scripts/test-security-local.js",
  "test:security:setup": "npx promptfoo redteam setup --force",
  "test:security:run": "npx promptfoo eval --config promptfoo.yaml --output ./promptfoo-results.json --no-cache",
  "test:security:parse": "node scripts/parse-promptfoo-results.js",
  "test:security:all": "npm run test:security:local && npm run test:security:run && npm run test:security:parse",
  "test:security:view": "npx promptfoo view"
}

// Usage:
// npm run test:security:local       - Run local tests against running dev server
// npm run test:security:setup       - Setup Promptfoo red team
// npm run test:security:run         - Run full Promptfoo security tests
// npm run test:security:parse       - Parse and display results
// npm run test:security:all         - Run all security tests
// npm run test:security:view        - View interactive Promptfoo dashboard
