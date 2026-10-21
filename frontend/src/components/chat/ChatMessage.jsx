import React from 'react';
import { User, Cpu } from 'lucide-react';
import SourceContext from './SourceContext.jsx';

/**
 * Chat conversation bubble pair displaying the User's question and the AI's answer with citations
 */
const ChatMessage = ({ message }) => {
  if (!message) return null;

  const { question, answer, sources } = message;

  return (
    <div className="flex flex-col gap-5 w-full">
      
      {/* 1. User Bubble (Right Aligned) */}
      <div className="flex items-start justify-end gap-3 max-w-[85%] ml-auto">
        <div className="flex flex-col items-end">
          <div className="px-4 py-2.5 rounded-2xl bg-brand-accent text-white text-sm font-semibold rounded-tr-none shadow-md shadow-brand-accent/10">
            <p className="whitespace-pre-line leading-relaxed">{question}</p>
          </div>
          <span className="text-[9px] text-gray-500 mt-1 uppercase font-extrabold tracking-widest">
            You
          </span>
        </div>
        
        <div className="w-8 h-8 rounded-full bg-brand-surface-elevated border border-brand-border flex items-center justify-center text-gray-400 shrink-0 select-none">
          <User className="w-4 h-4 shrink-0" />
        </div>
      </div>

      {/* 2. AI Assistant Bubble (Left Aligned) */}
      <div className="flex items-start justify-start gap-3 max-w-[85%] mr-auto w-full">
        <div className="w-8 h-8 rounded-full bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-brand-accent shrink-0 select-none">
          <Cpu className="w-4 h-4 shrink-0" />
        </div>
        
        <div className="flex flex-col items-start w-full">
          <div className="w-full px-4 py-2.5 rounded-2xl bg-brand-surface border border-brand-border text-sm text-gray-300 rounded-tl-none leading-relaxed">
            <p className="whitespace-pre-line text-gray-200">{answer}</p>
            
            {/* Citations panel if FAISS sources are provided */}
            <SourceContext sources={sources} />
          </div>
          <span className="text-[9px] text-gray-500 mt-1 uppercase font-extrabold tracking-widest">
            NewsIntel Assistant
          </span>
        </div>
      </div>
      
    </div>
  );
};

export default ChatMessage;
