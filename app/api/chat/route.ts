// Placeholder version - no real API calls
import { StreamingTextResponse } from 'ai';

export const runtime = 'edge';

const mockResponses = [
  "Satellite data shows **15% vegetation increase** in your area (2023-2024).",
  "Land degradation risk detected in **3 zones** with >20% slope.",
  "Carbon sequestration potential: **5.2 tons/ha** based on NDVI analysis."
];

export async function POST() {
  const stream = new ReadableStream({
    start(controller) {
      const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      controller.enqueue(new TextEncoder().encode(response));
      controller.close();
    },
  });

  return new StreamingTextResponse(stream);
}
