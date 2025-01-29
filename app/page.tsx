'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import the Map component
const Map = dynamic(() => import('../components/map'), {
  ssr: false,
  loading: () => <div className="h-full bg-gray-900/50 animate-pulse" />,
});

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null); // Store thread ID

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    setIsTyping(true); // Show typing indicator

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input, thread_id: threadId }),
    });

    if (!response.ok) {
      console.error("Failed to get response from AI");
      setIsTyping(false);
      return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let aiMessage = "";

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiMessage += decoder.decode(value, { stream: true });
        setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: aiMessage }]); // Updates chat in real-time
      }
    }

    setIsTyping(false); // Hide typing indicator
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-900 text-white">
      <div className="flex-1 p-6 overflow-auto">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`p-3 rounded-lg mb-2 max-w-md ${
              msg.role === "user" ? "bg-blue-600 self-end" : "bg-gray-700 self-start"
            }`}
          >
            {msg.content}
          </motion.div>
        ))}
        {isTyping && <div className="p-3 rounded-lg bg-gray-600 w-28">Shamba AI is typing...</div>}
      </div>

      <form onSubmit={handleSubmit} className="p-4 flex bg-gray-800 border-t border-gray-700">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask Shamba AI..."
          className="flex-1 p-2 rounded bg-gray-700 text-white outline-none"
        />
        <button type="submit" className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
          Send
        </button>
      </form>
    </div>
  );
}
