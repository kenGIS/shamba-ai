import { StreamingTextResponse } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Parse the incoming request to get the user prompt
    const { prompt } = await req.json();

    if (!prompt) {
      throw new Error("No prompt provided");
    }

    // Call the OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Use secure API key
      },
      body: JSON.stringify({
        model: "gpt-4", // Specify the OpenAI model
        messages: [{ role: "user", content: prompt }], // Send user input
        stream: true, // Enable streaming for real-time responses
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message || "Error in OpenAI API call");
    }

    // Stream the response back to the client
    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        const reader = response.body?.getReader();

        if (!reader) {
          throw new Error("Failed to get response reader");
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          controller.enqueue(new TextEncoder().encode(chunk));
        }

        controller.close();
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
