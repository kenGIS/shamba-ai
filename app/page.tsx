'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, PointElement, LineElement, Filler, ArcElement } from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { LightBulbIcon, ShieldCheckIcon, CloudIcon, GlobeAltIcon, SunIcon } from '@heroicons/react/24/outline';

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
  const [threadId, setThreadId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Insights' | 'Risks' | 'Carbon' | 'Biodiversity' | 'Agriculture'>('Insights');

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

  // Memoized Map for performance
  const memoizedMap = useMemo(() => <Map />, []);

  // Placeholder data for visualizations
  const treeDensityData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Tree Density Trend',
        data: [10, 15, 12, 20, 25, 18],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const carbonReservoirData = {
    labels: ['Above Ground Biomass', 'Below Ground Biomass', 'Soil Carbon'],
    datasets: [
      {
        data: [300, 200, 400],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(75, 192, 192)', 'rgb(255, 205, 86)'],
      },
    ],
  };

  const landCoverData = {
    labels: ['Forest', 'Grassland', 'Agricultural Land', 'Urban'],
    datasets: [
      {
        label: 'Land Cover Types',
        data: [15, 15, 10, 60],
        backgroundColor: ['rgb(34, 139, 34)', 'rgb(154, 205, 50)', 'rgb(255, 165, 0)', 'rgb(128, 128, 128)'],
      },
    ],
  };

  return (
    <div className="h-screen w-full flex bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-48 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 text-sm font-medium border-b border-gray-700">Categories</div>
        <div className="flex-1 space-y-1 p-2">
          {[
            { name: 'Insights', icon: <LightBulbIcon className="w-5 h-5 inline mr-2" /> },
            { name: 'Risks', icon: <ShieldCheckIcon className="w-5 h-5 inline mr-2" /> },
            { name: 'Carbon', icon: <CloudIcon className="w-5 h-5 inline mr-2" /> },
            { name: 'Biodiversity', icon: <GlobeAltIcon className="w-5 h-5 inline mr-2" /> }, // Fixed icon
            { name: 'Agriculture', icon: <SunIcon className="w-5 h-5 inline mr-2" /> },
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name as any)}
              className={`w-full px-3 py-2 text-left rounded-md text-sm transition-colors flex items-center
                ${activeTab === tab.name 
                  ? 'bg-gray-700/50 border-l-2 border-green-400' 
                  : 'hover:bg-gray-700/30 hover:border-l-2 hover:border-gray-500'}
                `}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Left Panel Content */}
      <div className="flex-1 flex flex-col">
        <nav className="w-full bg-gray-800 p-4 shadow-lg flex justify-between items-center">
          <h1 className="text-xl font-bold">Shamba.ai</h1>
          <div className="flex space-x-4">
            <Link href="/reports" className="hover:text-green-400">Reports</Link>
            <Link href="/pdd" className="hover:text-green-400">Data</Link>
            <Link href="/account" className="hover:text-green-400">Account</Link>
          </div>
        </nav>
        
        {/* Map Section */}
        <div className="h-2/3">{memoizedMap}</div>
        
        {/* Visualization Charts */}
        <div className="h-1/3 flex">
          <div className="w-1/3 p-4">
            <h2 className="text-lg font-bold">Tree Density Trend</h2>
            <Line data={treeDensityData} />
          </div>
          <div className="w-1/3 p-4">
            <h2 className="text-lg font-bold">Carbon Reservoirs</h2>
            <Doughnut data={carbonReservoirData} />
          </div>
          <div className="w-1/3 p-4">
            <h2 className="text-lg font-bold">Land Cover Types</h2>
            <Bar data={landCoverData} />
          </div>
        </div>
      </div>

      {/* Right Panel - AI Chat */}
      <div className="w-1/3 flex flex-col border-l border-gray-700">
        <div className="flex-1 p-6 overflow-auto">
          {messages.map((msg, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
              className={`p-3 rounded-lg mb-2 max-w-md ${msg.role === "user" ? "bg-blue-600 self-end" : "bg-gray-700 self-start"}`}
            >
              {msg.content}
            </motion.div>
          ))}
          {/* Added typing indicator below */}
          {isTyping && (
            <div className="p-3 rounded-lg bg-gray-600 w-48 animate-pulse">
              Shamba AI is typing...
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex bg-gray-800 border-t border-gray-700">
          <input type="text" value={input} onChange={handleInputChange} placeholder="Ask Shamba AI..."
            className="flex-1 p-2 rounded bg-gray-700 text-white outline-none" />
          <button type="submit" className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">Send</button>
        </form>
      </div>
    </div>
  );
}
