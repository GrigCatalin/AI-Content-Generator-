import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

export default function AIContentGenerator() {
  const [inputText, setInputText] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);

  const generateContent = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/generate', { prompt: inputText });
      setGeneratedText(response.data.text);
    } catch (error) {
      console.error('Error generating content:', error);
    }
    setLoading(false);
  };

  const exportText = () => {
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'generated_content.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(generatedText, 10, 10);
    doc.save('generated_content.pdf');
  };

  return (
    <div className="p-5 max-w-lg mx-auto text-center">
      <h1 className="text-xl font-bold mb-4">AI Content Generator</h1>
      <textarea 
        className="w-full p-2 border rounded mb-4"
        placeholder="Enter your topic..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        onClick={generateContent} 
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Content'}
      </button>
      {generatedText && (
        <div className="mt-4 p-3 border rounded bg-gray-100">
          <p>{generatedText}</p>
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded mt-2 mr-2"
            onClick={exportText}
          >
            Export as TXT
          </button>
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded mt-2"
            onClick={exportPDF}
          >
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
}