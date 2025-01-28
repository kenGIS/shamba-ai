'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, ArcElement, Tooltip, Legend } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, ArcElement, Tooltip, Legend);

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
  const areaLineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Area Line Chart',
        data: [10, 15, 12, 20, 25, 18],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const proportionalAreaData = {
    labels: ['Segment A', 'Segment B', 'Segment C'],
    datasets: [
      {
        data: [300, 500, 200],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(75, 192, 192)', 'rgb(255, 205, 86)'],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 grid grid-cols-5 gap-4 p-4">
      {/* Chat Panel */}
      <div className="col-span-2 flex flex-col space-y-4 p-4 bg-gray-800/50 backdrop-blur-lg rounded-xl border border-emerald-500/30">
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
      <div className="col-span-3 grid grid-rows-3 gap-4 bg-gray-800/50 backdrop-blur-lg rounded-xl border border-emerald-500/30 p-4">
        {/* Area Line Chart */}
        <div className="row-span-1 bg-gray-700/50 p-3 rounded-lg flex items-center justify-center">
          <Line data={areaLineData} />
        </div>

        {/* Proportional Area Chart */}
        <div className="row-span-1 bg-gray-700/50 p-3 rounded-lg flex items-center justify-center">
          <Doughnut data={proportionalAreaData} />
        </div>

        {/* Map */}
        <div className="row-span-1 bg-gray-700/50 p-3 rounded-lg">
          {memoizedMap}
        </div>
      </div>
    </div>
  );
}
