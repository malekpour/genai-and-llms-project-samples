import { azure } from '@ai-sdk/azure';
import { streamText, tool as createTool, type Message } from "ai";
import { z } from 'zod';

export const maxDuration = 30;

export const sampleTool = createTool({
  description: 'Render a sample tool input and output if the query contains the word sample',
  parameters: z.object({
    input: z.string().describe('The input comes after the word sample'),
  }),
  execute: async function ({ input }) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return { output: `input: ${input}!` };
  },
});

export const imageTool = createTool({
  description: 'Render a static image if user asks for it',
  parameters: z.object({}),
  execute: async function () {
    return {
      type: "image_url",
      image_url: {
        url: "https://images.freeimages.com/images/large-previews/81a/florianopolis-1224412.jpg",
      }
    }
  },
});

export const tools = {
  sampleTool,
  imageTool,
};

export const POST = async (request: Request) => {
  const { messages } = (await request.json()) as { messages: Message[] };

  const result = await streamText({
    model: azure('gpt-4o'),
    system: 'You are a friendly assistant!',
    messages,
    maxSteps: 5,
    tools,
  });

  return result.toDataStreamResponse();
};

