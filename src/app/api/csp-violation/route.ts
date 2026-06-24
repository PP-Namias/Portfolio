import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const report = await request.json();

    const cspReport = report?.['csp-report'] || report;

    if (process.env.NODE_ENV !== 'production') {
      console.warn('[CSP Violation]', JSON.stringify({
        blockedURI: cspReport?.['blocked-uri'] || 'unknown',
        violatedDirective: cspReport?.['violated-directive'] || 'unknown',
        effectiveDirective: cspReport?.['effective-directive'] || 'unknown',
        originalPolicy: cspReport?.['original-policy']?.slice(0, 200) || 'unknown',
        sourceFile: cspReport?.['source-file'] || 'unknown',
        lineNumber: cspReport?.['line-number'] || 'unknown',
        columnNumber: cspReport?.['column-number'] || 'unknown',
        timestamp: new Date().toISOString(),
      }));
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid CSP report' }, { status: 400 });
  }
}
