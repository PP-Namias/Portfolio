#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();

const findings = {
  summary: { errorCount: 0, warningCount: 0, note: 'static security header verification' },
  checks: [],
};

function readIfExists(path) {
  const full = resolve(root, path);
  if (!existsSync(full)) return null;
  return readFileSync(full, 'utf8');
}

function check(name, ok, detail) {
  findings.checks.push({ name, status: ok ? 'pass' : 'fail', detail });
  if (!ok) findings.summary.errorCount += 1;
}

const nextConfig = readIfExists('next.config.js') || '';

check(
  'csp-present',
  /Content-Security-Policy/.test(nextConfig) || /Content-Security-Policy/.test(nextConfig.replaceAll('\n', ' ')),
  'Content-Security-Policy header defined in next.config.js'
);

check(
  'hsts-present',
  /Strict-Transport-Security/.test(nextConfig),
  'Strict-Transport-Security header set (HSTS)'
);

check(
  'x-content-type-options',
  /X-Content-Type-Options/.test(nextConfig) && /nosniff/.test(nextConfig),
  'X-Content-Type-Options: nosniff'
);

check(
  'referrer-policy',
  /Referrer-Policy/.test(nextConfig),
  'Referrer-Policy header set'
);

check(
  'permissions-policy',
  /Permissions-Policy/.test(nextConfig),
  'Permissions-Policy header restricts camera/mic/geolocation'
);

check(
  'coep-corp-coop',
  /Cross-Origin-Embedder-Policy/.test(nextConfig) && /Cross-Origin-Resource-Policy/.test(nextConfig) && /Cross-Origin-Opener-Policy/.test(nextConfig),
  'Cross-Origin isolation headers present'
);

check(
  'powered-by-disabled',
  /poweredByHeader\s*[:=]\s*false/.test(nextConfig),
  'X-Powered-By header disabled'
);

const pkg = readIfExists('package.json') || '';
let parsedPkg = null;
try { parsedPkg = JSON.parse(pkg); } catch {}

if (parsedPkg) {
  const deps = { ...(parsedPkg.dependencies || {}), ...(parsedPkg.devDependencies || {}) };

  const suspicious = [
    'eval', 'vm2', 'node-eval',
  ];
  const found = suspicious.filter((s) => Object.keys(deps).some((d) => d.toLowerCase().includes(s)));
  check(
    'no-dynamic-eval-deps',
    found.length === 0,
    found.length === 0 ? 'No dynamic-eval dependencies detected' : `Suspicious deps: ${found.join(', ')}`
  );

  check(
    'react-doctor-pinned',
    typeof deps['react-doctor'] === 'string' && /^\d+\.\d+\.\d+$/.test(deps['react-doctor']),
    `react-doctor pinned to exact version in package.json (found: ${deps['react-doctor']})`
  );
}

const cspViolationRoute = readIfExists('src/app/api/csp-violation/route.ts');
check(
  'csp-violation-route',
  !!cspViolationRoute,
  'CSP violation report endpoint exists at /api/csp-violation'
);

console.log(JSON.stringify(findings, null, 2));
process.exit(findings.summary.errorCount === 0 ? 0 : 1);
