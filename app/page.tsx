'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, PointElement, LineElement, Filler, ArcElement } from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { ChartBarIcon, GlobeAltIcon, LeafIcon, TruckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

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

  // ... (all handlers remain unchanged)

  const memoizedMap = useMemo(() => <Map />, []);

  // Visualization data remains identical
  const treeDensityData = {/* unchanged */};
  const carbonReservoirData = {/* unchanged */};
  const landCoverData = {/* unchanged */};

  return (
    <div className="h-screen w-full flex bg-gray-900 text-white">
      {/* Updated Sidebar */}
      <div className="w-40 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="flex-1 space-y-3 p-3">
          {[
            { tab: 'Insights', Icon: ChartBarIcon },
            { tab: 'Risks', Icon: ExclamationTriangleIcon },
            { tab: 'Carbon', Icon: LeafIcon },
            { tab: 'Biodiversity', Icon: GlobeAltIcon },
            { tab: 'Agriculture', Icon: TruckIcon },
          ].map(({ tab, Icon }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`w-full flex flex-col items-center p-2 rounded-md text-xs transition-colors
                ${activeTab === tab 
                  ? 'bg-gray-700/50 border-l-2 border-green-400' 
                  : 'hover:bg-gray-700/30 hover:border-l-2 hover:border-gray-500'}`}
            >
              <Icon className="w-5 h-5 mb-1" />
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Updated Navbar */}
      <div className="flex-1 flex flex-col">
        <nav className="w-full bg-gray-800 p-4 shadow-lg flex justify-between items-center">
          <h1 className="text-xl font-bold">Shamba.ai</h1>
          <div className="flex space-x-4">
            <Link href="/reports" className="hover:text-green-400">Reports</Link>
            <Link href="/pdd" className="hover:text-green-400">Data</Link> {/* Changed PDD to Data */}
            <Link href="/account" className="hover:text-green-400">Account</Link>
          </div>
        </nav>

        {/* Rest of the code remains EXACTLY THE SAME */}
        {/* ... (map, charts, and chat panel unchanged) */}
      </div>

      {/* Unchanged AI Chat Panel */}
      {/* ... */}
    </div>
  );
}
