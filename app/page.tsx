'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, PointElement, LineElement, Filler, ArcElement } from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, PointElement, LineElement, Filler, ArcElement);

const Map = dynamic(() => import('../components/map'), {
  ssr: false,
  loading: () => <div className="h-full bg-gray-900/50 animate-pulse" />,
});

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

    setMessages([...messages, { role: "user", content: input }]);
    setInput("");

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Placeholder response for now." },
    ]);
  };

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
    labels: ['Forests', 'Scrubland', 'Grassland'],
    datasets: [
      {
        label: 'Land Cover Types',
        data: [45, 30, 25],
        backgroundColor: ['rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 grid grid-cols-4 gap-4 p-4">
      {/* Chat Panel */}
      <div className="col-span-1 flex flex-col space-y-4 p-4 bg-gray-800/50 backdrop-blur-lg rounded-xl border border-emerald-500/30">
        <h1 className="text-2xl font-bold text-emerald-400">SHAMBA.AI</h1>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-3 rounded-lg ${
                msg.role === 'user' ? 'bg-emerald-900/20' : 'bg-gray-700/30'
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
            className="w-full p-3 bg-gray-800/30 rounded-lg border border-emerald-500/50 focus:outline-none text-emerald-300"
            placeholder="Ask me a question..."
            autoComplete="off"
          />
          <button
            type="submit"
            className="w-full p-3 bg-emerald-600/50 hover:bg-emerald-600/70 transition-colors rounded-lg font-bold text-emerald-100"
          >
            Send
          </button>
        </form>
      </div>

      {/* Visualization Panel */}
      <div className="col-span-3 grid grid-rows-2 gap-4 bg-gray-800/50 backdrop-blur-lg rounded-xl border border-emerald-500/30 p-4">
        {/* Infographics Row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Tree Density Trend */}
          <div className="bg-gray-700/50 p-3 rounded-lg flex flex-col items-center justify-center">
            <h2 className="text-sm font-semibold text-emerald-400 mb-2">Tree Density Trend</h2>
            <Line data={treeDensityData} />
          </div>

          {/* Carbon Reservoirs */}
          <div className="bg-gray-700/50 p-3 rounded-lg flex flex-col items-center justify-center">
            <h2 className="text-sm font-semibold text-emerald-400 mb-2">Carbon Reservoirs</h2>
            <Doughnut data={carbonReservoirData} />
          </div>

          {/* Land Cover Types */}
          <div className="bg-gray-700/50 p-3 rounded-lg flex flex-col items-center justify-center">
            <h2 className="text-sm font-semibold text-emerald-400 mb-2">Land Cover Types</h2>
            <Bar data={landCoverData} />
          </div>
        </div>

        {/* Map Row */}
        <div className="bg-gray-700/50 p-3 rounded-lg flex items-center justify-center h-[35vh]">
          {memoizedMap}
        </div>
      </div>
    </div>
  );
}
