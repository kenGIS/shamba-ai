'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const Map = dynamic(
  () => import('../components/map'),
  { ssr: false, loading: () => <div className="h-full bg-gray-900/50 animate-pulse" /> }
);

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      console.error("No input provided");
      return;
    }

    // Add the user's message to the chat
    setMessages([...messages, { role: "user", content: input }]);
    setInput(""); // Clear the input field immediately

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }), // Send the prompt as JSON
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      if (!response.body) {
        console.error("No response body from API");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let aiResponse = ""; // Accumulate the AI's response

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        aiResponse += decoder.decode(value, { stream: true });

        // Update the assistant's response in real-time
        setMessages((prev) => {
          // Check if there's already an assistant response being updated
          const lastMessage = prev.find((msg) => msg.role === "assistant");
          if (lastMessage) {
            lastMessage.content = aiResponse;
            return [...prev];
          } else {
            return [...prev, { role: "assistant", content: aiResponse }];
          }
        });
      }
    } catch (error) {
      console.error("Failed to fetch chat response:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
      {/* Chat Panel */}
      <div className="lg:col-span-3 space-y-6 p-6 bg-gray-800/50 backdrop-blur-lg rounded-xl border border-emerald-500/30">
        <h1 className="text-3xl font-bold text-emerald-400">SHAMBA.AI</h1>

        {/* Chat Messages */}
        <div className="h-[70vh] overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 rounded-lg ${
                msg.role === "user" ? "bg-emerald-900/20" : "bg-gray-700/30"
              }`}
            >
              {msg.content}
            </motion.div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            id="chat-input"
            name="chat-input"
            value={input}
            onChange={handleInputChange}
            className="w-full p-4 bg-gray-800/30 rounded-lg border border-emerald-500/50 focus:outline-none text-emerald-300"
            placeholder="Try: 'Show vegetation changes'"
            autoComplete="off"
          />
          <button
            type="submit"
            className="w-full p-4 bg-emerald-600/50 hover:bg-emerald-600/70 transition-colors rounded-lg font-bold text-emerald-100"
          >
            ANALYZE (DEMO)
          </button>
        </form>
      </div>

      {/* Map Panel */}
      <div className="lg:col-span-1 relative">
        <Map />
      </div>
    </div>
  );
}
