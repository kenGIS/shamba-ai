import { StreamingTextResponse } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Parse the incoming request to get the user prompt
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "No prompt provided" }), { status: 400 });
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
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${response.statusText}` }),
        { status: response.status }
      );
    }

    // Stream the response back to the client
    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        const reader = response.body?.getReader();

        if (!reader) {
          controller.close();
          throw new Error("Failed to create a reader for OpenAI response.");
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Decode and enqueue the streamed chunks
          const chunk = decoder.decode(value);
          controller.enqueue(new TextEncoder().encode(chunk));
        }

        controller.close();
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error. Please try again later." }),
      { status: 500 }
    );
  }
}
