// pages/index.tsx
import React from 'react';
import ChatUI from '../components/ChatUI';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 px-4 py-8 flex flex-col">
      <nav className="w-full flex justify-between items-center py-16 px-10 bg-transparent">
        <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          CortaxAI
        </div>
        <div className="text-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Chat
        </div>
      </nav>

      <div className="max-w-lg w-full bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-6 self-center mt-4">
        <ChatUI />
      </div>
    </div>
  );
}
