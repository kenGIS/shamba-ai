import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamic import for the map to avoid SSR issues
const Map = dynamic(() => import('@/components/map'), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-emerald-300 grid grid-cols-1 lg:grid-cols-2">
      {/* Left Panel: AI Chat */}
      <motion.div
        className="p-6 bg-gray-800/50 backdrop-blur-xl border border-emerald-500/30 rounded-r-xl"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-4 text-emerald-400">SHAMBA.AI</h1>
        <div className="h-[60vh] overflow-y-auto space-y-4">
          {/* Chat messages will go here */}
          <div className="p-4 bg-gray-700/50 rounded-lg">Hello! How can I assist you?</div>
        </div>
        <form className="mt-6 space-y-4">
          <input
            type="text"
            className="w-full p-4 bg-gray-900/50 rounded-lg border border-emerald-500/30 focus:outline-none text-emerald-300"
            placeholder="Ask me about climate insights..."
          />
          <button
            type="submit"
            className="w-full p-4 bg-emerald-600 hover:bg-emerald-700 transition-colors rounded-lg font-bold"
          >
            Ask AI
          </button>
        </form>
      </motion.div>

      {/* Right Panel: Data Visualization */}
      <motion.div
        className="p-6 bg-gray-900/50 backdrop-blur-xl border border-emerald-500/30 rounded-l-xl space-y-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Placeholder for Infographics */}
        <div className="h-[30vh] bg-gray-800 rounded-xl border border-emerald-500/30 flex items-center justify-center">
          <span className="text-emerald-400">Infographics Placeholder</span>
        </div>

        {/* Interactive Map */}
        <div className="h-[40vh] bg-gray-800 rounded-xl border border-emerald-500/30 overflow-hidden">
          <Map />
        </div>
      </motion.div>
    </div>
  );
}
