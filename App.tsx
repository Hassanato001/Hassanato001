
import React, { useState } from 'react';
import type { View } from './types';
import Header from './components/Header';
import Home from './components/Home';
import DiseaseDetector from './components/DiseaseDetector';
import Chatbot from './components/Chatbot';
import ResourceHub from './components/ResourceHub';
import { LeafIcon } from './components/icons/LeafIcon';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home setCurrentView={setCurrentView} />;
      case 'detector':
        return <DiseaseDetector />;
      case 'chatbot':
        return <Chatbot />;
      case 'resources':
        return <ResourceHub />;
      default:
        return <Home setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="bg-teal-50 min-h-screen font-sans text-gray-800">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {renderView()}
        </div>
      </main>
      <footer className="text-center p-4 text-teal-700 text-sm">
        <div className="flex items-center justify-center gap-2">
            <LeafIcon className="w-5 h-5" />
            <p>Greencare &copy; 2024</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
