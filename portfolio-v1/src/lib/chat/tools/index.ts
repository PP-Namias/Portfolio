import type { DynamicStructuredTool } from '@langchain/core/tools';
import type { ChatDataContext } from '@/app/api/chat/lib/types';
import { webSearchTool } from './web-search';
import { calculatorTool } from './calculator';
import { stockPriceTool } from './stock-price';
import { createPortfolioQueryTool } from './portfolio-query';
import { sendMessageTool } from './send-message';

function createTools(contextProvider: () => ChatDataContext | null): DynamicStructuredTool[] {
  return [
    webSearchTool,
    calculatorTool,
    stockPriceTool,
    createPortfolioQueryTool(contextProvider),
    sendMessageTool,
  ];
}

export { createTools };
export { webSearchTool, calculatorTool, stockPriceTool, sendMessageTool };
