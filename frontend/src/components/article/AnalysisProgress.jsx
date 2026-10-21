import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Animated intermediate processing component loaded during API wait states
 */
const AnalysisProgress = () => {
  const pipelineMessages = [
    'Preparing your article...',
    'Scraping and processing article text...',
    'Generating AI summaries (Short, Medium, Detailed)...',
    'Analyzing 3-class sentiment values...',
    'Extracting key topics (KeyBERT)...',
    'Identifying named entities (spaCy NER)...',
    'Compiling final intelligence profile...'
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  // Rotate messages every 3 seconds to keep user updated on NLP pipeline progress
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % pipelineMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-md mx-auto gap-6">
      
      {/* Glow icon */}
      <div className="p-4 bg-brand-accent/15 rounded-full border border-brand-accent/20 text-brand-accent animate-bounce">
        <Sparkles className="w-10 h-10 shrink-0" />
      </div>
      
      {/* Title & dynamic logs */}
      <div className="w-full flex flex-col gap-2">
        <h3 className="text-lg font-bold text-gray-100 font-heading">Analyzing News Intelligence</h3>
        <p className="text-sm text-gray-400 font-medium h-5 tracking-wide animate-pulse">
          {pipelineMessages[messageIndex]}
        </p>
      </div>

      {/* Indeterminate Slide Progress track bar */}
      <div className="w-full h-1.5 bg-brand-surface rounded-full overflow-hidden border border-brand-border">
        <div className="h-full bg-brand-accent rounded-full w-1/3 animate-loading-slide" />
      </div>

      <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest leading-relaxed">
        Local AI models may take longer on the first analysis.
      </p>
      
    </div>
  );
};

export default AnalysisProgress;
