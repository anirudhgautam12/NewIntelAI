import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';

/**
 * Text area input component supporting auto-expanding input heights and submission keys
 */
const ChatInput = ({ onSend, isDisabled }) => {
  const [queryText, setQueryText] = useState('');
  const textRef = useRef(null);

  const handleSubmitAction = (e) => {
    if (e) e.preventDefault();
    if (!queryText.trim() || isDisabled) return;

    onSend(queryText.trim());
    setQueryText('');

    // Reset layout height
    if (textRef.current) {
      textRef.current.style.height = 'auto';
    }
  };

  const handleKeyDownAction = (e) => {
    // If Enter key is pressed without holding Shift, trigger submission
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitAction();
    }
  };

  const handleTextChange = (e) => {
    setQueryText(e.target.value);
    
    // Auto grow textarea size up to 120px
    if (textRef.current) {
      textRef.current.style.height = 'auto';
      textRef.current.style.height = `${Math.min(textRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <form
      onSubmit={handleSubmitAction}
      className="flex items-end gap-2 w-full bg-brand-surface border border-brand-border rounded-xl p-2 focus-within:ring-2 focus-within:ring-brand-accent/30 transition-all duration-200"
    >
      <textarea
        ref={textRef}
        rows={1}
        value={queryText}
        onChange={handleTextChange}
        onKeyDown={handleKeyDownAction}
        disabled={isDisabled}
        placeholder="Ask anything about this article..."
        className="flex-1 max-h-[120px] bg-transparent border-0 text-sm text-gray-250 placeholder-gray-600 focus:outline-none focus:ring-0 resize-none py-2 px-3 leading-relaxed self-center"
      />
      
      <button
        type="submit"
        disabled={isDisabled || !queryText.trim()}
        className="p-2.5 bg-brand-accent hover:bg-brand-accent-hover text-white disabled:bg-slate-800 disabled:text-gray-600 rounded-lg transition-all duration-200 shrink-0 cursor-pointer focus:outline-none self-center"
        aria-label="Send message"
      >
        <Send className="w-4 h-4 shrink-0" />
      </button>
    </form>
  );
};

export default ChatInput;
