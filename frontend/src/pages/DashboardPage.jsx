import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Sparkles, AlertCircle, PlusCircle, ArrowRight, TrendingUp } from 'lucide-react';

import { getArticlesApi } from '../api/article.api.js';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import Button from '../components/common/Button.jsx';
import PageLoader from '../components/common/PageLoader.jsx';
import ArticleHistoryCard from '../components/article/ArticleHistoryCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { useAuth } from '../hooks/useAuth.js';

/**
 * Dashboard Overview Page
 */
const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, positive: 0, neutral: 0, negative: 0 });

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Pull recent 20 analyses to resolve dashboard summary values
      const data = await getArticlesApi(1, 20);
      const articlesList = data.articles || [];
      
      setRecentReports(articlesList.slice(0, 4));

      // Aggregate sentiment details
      const aggregates = {
        total: articlesList.length,
        positive: 0,
        neutral: 0,
        negative: 0
      };

      articlesList.forEach((report) => {
        const label = report.sentiment?.label?.toUpperCase();
        if (label === 'POSITIVE') aggregates.positive++;
        else if (label === 'NEGATIVE') aggregates.negative++;
        else aggregates.neutral++;
      });

      setStats(aggregates);
    } catch (err) {
      console.error(err);
      setError('Unable to load news intelligence activity logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        
        {/* Title and main CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-brand-border/40 pb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-100 font-heading">
              Welcome back, {user?.name || 'Reader'}
            </h2>
            <p className="text-xs text-gray-400 mt-1 tracking-wide">
              Here is a summary of your news summarization and analysis reports.
            </p>
          </div>
          
          <Button variant="primary" onClick={() => navigate('/analyze')} icon={PlusCircle}>
            New Analysis
          </Button>
        </div>

        {loading ? (
          <PageLoader message="Loading activity reports dashboard..." />
        ) : error ? (
          <div className="flex items-center gap-2.5 bg-red-950/20 border border-red-500/20 p-4 rounded-xl text-sm font-semibold text-red-400 max-w-lg mx-auto">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        ) : (
          <>
            {/* Stats Row Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: 'Total Reports',
                  value: stats.total,
                  desc: 'Calculated from last 20 articles',
                  color: 'text-indigo-400'
                },
                {
                  label: 'Positive Tone',
                  value: stats.positive,
                  desc: 'Optimistic sentiment count',
                  color: 'text-green-400'
                },
                {
                  label: 'Neutral Tone',
                  value: stats.neutral,
                  desc: 'Objective/impartial count',
                  color: 'text-amber-400'
                },
                {
                  label: 'Negative Tone',
                  value: stats.negative,
                  desc: 'Critical sentiment count',
                  color: 'text-red-400'
                }
              ].map((card, index) => (
                <div
                  key={index}
                  className="glass-panel p-5 rounded-xl flex flex-col justify-between border border-brand-border/60"
                >
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    {card.label}
                  </span>
                  <span className={`text-3xl font-bold mt-2 font-heading ${card.color}`}>
                    {card.value}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1.5 font-medium tracking-wide">
                    {card.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Content Lists area */}
            {recentReports.length === 0 ? (
              <EmptyState
                icon={TrendingUp}
                title="No reports analyzed yet"
                description="Ingest articles from raw copy text or crawl standard web URLs to display live NLP intelligence indicators."
                actionText="Create First Analysis"
                onAction={() => navigate('/analyze')}
                className="mt-4"
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                
                {/* Left side recent reports */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-2 border-b border-brand-border/40">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Recent Intelligence Reports
                    </h3>
                    <button
                      onClick={() => navigate('/history')}
                      className="text-xs text-brand-accent hover:text-brand-accent-hover font-semibold flex items-center gap-1 cursor-pointer focus:outline-none"
                    >
                      <span>View History</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recentReports.map((report) => (
                      <ArticleHistoryCard
                        key={report._id}
                        article={report}
                        onView={(id) => navigate(`/articles/${id}`)}
                        onDelete={() => navigate('/history')}
                      />
                    ))}
                  </div>
                </div>

                {/* Right side Q&A pipeline guide */}
                <div className="glass-panel p-6 rounded-xl flex flex-col gap-4.5 self-start">
                  <div className="flex items-center gap-2 pb-2 border-b border-brand-border/40">
                    <Sparkles className="w-4 h-4 text-brand-accent shrink-0 animate-pulse" />
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest font-heading">
                      Grounded QA Indexing
                    </h3>
                  </div>
                  
                  <p className="text-xs text-gray-400 leading-relaxed tracking-wide">
                    Articles you analyze are chunked, parsed into semantic vector embeddings, and indexed locally via <strong>FAISS</strong>.
                  </p>
                  
                  <p className="text-xs text-gray-400 leading-relaxed tracking-wide">
                    This lets you chat with your documents using <strong>Google Gemini</strong> inside a strictly grounded context loop.
                  </p>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/analyze')}
                    className="w-full mt-1.5"
                  >
                    Analyze New Article
                  </Button>
                </div>
                
              </div>
            )}
          </>
        )}
        
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
