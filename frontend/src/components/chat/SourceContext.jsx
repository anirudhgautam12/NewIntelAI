import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Collapsible section showcasing vector sources (RAG reference chunks) used to formulate the AI response
 */
const SourceContext = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-2.5 border-t border-brand-border/30 pt-2 flex flex-col gap-1.5 w-full">
      
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="inline-flex items-center text-[10px] font-bold text-brand-accent hover:text-brand-accent-hover transition-colors duration-200 gap-1.5 focus:outline-none cursor-pointer"
      >
        <BookOpen className="w-3.5 h-3.5 shrink-0" />
        <span>{isOpen ? 'Hide source reference' : `View source context (${sources.length})`}</span>
        {isOpen ? (
          <ChevronUp className="w-3 h-3 shrink-0" />
        ) : (
          <ChevronDown className="w-3 h-3 shrink-0" />
        )}
      </button>

      {/* Citations panels */}
      {isOpen && (
        <div className="flex flex-col gap-2 mt-1.5 max-h-[160px] overflow-y-auto pr-1">
          {sources.map((src, index) => (
            <div
              key={index}
              className="p-2.5 bg-brand-surface-elevated/35 border border-brand-border rounded text-[11px] text-gray-400 leading-relaxed"
            >
              <p className="whitespace-pre-line">{src.text}</p>
              <span className="text-[9px] text-gray-500 font-extrabold block mt-1.5 uppercase tracking-widest select-none">
                Source Block: {src.chunkId}
              </span>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default SourceContext;
