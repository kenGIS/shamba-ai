import { StreamingTextResponse } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Parse the incoming request to get the user prompt
    const { prompt } = await req.json();

    // Validate the prompt
    if (!prompt || typeof prompt !== "string") {
      console.error("Invalid or missing prompt");
      return new Response(JSON.stringify({ error: "Invalid or missing prompt" }), {
        status: 400,
      });
    }

    // Debugging: Log the received prompt
    console.log("Prompt received:", prompt);

    // Debugging: Check if OpenAI API Key is present
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API Key is missing");
      return new Response(JSON.stringify({ error: "OpenAI API Key is not set" }), {
        status: 500,
      });
    }

    // Log the request payload for debugging
    console.log("Request Payload:", {
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    // Call the OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        stream: true,
      }),
    });

    // Handle OpenAI API errors
    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API Error:", error);
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${error.error.message || "Unknown error"}` }),
        { status: response.status }
      );
    }

    // Stream the response back to the client
    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        const reader = response.body?.getReader();

        if (!reader) {
          console.error("Failed to get response reader from OpenAI");
          controller.close();
          return;
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
    // General error handling
    console.error("Error in chat route:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error. Please try again later." }),
      { status: 500 }
    );
  }
}
