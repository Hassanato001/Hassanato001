
import React, { useState, useCallback } from 'react';
import { generateResourceGuide } from '../services/geminiService';
import Spinner from './Spinner';

const ResourceHub: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [guide, setGuide] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGenerateGuide = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError('');
    setGuide('');
    try {
      const generatedGuide = await generateResourceGuide(topic);
      setGuide(generatedGuide);
    } catch (err) {
      setError('An unexpected error occurred while generating the guide.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [topic]);
  
  const formattedGuide = guide.split('\n').map((line, index) => {
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-teal-800">{line.substring(4)}</h3>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-xl font-bold mt-6 mb-3 text-teal-900">{line.substring(3)}</h2>;
    }
    if (line.startsWith('* ')) {
      return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
    }
    return <p key={index} className="mb-2 text-gray-700">{line}</p>;
  });


  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-800">Farming Resource Hub</h2>
        <p className="text-gray-600 mt-2">Get instant, AI-generated guides on any farming topic.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., 'How to make organic fertilizer'"
          className="w-full p-3 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
          onKeyPress={(e) => e.key === 'Enter' && handleGenerateGuide()}
        />
        <button
          onClick={handleGenerateGuide}
          disabled={isLoading || !topic.trim()}
          className="w-full sm:w-auto bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 disabled:bg-teal-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 flex-shrink-0"
        >
          {isLoading ? <><Spinner /> Generating...</> : 'Generate Guide'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

      {(isLoading || guide) && (
        <div className="mt-8 pt-6 border-t border-teal-200">
          <h3 className="text-xl font-bold text-teal-800 mb-4">{isLoading ? 'Generating your guide...' : `Guide: ${topic}`}</h3>
          {isLoading && (
            <div className="flex flex-col items-center justify-center bg-teal-50 p-6 rounded-lg">
                <Spinner />
                <p className="mt-2 text-teal-700">Please wait while the AI prepares your guide...</p>
            </div>
          )}
          {guide && (
            <div className="bg-teal-50 p-4 sm:p-6 rounded-lg prose max-w-none">
              {formattedGuide}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceHub;