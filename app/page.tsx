'use client';
import { useChat } from 'ai/react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const Map = dynamic(
  () => import('../components/map'),
  { ssr: false, loading: () => <div className="h-full bg-gray-900/50 animate-pulse" /> }
);

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat'
  });

  return (
    <div className="min-h-screen bg-gray-900 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
      {/* Chat Panel */}
      <div className="lg:col-span-1 space-y-6 p-6 bg-gray-800/50 backdrop-blur-lg rounded-xl border border-emerald-500/30">
        <h1 className="text-3xl font-bold text-emerald-400">SHAMBA.AI</h1>
        
        <div className="h-[60vh] overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 rounded-lg ${msg.role === 'user' ? 'bg-emerald-900/20' : 'bg-gray-700/30'}`}
            >
              {msg.content}
            </motion.div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={input}
            onChange={handleInputChange}
            className="w-full p-4 bg-gray-800/30 rounded-lg border border-emerald-500/50 focus:outline-none text-emerald-300"
            placeholder="Try: 'Show vegetation changes'"
          />
          <button
            type="submit"
            className="w-full p-4 bg-emerald-600/50 hover:bg-emerald-600/70 transition-colors rounded-lg font-bold text-emerald-100"
          >
            ANALYZE (DEMO)
          </button>
        </form>
      </div>

      {/* Map Panel */}
      <div className="lg:col-span-2 relative">
        <Map />
      </div>
    </div>
  );
}
