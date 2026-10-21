import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar } from 'lucide-react';
import { useArticle } from '../hooks/useArticle.js';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import PageLoader from '../components/common/PageLoader.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import ArticleStats from '../components/article/ArticleStats.jsx';
import SummaryCard from '../components/article/SummaryCard.jsx';
import SentimentCard from '../components/article/SentimentCard.jsx';
import SentimentChart from '../components/article/SentimentChart.jsx';
import KeywordsCard from '../components/article/KeywordsCard.jsx';
import EntitiesCard from '../components/article/EntitiesCard.jsx';
import ArticleChat from '../components/chat/ArticleChat.jsx';
import { formatDate } from '../utils/formatters.js';

/**
 * AnalysisResultPage pulls detail indicators for an analyzed article and maps charts/QA workspaces
 */
const AnalysisResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentArticle, fetchArticleById, loading, error } = useArticle();

  useEffect(() => {
    if (id) {
      fetchArticleById(id);
    }
  }, [id, fetchArticleById]);

  if (loading) {
    return (
      <DashboardLayout>
        <PageLoader message="Loading news intelligence report..." />
      </DashboardLayout>
    );
  }

  if (error || !currentArticle) {
    return (
      <DashboardLayout>
        <div className="mt-8 max-w-xl mx-auto w-full">
          <ErrorState
            title="Failed to Load Report"
            message={
              error || 'The requested analysis report was not found or is unavailable.'
            }
            onRetry={() => id && fetchArticleById(id)}
          />
          <div className="text-center mt-6">
            <Link to="/dashboard" className="text-sm text-brand-accent hover:underline font-semibold focus:outline-none">
              Back to Dashboard Overview
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const {
    title = 'Untitled Article Analysis',
    inputType,
    articleUrl,
    summary,
    sentiment,
    keywords,
    entities,
    originalWordCount,
    summaryWordCount,
    compressionRatio,
    createdAt
  } = currentArticle;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        
        {/* Navigation and Headline Header */}
        <div className="flex flex-col gap-4 border-b border-brand-border/40 pb-6">
          <button
            onClick={() => navigate('/history')}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none w-fit cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <span>Back to History</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-150 leading-tight font-heading">
                {title}
              </h2>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>{formatDate(createdAt)}</span>
                </span>
                
                {inputType === 'url' && articleUrl && (
                  <a
                    href={articleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-brand-accent hover:text-brand-accent-hover transition-colors duration-200 focus:outline-none"
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    <span>View original source link</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Readability & Comparison Metrics */}
        <ArticleStats
          originalWordCount={originalWordCount}
          summaryWordCount={summaryWordCount}
          compressionRatio={compressionRatio}
        />

        {/* Master workspace layout grids */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-2">
          
          {/* Left Columns - NLP Extractors */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Summarization tabs */}
            <SummaryCard summaries={summary} />

            {/* Sentiment Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SentimentCard sentiment={sentiment} />
              <SentimentChart scores={sentiment?.scores} />
            </div>

            {/* Entities & Topics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <KeywordsCard keywords={keywords} />
              <EntitiesCard entities={entities} />
            </div>
            
          </div>

          {/* Right Columns - Grounded Q&A Assistant */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <ArticleChat articleId={currentArticle._id} />
            </div>
          </div>
          
        </div>
        
      </div>
    </DashboardLayout>
  );
};

export default AnalysisResultPage;
