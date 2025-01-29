import { OpenAI } from 'openai';
import { StreamingTextResponse } from 'ai';

export const runtime = 'edge'; // Optimized for Vercel Edge Functions

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

export async function POST(req: Request) {
  try {
    const { prompt, thread_id } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Missing prompt' }), { status: 400 });
    }

    // Ensure the thread exists or create one
    let threadId = thread_id;
    if (!threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
    }

    // First, add the user message to the thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: prompt,
    });

    // Then, start the assistant run
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_ID,
      instructions: "Respond as the Shamba AI assistant.",
    });

    // Poll for completion
    let completedRun;
    while (true) {
      completedRun = await openai.beta.threads.runs.retrieve(threadId, run.id);
      if (completedRun.status === 'completed') break;
      await new Promise((res) => setTimeout(res, 1000));
    }

    // Get the latest message from the assistant
    const messages = await openai.beta.threads.messages.list(threadId);
    const aiResponse = messages.data.find(m => m.role === 'assistant');
    const content = aiResponse?.content || "I'm here to help!";

    return new StreamingTextResponse(content);
  } catch (error) {
    console.error('Error processing chat:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
