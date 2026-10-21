import React from 'react';
import { Tag } from 'lucide-react';
import { formatPercentage } from '../../utils/formatters.js';

/**
 * Display tag chips for key phrases and terms ranked by KeyBERT relevance
 */
const KeywordsCard = ({ keywords }) => {
  if (!keywords || keywords.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-6 flex flex-col gap-4 h-full">
        <div className="flex items-center gap-2 border-b border-brand-border/40 pb-4">
          <Tag className="w-5 h-5 text-brand-accent shrink-0" />
          <h3 className="text-base font-bold text-gray-100 font-heading">Key Topics</h3>
        </div>
        <p className="text-sm text-gray-500 italic py-4">
          No key topics were identified for this article.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-6 flex flex-col gap-4 h-full">
      
      {/* Header boundary */}
      <div className="flex items-center gap-2 border-b border-brand-border/40 pb-4">
        <Tag className="w-5 h-5 text-brand-accent shrink-0" />
        <h3 className="text-base font-bold text-gray-100 font-heading">Key Topics</h3>
      </div>
      
      {/* List wrapper */}
      <div className="flex flex-wrap gap-2.5 py-1">
        {keywords.slice(0, 10).map((kw, index) => {
          const relevanceScore = kw.relevance || 0;
          return (
            <div
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-surface hover:bg-brand-surface-elevated border border-brand-border hover:border-brand-border/90 transition-all duration-200 text-xs text-gray-300 cursor-default"
              title={`Relevance: ${formatPercentage(relevanceScore)}`}
            >
              <span className="font-semibold text-gray-200">{kw.keyword}</span>
              <span className="text-[10px] text-brand-accent font-bold bg-brand-accent/15 px-1.5 py-0.5 rounded">
                {formatPercentage(relevanceScore)}
              </span>
            </div>
          );
        })}
      </div>
      
    </div>
  );
};

export default KeywordsCard;
