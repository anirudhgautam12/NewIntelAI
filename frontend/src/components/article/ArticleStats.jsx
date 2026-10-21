import React from 'react';
import { AlignLeft, Timer, Sparkles, BookOpen } from 'lucide-react';
import { formatCompressionRatio } from '../../utils/formatters.js';
import { READING_SPEED_WPM } from '../../utils/constants.js';

/**
 * Display grid stats comparing original text and summarized outputs
 */
const ArticleStats = ({
  originalWordCount = 0,
  summaryWordCount = 0,
  compressionRatio = 0
}) => {
  // Estimate reading times using 200 WPM default constant
  const originalReadMin = Math.ceil(originalWordCount / READING_SPEED_WPM);
  const summaryReadMin = Math.ceil(summaryWordCount / READING_SPEED_WPM);
  const minSaved = Math.max(0, originalReadMin - summaryReadMin);

  // Math checks for display descriptions
  const percentageShorter = Math.max(0, Math.round((1.0 - compressionRatio) * 100));

  const statsItems = [
    {
      title: 'Original Length',
      value: `${originalWordCount} words`,
      desc: `Est. ${originalReadMin} min read`,
      icon: AlignLeft
    },
    {
      title: 'Summary Length',
      value: `${summaryWordCount} words`,
      desc: `Est. ${summaryReadMin} min read`,
      icon: BookOpen
    },
    {
      title: 'Compression',
      value: formatCompressionRatio(compressionRatio),
      desc: `${percentageShorter}% size reduction`,
      icon: Sparkles
    },
    {
      title: 'Estimated Saved',
      value: `${minSaved} min`,
      desc: 'Based on 200 WPM average',
      icon: Timer
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {statsItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div
            key={index}
            className="glass-panel rounded-xl p-4 flex items-start gap-3 border border-brand-border/60"
          >
            {/* Icon wrapper */}
            <div className="p-2 bg-brand-surface-elevated rounded-lg border border-brand-border text-brand-accent shrink-0">
              <IconComponent className="w-5 h-5 shrink-0" />
            </div>
            
            {/* Info details */}
            <div className="overflow-hidden">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                {item.title}
              </span>
              <span className="text-lg font-bold text-gray-100 block mt-0.5 font-heading">
                {item.value}
              </span>
              <span className="text-[10px] text-gray-400 block mt-0.5 font-medium tracking-wide">
                {item.desc}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ArticleStats;
