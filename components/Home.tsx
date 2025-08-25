
import React from 'react';
import type { View } from '../types';
import { LeafIcon } from './icons/LeafIcon';
import { ChatIcon } from './icons/ChatIcon';
import { BookIcon } from './icons/BookIcon';

interface HomeProps {
  setCurrentView: (view: View) => void;
}

const FeatureCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    buttonText: string;
    onClick: () => void;
}> = ({ icon, title, description, buttonText, onClick }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center animate-fade-in">
        <div className="bg-teal-100 p-4 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-teal-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        <button 
            onClick={onClick}
            className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
        >
            {buttonText}
        </button>
    </div>
);


const Home: React.FC<HomeProps> = ({ setCurrentView }) => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center p-8 bg-white rounded-xl shadow-lg animate-fade-in">
          <div className="flex justify-center items-center mb-4">
              <LeafIcon className="h-20 w-20 text-teal-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-teal-800">
            Welcome to Greencare
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Your AI-powered partner for healthier crops and bountiful harvests. Get instant diagnostics, expert advice, and farming guides.
          </p>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
            icon={<LeafIcon className="w-8 h-8 text-teal-600" />}
            title="Disease Detector"
            description="Snap a photo of your plant to instantly identify diseases or pests and get a detailed treatment plan."
            buttonText="Diagnose Plant"
            onClick={() => setCurrentView('detector')}
        />
        <FeatureCard
            icon={<ChatIcon className="w-8 h-8 text-teal-600" />}
            title="AI Farming Assistant"
            description="Chat with our multilingual AI expert to get answers to all your farming questions, anytime."
            buttonText="Start Chatting"
            onClick={() => setCurrentView('chatbot')}
        />
        <FeatureCard
            icon={<BookIcon className="w-8 h-8 text-teal-600" />}
            title="Resource Hub"
            description="Access a library of AI-generated, step-by-step guides on a wide range of agricultural topics."
            buttonText="Browse Guides"
            onClick={() => setCurrentView('resources')}
        />
      </div>
    </div>
  );
};

export default Home;
