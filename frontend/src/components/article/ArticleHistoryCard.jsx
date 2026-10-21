import React from 'react';
import { Calendar, Tag, ChevronRight, Trash2, Link2, Type } from 'lucide-react';
import { formatDate } from '../../utils/formatters.js';
import Badge from '../common/Badge.jsx';

/**
 * Historical card item showcasing core metrics from previous analysis reports
 */
const ArticleHistoryCard = ({ article, onView, onDelete }) => {
  if (!article) return null;

  const {
    _id,
    title = 'Untitled Article',
    inputType,
    sentiment,
    keywords = [],
    createdAt,
    summary = {}
  } = article;

  // Grab the best available summary preview
  const summaryPreview = summary.medium || summary.short || '';

  const sentimentBadgeVariants = {
    POSITIVE: 'success',
    NEUTRAL: 'warning',
    NEGATIVE: 'danger'
  };

  const sentimentLabel = sentiment?.label || 'NEUTRAL';
  const activeVariant = sentimentBadgeVariants[sentimentLabel.toUpperCase()] || 'secondary';

  return (
    <div className="glass-panel hover:bg-brand-surface-elevated/20 transition-all duration-300 rounded-xl p-5 flex flex-col justify-between gap-4 group">
      
      <div className="flex flex-col gap-2">
        
        {/* Ingest type and timestamp header */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5 font-semibold">
            {inputType === 'url' ? (
              <>
                <Link2 className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                <span>URL Input</span>
              </>
            ) : (
              <>
                <Type className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Text Paste</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>

        {/* Article title */}
        <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors line-clamp-1 font-heading">
          {title}
        </h4>

        {/* Text preview */}
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mt-0.5">
          {summaryPreview}
        </p>

        {/* Top keywords */}
        {keywords.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <Tag className="w-3 h-3 text-gray-650 shrink-0" />
            {keywords.slice(0, 3).map((kw, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold text-gray-400 bg-brand-surface/40 px-2 py-0.5 rounded border border-brand-border"
              >
                {kw.keyword}
              </span>
            ))}
          </div>
        )}
        
      </div>

      {/* Footer panel control items */}
      <div className="flex items-center justify-between border-t border-brand-border/40 pt-3 mt-1">
        <Badge variant={activeVariant}>{sentimentLabel}</Badge>
        
        <div className="flex items-center gap-2">
          {/* Delete Action Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(_id);
            }}
            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-500/20 rounded-lg transition-colors cursor-pointer focus:outline-none"
            title="Delete analysis report"
            aria-label="Delete report"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
          </button>
          
          {/* View Details Action Trigger */}
          <button
            onClick={() => onView(_id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-surface-elevated/75 hover:bg-brand-accent text-xs font-bold text-gray-200 hover:text-white rounded-lg border border-brand-border hover:border-brand-accent transition-all duration-200 cursor-pointer focus:outline-none"
          >
            <span>View</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default ArticleHistoryCard;
