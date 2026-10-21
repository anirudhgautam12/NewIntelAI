import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useArticle } from '../hooks/useArticle.js';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import ArticleInput from '../components/article/ArticleInput.jsx';
import AnalysisProgress from '../components/article/AnalysisProgress.jsx';
import ErrorState from '../components/common/ErrorState.jsx';

/**
 * AnalyzePage handles news article input submissions, loading intermediate states, and routing on success
 */
const AnalyzePage = () => {
  const navigate = useNavigate();
  const { analyzeArticle, loading, error, setError } = useArticle();

  const handleAnalysisSubmit = async (payload) => {
    try {
      const data = await analyzeArticle(payload);
      if (data && data._id) {
        navigate(`/articles/${data._id}`);
      }
    } catch (err) {
      console.error('Submission analysis error:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        
        {/* Header section (only shown when not loading to avoid layout shifts) */}
        {!loading && (
          <div className="border-b border-brand-border/40 pb-6">
            <h2 className="text-2xl font-bold text-gray-100 font-heading">
              Analyze News Article
            </h2>
            <p className="text-xs text-gray-400 mt-1 tracking-wide">
              Submit news text or raw URLs to run summaries, KeyBERT extraction, and spaCy NER.
            </p>
          </div>
        )}

        {loading ? (
          <div className="glass-panel rounded-xl p-8 max-w-xl mx-auto w-full mt-6">
            <AnalysisProgress />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {error && (
              <div className="max-w-3xl mx-auto w-full">
                <ErrorState
                  title="Analysis Failed"
                  message={error}
                  onRetry={() => setError(null)}
                />
              </div>
            )}
            
            <ArticleInput onSubmit={handleFormSubmit => handleAnalysisSubmit(handleFormSubmit)} isLoading={loading} />
          </div>
        )}
        
      </div>
    </DashboardLayout>
  );
};

export default AnalyzePage;
