
import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage, AppChat } from '../types';
import { createChatSession } from '../services/geminiService';
import Spinner from './Spinner';
import { SendIcon } from './icons/SendIcon';

const Chatbot: React.FC = () => {
  const [chat, setChat] = useState<AppChat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChat(createChatSession());
    setMessages([
        { role: 'model', text: 'Hello! I am Pest & Plant Pal. Ask me anything about farming in English, Hausa, Yoruba, or Igbo.' }
    ]);
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !chat || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const stream = await chat.sendMessageStream({ message: input });
        let modelResponse = '';
        setMessages(prev => [...prev, { role: 'model', text: '' }]);
        
        for await (const chunk of stream) {
            modelResponse += chunk.text;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].text = modelResponse;
                return newMessages;
            });
        }
    } catch (error) {
        console.error("Error sending message:", error);
        setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg flex flex-col h-[75vh]">
        <div className="text-center mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-green-800">AI Farming Assistant</h2>
            <p className="text-gray-600 mt-1">Your multilingual agricultural expert.</p>
        </div>

        <div className="flex-grow overflow-y-auto pr-4 -mr-4 mb-4 space-y-4">
            {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                msg.role === 'user' 
                    ? 'bg-green-600 text-white rounded-br-none' 
                    : 'bg-green-100 text-green-900 rounded-bl-none'
                }`}>
                {msg.text}
                {msg.role === 'model' && isLoading && index === messages.length - 1 && <span className="inline-block w-2 h-4 bg-green-900 animate-pulse ml-1"></span>}
                </div>
            </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        <div className="mt-auto pt-4 border-t border-green-200">
            <div className="flex items-center gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question..."
                className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                disabled={isLoading}
            />
            <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:bg-green-300 transition-colors"
            >
                {isLoading ? <Spinner /> : <SendIcon className="w-6 h-6" />}
            </button>
            </div>
        </div>
    </div>
  );
};

export default Chatbot;
