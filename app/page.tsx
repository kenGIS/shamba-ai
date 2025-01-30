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
      data: [40, 25, 20, 15],
      backgroundColor: ['rgb(34, 139, 34)', 'rgb(154, 205, 50)', 'rgb(255, 165, 0)', 'rgb(128, 128, 128)'],
    },
  ],
};

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
      </div>
    </div>
  );
}
