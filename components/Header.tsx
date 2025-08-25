
import React from 'react';
import type { View } from '../types';
import { LeafIcon } from './icons/LeafIcon';
import { ChatIcon } from './icons/ChatIcon';
import { BookIcon } from './icons/BookIcon';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const baseClasses = "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
  const activeClasses = "bg-teal-600 text-white";
  const inactiveClasses = "text-teal-700 hover:bg-teal-200";
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      aria-label={`Go to ${label}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => setCurrentView('home')} className="flex items-center gap-2" aria-label="Go to homepage">
            <LeafIcon className="h-8 w-8 text-teal-600" />
            <h1 className="text-xl font-bold text-teal-800">Greencare</h1>
          </button>
          <nav className="flex items-center gap-2 sm:gap-4">
            <NavButton
              label="Detector"
              icon={<LeafIcon className="w-5 h-5" />}
              isActive={currentView === 'detector'}
              onClick={() => setCurrentView('detector')}
            />
            <NavButton
              label="Chatbot"
              icon={<ChatIcon className="w-5 h-5" />}
              isActive={currentView === 'chatbot'}
              onClick={() => setCurrentView('chatbot')}
            />
            <NavButton
              label="Resources"
              icon={<BookIcon className="w-5 h-5" />}
              isActive={currentView === 'resources'}
              onClick={() => setCurrentView('resources')}
            />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;