'use client';

import { useState } from 'react';
import Head from 'next/head';
import useSWR from 'swr';

interface CanaryToken {
  id: string;
  name: string;
  type: string;
  path: string;
  status: string;
  triggerCount: number;
  lastTriggered: string | null;
  lastTriggerIp: string | null;
}

interface CanaryTrigger {
  id: string;
  tokenName: string;
  tokenType: string;
  tokenPath: string;
  ip: string;
  userAgent: string;
  method: string;
  timestamp: string;
}

interface CanaryStats {
  summary: {
    totalTokens: number;
    activeTokens: number;
    totalTriggers: number;
    recentTriggers: number;
  };
  tokens: CanaryToken[];
  recentTriggers: CanaryTrigger[];
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CanaryDashboard() {
  const [testResult, setTestResult] = useState<string | null>(null);
  const { data: stats, error, isLoading, mutate } = useSWR<CanaryStats>(
    '/api/canary/stats',
    fetcher,
    { revalidateOnFocus: false },
  );

  async function sendTestAlert() {
    try {
      setTestResult('Sending test alert...');
      const response = await fetch('/api/canary/test', { method: 'POST' });
      const data = await response.json();
      setTestResult(data.message);
    } catch {
      setTestResult('Failed to send test alert');
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Loading Canary Dashboard...</h1>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-red-500">Error: Failed to fetch canary stats</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Canary Token Dashboard</h1>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => mutate()}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={sendTestAlert}
              className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
            >
              Send Test Alert
            </button>
          </div>
        </div>

        {testResult && (
          <div className="bg-yellow-900 border border-yellow-600 p-4 rounded mb-8">
            {testResult}
          </div>
        )}

        {stats && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="text-4xl font-bold text-green-400">
                  {stats.summary.totalTokens}
                </div>
                <div className="text-gray-400">Total Tokens</div>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="text-4xl font-bold text-blue-400">
                  {stats.summary.activeTokens}
                </div>
                <div className="text-gray-400">Active Tokens</div>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="text-4xl font-bold text-yellow-400">
                  {stats.summary.totalTriggers}
                </div>
                <div className="text-gray-400">Total Triggers</div>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="text-4xl font-bold text-red-400">
                  {stats.summary.recentTriggers}
                </div>
                <div className="text-gray-400">Last Hour</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Tokens</h2>
                <div className="space-y-2">
                  {stats.tokens.map((token) => (
                    <div
                      key={token.id}
                      className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <div className="font-semibold">{token.name}</div>
                        <div className="text-sm text-gray-400">{token.path}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-bold">
                          {token.triggerCount} triggers
                        </div>
                        <div className="text-xs text-gray-500">
                          {token.lastTriggered
                            ? new Date(token.lastTriggered).toLocaleString('en-US', { timeZone: 'UTC' })
                            : 'Never'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Recent Triggers</h2>
                <div className="space-y-2">
                  {stats.recentTriggers.length === 0 ? (
                    <div className="bg-gray-800 p-4 rounded-lg text-gray-400">
                      No triggers yet
                    </div>
                  ) : (
                    stats.recentTriggers.map((trigger) => (
                      <div
                        key={trigger.id}
                        className="bg-gray-800 p-4 rounded-lg"
                      >
                        <div className="flex justify-between">
                          <div className="font-semibold">{trigger.tokenName}</div>
                          <div className="text-sm text-gray-400">
                            {new Date(trigger.timestamp).toLocaleString('en-US', { timeZone: 'UTC' })}
                          </div>
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          IP: {trigger.ip} | {trigger.method} {trigger.tokenPath}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          UA: {trigger.userAgent}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      </div>
    </>
  );
}
