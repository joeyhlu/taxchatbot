// components/ChatUI.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';

interface ChatMessage {
  role: string;
  content: string;
}

export default function ChatUI() {
  const { messages, input, handleInputChange, append, status, error } = useChat({
    api: '/api/chat',
    streamProtocol: 'text',
  });

  const [uploadedFileName, setUploadedFileName] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setUploadedFileName(file.name);

    if (file.type.startsWith('image/')) {
      const imageURL = URL.createObjectURL(file);
      append({ role: 'user', content: `[image]${imageURL}` });
    } else {
      append({ role: 'user', content: `I've uploaded a file: ${file.name}` });
    }
  };

  const renderImageIfPresent = (content: string) => {
    if (content.startsWith('[image]')) {
      const imageURL = content.slice('[image]'.length);
      return (
        <img
          src={imageURL}
          alt="Uploaded"
          className="w-full max-w-full h-auto max-h-60 object-contain rounded"
        />
      );
    }
    return null;
  };

  const renderMultimedia = (content: string) => {
    if (content.includes('[TABLE_DEMO]')) {
      return (
        <div className="mt-2 border border-gray-300 rounded p-2 bg-white">
          <h4 className="font-semibold mb-1 text-sm">Here&apos;s an example table</h4>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 px-2 py-1">Item</th>
                <th className="border border-gray-300 px-2 py-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-2 py-1">Gross Income</td>
                <td className="border border-gray-300 px-2 py-1">$60,000</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-2 py-1">Standard Deduction</td>
                <td className="border border-gray-300 px-2 py-1">$13,850</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-2 py-1">Taxable Income</td>
                <td className="border border-gray-300 px-2 py-1">$46,150</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    return null;
  };

  const cleanContent = (text: string) => {
    return text.replace('[DONE]', '').replace('CortaxAI says:', '').trim();
  };

  const renderMessageBubble = (msg: ChatMessage, idx: number) => {
    const isAssistant = msg.role === 'assistant';
    const displayContent = cleanContent(msg.content);
    const imageElement = renderImageIfPresent(msg.content);

    if (isAssistant) {
      return (
        <div key={idx} className="flex items-center mb-4">
          <img
            src="/bot.png"
            alt="Assistant"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="ml-2 bg-pink-200 text-gray-800 rounded-2xl p-3 max-w-[60%] shadow-md">
            {imageElement ? (
              imageElement
            ) : (
              <p className="whitespace-normal break-words text-sm">{displayContent}</p>
            )}
            {renderMultimedia(displayContent)}
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                className="bg-pink-300 text-pink-900 px-2 py-1 rounded text-xs"
                onClick={() => append({ role: 'user', content: 'Tell me about tax brackets' })}
              >
                Tax Brackets
              </button>
              <button
                className="bg-pink-300 text-pink-900 px-2 py-1 rounded text-xs"
                onClick={() => append({ role: 'user', content: 'What about W-2 forms?' })}
              >
                W-2 Forms
              </button>
              <button
                className="bg-pink-300 text-pink-900 px-2 py-1 rounded text-xs"
                onClick={() => append({ role: 'user', content: 'What is the standard deduction?' })}
              >
                Standard Deduction
              </button>
              <button
                className="bg-pink-300 text-pink-900 px-2 py-1 rounded text-xs"
                onClick={() => append({ role: 'user', content: 'What are the filing statuses?' })}
              >
                Filing Statuses
              </button>
              <button
                className="bg-pink-300 text-pink-900 px-2 py-1 rounded text-xs"
                onClick={() => append({ role: 'user', content: 'Show me a table' })}
              >
                Show Table
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div key={idx} className="flex items-center mb-4 justify-end">
          <div className="mr-2 bg-blue-400 text-white rounded-2xl p-3 max-w-[60%] shadow-md">
            {imageElement ? (
              imageElement
            ) : (
              <p className="whitespace-normal break-words text-sm">{displayContent}</p>
            )}
          </div>
          <img
            src="/user.png"
            alt="User"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      );
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    append({ role: 'user', content: input.trim() });
    const resetEvent = { target: { value: '' } } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleInputChange(resetEvent);
  };

  return (
    <div className="min-h-full">
      {/* Replacing "CortaxAI Chat (Tailwind)" with gradient "Tax Assistant" */}
      <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Tax Assistant
      </h1>

      <div ref={chatContainerRef} className="border rounded p-4 mb-4 h-[450px] overflow-y-auto">
        {messages.map((msg, idx) => renderMessageBubble(msg as ChatMessage, idx))}
        {(status === 'submitted' || status === 'streaming') && (
          <div className="text-sm text-gray-500 mt-2">Thinking...</div>
        )}
        {error && <div className="text-sm text-red-500 mt-2">Error: {error.message}</div>}
      </div>

      <form onSubmit={handleFormSubmit} className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          className="border flex-1 px-3 py-2 rounded"
          placeholder="Say hello or ask about taxes..."
          value={input}
          onChange={handleInputChange}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </form>

      <div>
        <label className="block font-medium mb-1" htmlFor="fileUpload">
          Upload a file (e.g., W-2 PDF):
        </label>
        <input id="fileUpload" type="file" onChange={handleFileChange} />
        {uploadedFileName && (
          <p className="text-gray-600 text-sm mt-1">You selected: {uploadedFileName}</p>
        )}
      </div>
    </div>
  );
}
