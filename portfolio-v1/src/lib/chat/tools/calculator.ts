import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

const calculatorTool = new DynamicStructuredTool({
  name: 'calculator',
  description: 'Perform arithmetic operations (add, sub, mul, div) on two numbers.',
  schema: z.object({
    first_num: z.number().describe('The first number'),
    second_num: z.number().describe('The second number'),
    operation: z.enum(['add', 'sub', 'mul', 'div']).describe('The arithmetic operation'),
  }),
  func: async ({ first_num, second_num, operation }: { first_num: number; second_num: number; operation: string }): Promise<string> => {
    if (operation === 'div' && second_num === 0) {
      return JSON.stringify({ first_num, second_num, operation, error: 'Division by zero is not allowed' });
    }
    const operations: Record<string, (a: number, b: number) => number> = {
      add: (a, b) => a + b,
      sub: (a, b) => a - b,
      mul: (a, b) => a * b,
      div: (a, b) => a / b,
    };
    const result = operations[operation](first_num, second_num);
    return JSON.stringify({ first_num, second_num, operation, result });
  },
});

export { calculatorTool };
