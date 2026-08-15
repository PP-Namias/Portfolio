import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

const sendMessageTool = new DynamicStructuredTool({
  name: 'send_message',
  description: 'Send a message or booking inquiry to Keneth. This will trigger the contact flow.',
  schema: z.object({
    name: z.string().describe('The sender name'),
    email: z.string().email().describe('The sender email address'),
    message: z.string().describe('The message content'),
    subject: z.string().describe('The message subject'),
  }),
  func: async ({ name, email, message, subject }: { name: string; email: string; message: string; subject: string }): Promise<string> => {
    return JSON.stringify({
      status: 'requires_confirmation',
      message: `Message ready to send. Please confirm:\nFrom: ${name} (${email})\nSubject: ${subject}\nMessage: ${message}`,
      action: 'contact',
    });
  },
});

export { sendMessageTool };
