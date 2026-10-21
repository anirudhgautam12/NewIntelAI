import React, { useState } from 'react';
import { Copy, Check, FileText } from 'lucide-react';

/**
 * Summary card component displaying and switching between AI summarization sizes
 */
const SummaryCard = ({ summaries, defaultLength = 'medium' }) => {
  const [activeTab, setActiveTab] = useState(defaultLength);
  const [copied, setCopied] = useState(false);

  if (!summaries) return null;

  // Grab active summary or fallback to medium
  const currentSummary = summaries[activeTab] || summaries['medium'] || '';

  // Copy text content using modern Web Clipboard API
  const handleCopy = async () => {
    if (!currentSummary) return;
    try {
      await navigator.clipboard.writeText(currentSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy summary to clipboard:', err);
    }
  };

  const availableTabs = [
    { id: 'short', name: 'Short' },
    { id: 'medium', name: 'Medium' },
    { id: 'detailed', name: 'Detailed' }
  ];

  return (
    <div className="glass-panel rounded-xl p-6 flex flex-col gap-4">
      
      {/* Header and control elements */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-brand-border/40 pb-4 gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-accent shrink-0" />
          <h3 className="text-base font-bold text-gray-100 font-heading">AI Summary</h3>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Summary toggle buttons */}
          <div className="flex bg-brand-surface p-1 rounded-lg border border-brand-border text-xs font-semibold">
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md transition-all duration-200 cursor-pointer focus:outline-none ${
                  activeTab === tab.id
                    ? 'bg-brand-accent text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Copy option button */}
          {currentSummary && (
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg border border-brand-border hover:bg-brand-surface-elevated text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none"
              title="Copy summary"
              aria-label="Copy summary to clipboard"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400 shrink-0" />
              ) : (
                <Copy className="w-4 h-4 shrink-0" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main summary text box */}
      <div className="min-h-[100px]">
        {currentSummary ? (
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line tracking-wide">
            {currentSummary}
          </p>
        ) : (
          <p className="text-sm text-gray-500 italic">
            This granularity of summary is currently unavailable.
          </p>
        )}
      </div>
      
    </div>
  );
};

export default SummaryCard;
