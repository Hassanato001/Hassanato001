
import React, { useState, useCallback } from 'react';
import { analyzePlantImage } from '../services/geminiService';
import Spinner from './Spinner';

const DiseaseDetector: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError('File is too large. Please select an image under 4MB.');
        return;
      }
      setError('');
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult('');
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) {
      setError('Please select an image first.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult('');
    try {
      const analysisResult = await analyzePlantImage(imageFile);
      setResult(analysisResult);
    } catch (err) {
      setError('An unexpected error occurred during analysis.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  const formattedResult = result.split('\n').map((line, index) => {
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
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-800">Crop Disease & Pest Detector</h2>
        <p className="text-gray-600 mt-2">Upload a photo of your plant to get an AI-powered diagnosis and treatment plan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-teal-300 rounded-lg h-full">
          {previewUrl ? (
            <img src={previewUrl} alt="Plant preview" className="max-h-64 w-auto rounded-md object-contain" />
          ) : (
            <div className="text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="mt-2">Image preview will appear here</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="file-upload" className="cursor-pointer bg-teal-100 text-teal-700 font-semibold py-3 px-4 rounded-lg text-center hover:bg-teal-200 transition-colors">
            {imageFile ? `Selected: ${imageFile.name}` : 'Choose an Image'}
          </label>
          <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !imageFile}
            className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 disabled:bg-teal-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? <><Spinner /> Analyzing...</> : 'Analyze Plant'}
          </button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      </div>

      {(isLoading || result) && (
        <div className="mt-8 pt-6 border-t border-teal-200">
          <h3 className="text-xl font-bold text-teal-800 mb-4">Analysis Result</h3>
          {isLoading && (
            <div className="flex flex-col items-center justify-center bg-teal-50 p-6 rounded-lg">
                <Spinner />
                <p className="mt-2 text-teal-700">AI is analyzing your plant, please wait...</p>
            </div>
          )}
          {result && (
            <div className="bg-teal-50 p-4 sm:p-6 rounded-lg prose max-w-none">
              {formattedResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiseaseDetector;