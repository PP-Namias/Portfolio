import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

const stockPriceTool = new DynamicStructuredTool({
  name: 'stock_price',
  description: 'Fetch latest stock price for a given symbol (e.g. AAPL, TSLA) using Alpha Vantage API.',
  schema: z.object({
    symbol: z.string().describe('The stock ticker symbol (e.g. AAPL, TSLA, GOOGL)'),
  }),
  func: async ({ symbol }: { symbol: string }): Promise<string> => {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
      return 'Stock price lookup is not configured (ALPHA_VANTAGE_API_KEY missing).';
    }
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol.toUpperCase())}&apikey=${apiKey}`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) return `Stock price lookup failed with status ${res.status}`;
      const data = await res.json() as Record<string, unknown>;
      const quote = data['Global Quote'] as Record<string, string> | undefined;
      if (!quote) return `No data found for symbol "${symbol}". The symbol may be invalid.`;
      return JSON.stringify({
        symbol: symbol.toUpperCase(),
        price: quote['05. price'],
        change: quote['09. change'],
        changePercent: quote['10. change percent'],
        latestTradingDay: quote['07. latest trading day'],
      });
    } catch (error) {
      return `Stock price lookup error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
});

export { stockPriceTool };
