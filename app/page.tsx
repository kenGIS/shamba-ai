'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import { Line, PolarArea, Radar, Doughnut } from 'react-chartjs-2';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, RadialLinearScale, ArcElement, Tooltip, Legend);

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

  const radialBarData = {
    labels: ['Category A', 'Category B', 'Category C'],
    datasets: [
      {
        label: 'Radial Bar Chart',
        data: [70, 50, 90],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 206, 86)'],
        hoverOffset: 4,
      },
    ],
  };

  const radarData = {
    labels: ['Metric 1', 'Metric 2', 'Metric 3', 'Metric 4', 'Metric 5'],
    datasets: [
      {
        label: 'Radar Chart',
        data: [65, 59, 90, 81, 56],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgb(153, 102, 255)',
        pointBackgroundColor: 'rgb(153, 102, 255)',
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
    <div className="min-h-screen bg-gray-900 grid grid-cols-3 gap-4 p-4">
      {/* Chat Panel */}
      <div className="col-span-1 space-y-6 p-6 bg-gray-800/50 backdrop-blur-lg rounded-xl border border-emerald-500/30">
        <h1 className="text-3xl font-bold text-emerald-400">SHAMBA.AI</h1>

        {/* Chat Messages */}
        <div className="h-[70vh] overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 rounded-lg ${
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
            className="w-full p-4 bg-gray-800/30 rounded-lg border border-emerald-500/50 focus:outline-none text-emerald-300"
            placeholder="Ask a question..."
            autoComplete="off"
          />
          <button
            type="submit"
            className="w-full p-4 bg-emerald-600/50 hover:bg-emerald-600/70 transition-colors rounded-lg font-bold text-emerald-100"
          >
            Send
          </button>
        </form>
      </div>

      {/* Visualization Panel */}
      <div className="col-span-2 space-y-6 p-6 bg-gray-800/50 backdrop-blur-lg rounded-xl border border-emerald-500/30">
        {/* Visualizations */}
        <div className="grid grid-cols-4 gap-4">
          {/* Area Line Chart */}
          <div className="col-span-2 bg-gray-700/50 p-2 rounded-lg h-[20vh]">
            <Line data={areaLineData} />
          </div>

          {/* Radial Bar Chart */}
          <div className="col-span-2 bg-gray-700/50 p-2 rounded-lg h-[20vh]">
            <PolarArea data={radialBarData} />
          </div>

          {/* Radar Chart */}
          <div className="col-span-2 bg-gray-700/50 p-2 rounded-lg h-[20vh]">
            <Radar data={radarData} />
          </div>

          {/* Nested Proportional Area Chart */}
          <div className="col-span-2 bg-gray-700/50 p-2 rounded-lg h-[20vh]">
            <Doughnut data={proportionalAreaData} />
          </div>
        </div>

        {/* Map */}
        <div className="bg-gray-700/50 p-4 rounded-lg h-[30vh]">
          {memoizedMap}
        </div>
      </div>
    </div>
  );
}
