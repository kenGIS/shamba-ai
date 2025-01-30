'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, PointElement, LineElement, Filler, ArcElement } from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, PointElement, LineElement, Filler, ArcElement);

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    setIsTyping(true);

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
        setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: aiMessage }]);
      }
    }

    setIsTyping(false);
  };

  const memoizedMap = useMemo(() => <Map />, []);

  return (
    <div className="h-screen w-full flex flex-col bg-gray-900 text-white">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full bg-gray-800 p-4 shadow-lg z-50 flex justify-between items-center">
        <h1 className="text-xl font-bold">Shamba AI</h1>
        <div className="flex space-x-4">
          <Link href="/reports" className="hover:text-green-400">Reports</Link>
          <Link href="/mrv" className="hover:text-green-400">MRV</Link>
          <Link href="/pdd" className="hover:text-green-400">PDD</Link>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="bg-green-500 px-4 py-2 rounded-lg">Toggle Sidebar</button>
          <Link href="/profile" className="hover:text-green-400">User Profile</Link>
        </div>
      </nav>
      
      <div className="flex flex-1 pt-16">
        {/* Collapsible Left Sidebar */}
        {isSidebarOpen && (
          <div className="w-80 bg-gray-800 p-4 fixed left-0 top-16 bottom-0 shadow-xl overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Insights</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-700 rounded-lg">Climate Risk Analysis</div>
              <div className="p-4 bg-gray-700 rounded-lg">Carbon Removal Assessments</div>
              <div className="p-4 bg-gray-700 rounded-lg">Agriculture</div>
              <div className="p-4 bg-gray-700 rounded-lg">Biodiversity</div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="h-2/3">{memoizedMap}</div>
          <div className="h-1/3 flex">
            <div className="w-1/3 p-4"><h2 className="text-lg font-bold">Tree Density Trend</h2><Line data={treeDensityData} /></div>
            <div className="w-1/3 p-4"><h2 className="text-lg font-bold">Carbon Reservoirs</h2><Doughnut data={carbonReservoirData} /></div>
            <div className="w-1/3 p-4"><h2 className="text-lg font-bold">Land Cover Types</h2><Bar data={landCoverData} /></div>
          </div>
        </div>

        {/* AI Chat Panel */}
        <div className="w-1/3 flex flex-col border-l border-gray-700">
          <div className="flex-1 p-6 overflow-auto">
            {messages.map((msg, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className={`p-3 rounded-lg mb-2 max-w-md ${msg.role === "user" ? "bg-blue-600 self-end" : "bg-gray-700 self-start"}`}>
                {msg.content}
              </motion.div>
            ))}
            {isTyping && <div className="p-3 rounded-lg bg-gray-600 w-28">Shamba AI is typing...</div>}
          </div>
          <form onSubmit={handleSubmit} className="p-4 flex bg-gray-800 border-t border-gray-700">
            <input type="text" value={input} onChange={handleInputChange} placeholder="Ask Shamba AI..." className="flex-1 p-2 rounded bg-gray-700 text-white outline-none" />
            <button type="submit" className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
