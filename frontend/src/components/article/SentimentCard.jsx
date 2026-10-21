import React from 'react';
import { Smile, Frown, Meh, Percent } from 'lucide-react';
import { formatPercentage } from '../../utils/formatters.js';

/**
 * Display overall sentiment tone and statistical confidence score
 */
const SentimentCard = ({ sentiment }) => {
  if (!sentiment) return null;

  const { label = 'NEUTRAL', confidence = 0 } = sentiment;

  // Configuration mapping based on sentiment label
  const stylingConfig = {
    POSITIVE: {
      color: 'text-green-400 border-green-500/20 bg-green-950/20',
      icon: Smile,
      title: 'Positive'
    },
    NEGATIVE: {
      color: 'text-red-400 border-red-500/20 bg-red-950/20',
      icon: Frown,
      title: 'Negative'
    },
    NEUTRAL: {
      color: 'text-amber-400 border-amber-500/20 bg-amber-950/20',
      icon: Meh,
      title: 'Neutral'
    }
  };

  const activeStyle = stylingConfig[label.toUpperCase()] || stylingConfig.NEUTRAL;
  const IconComponent = activeStyle.icon;

  return (
    <div className="glass-panel rounded-xl p-6 flex flex-col gap-4 h-full">
      
      {/* Header boundary */}
      <div className="flex items-center gap-2 border-b border-brand-border/40 pb-4">
        <Percent className="w-5 h-5 text-brand-accent shrink-0" />
        <h3 className="text-base font-bold text-gray-100 font-heading">Sentiment Summary</h3>
      </div>

      {/* Main visualization stats */}
      <div className="flex flex-col items-center justify-center flex-1 py-4 gap-3 text-center">
        
        {/* Glow-ringed icon */}
        <div className={`p-4 rounded-full border ${activeStyle.color} flex items-center justify-center`}>
          <IconComponent className="w-10 h-10 shrink-0" />
        </div>
        
        {/* Heading label details */}
        <div>
          <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest block">
            Overall tone
          </span>
          <h4 className="text-2xl font-bold text-gray-100 mt-1 font-heading">{activeStyle.title}</h4>
        </div>

        {/* Confidence metric indicator block */}
        <div className="bg-brand-surface border border-brand-border px-4 py-2 rounded-lg text-xs font-semibold text-gray-400 mt-1">
          Confidence Score: <span className="text-white ml-1 font-bold">{formatPercentage(confidence)}</span>
        </div>
        
      </div>
      
    </div>
  );
};

export default SentimentCard;
