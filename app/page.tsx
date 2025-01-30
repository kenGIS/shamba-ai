'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, PointElement, LineElement, Filler, ArcElement } from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, PointElement, LineElement, Filler, ArcElement);

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

  // ... (all existing handlers remain unchanged)

  const memoizedMap = useMemo(() => <Map />, []);

  // Visualization data remains identical
  const treeDensityData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Tree Density Trend',
      data: [10, 15, 12, 20, 25, 18],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
    }],
  };

  const carbonReservoirData = {
    labels: ['Above Ground Biomass', 'Below Ground Biomass', 'Soil Carbon'],
    datasets: [{
      data: [300, 200, 400],
      backgroundColor: ['rgb(255, 99, 132)', 'rgb(75, 192, 192)', 'rgb(255, 205, 86)'],
    }],
  };

  const landCoverData = {
    labels: ['Forest', 'Grassland', 'Agricultural Land', 'Urban'],
    datasets: [{
      label: 'Land Cover Types',
      data: [40, 25, 20, 15],
      backgroundColor: ['rgb(34, 139, 34)', 'rgb(154, 205, 50)', 'rgb(255, 165, 0)', 'rgb(128, 128, 128)'],
    }],
  };

  return (
    <div className="h-screen w-full flex bg-gray-900 text-white">
      {/* Slimmer Sidebar (changed from w-48 to w-40) */}
      <div className="w-40 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 text-sm font-medium border-b border-gray-700">Analysis Categories</div>
        <div className="flex-1 space-y-1 p-2">
          {['Insights', 'Risks', 'Carbon', 'Biodiversity', 'Agriculture'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`w-full px-2 py-2 text-left rounded-md text-sm transition-colors
                ${activeTab === tab 
                  ? 'bg-gray-700/50 border-l-2 border-green-400' 
                  : 'hover:bg-gray-700/30 hover:border-l-2 hover:border-gray-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Rest of the code remains EXACTLY THE SAME */}
      {/* ... (all other sections unchanged) */}
    </div>
  );
}
