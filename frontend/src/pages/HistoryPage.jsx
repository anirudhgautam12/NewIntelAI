import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, FolderOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { useArticle } from '../hooks/useArticle.js';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import PageLoader from '../components/common/PageLoader.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import ArticleHistoryCard from '../components/article/ArticleHistoryCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Modal from '../components/common/Modal.jsx';
import Button from '../components/common/Button.jsx';

/**
 * HistoryPage lists analyzed articles with sentiment filtering and pagination, alongside modal confirmations for deletion
 */
const HistoryPage = () => {
  const navigate = useNavigate();
  const {
    articles,
    loading,
    error,
    pagination,
    fetchArticles,
    deleteArticle
  } = useArticle();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSentiment, setSelectedSentiment] = useState('ALL');
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync historical listings on page/filter adjustments
  useEffect(() => {
    fetchArticles(currentPage, 6, selectedSentiment);
  }, [currentPage, selectedSentiment, fetchArticles]);

  const handleSentimentFilter = (e) => {
    setSelectedSentiment(e.target.value);
    setCurrentPage(1); // Re-zero pagination pages on filter modification
  };

  const handlePageDecrement = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handlePageIncrement = () => {
    if (currentPage < pagination.pages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const triggerOpenDelete = (id) => {
    setDeleteTargetId(id);
  };

  const triggerCloseDelete = () => {
    setDeleteTargetId(null);
  };

  const triggerConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteArticle(deleteTargetId);
      triggerCloseDelete();

      // If we emptied the page and page index is high, decrement
      if (articles.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        // Refresh page indicators
        fetchArticles(currentPage, 6, selectedSentiment);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        
        {/* Header content and filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-brand-border/40 pb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-100 font-heading">
              Analysis History
            </h2>
            <p className="text-xs text-gray-400 mt-1 tracking-wide">
              Browse, filter, and delete your analyzed articles.
            </p>
          </div>

          {/* Sentiment Dropdown Filter */}
          <div className="flex items-center gap-2 bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-xs font-semibold text-gray-400 focus-within:ring-2 focus-within:ring-brand-accent/30 transition-all w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-500 shrink-0" />
            <select
              value={selectedSentiment}
              onChange={handleSentimentFilter}
              className="bg-transparent border-0 text-gray-200 focus:outline-none focus:ring-0 cursor-pointer text-xs font-bold font-sans pr-4"
            >
              <option value="ALL">All Sentiments</option>
              <option value="POSITIVE">Positive</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="NEGATIVE">Negative</option>
            </select>
          </div>
        </div>

        {/* Dynamic page state rendering */}
        {loading && articles.length === 0 ? (
          <PageLoader message="Loading articles history database..." />
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={() => fetchArticles(currentPage, 6, selectedSentiment)}
          />
        ) : articles.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title={selectedSentiment === 'ALL' ? 'History is empty' : 'No matches found'}
            description={
              selectedSentiment === 'ALL'
                ? "You haven't run any article analysis yet. Submit an article to begin building your intelligence database."
                : `No analyzed articles matching the "${selectedSentiment.toLowerCase()}" tone filter were found.`
            }
            actionText={selectedSentiment === 'ALL' ? 'Analyze First Article' : undefined}
            onAction={selectedSentiment === 'ALL' ? () => navigate('/analyze') : undefined}
            className="mt-4"
          />
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* Grid list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((item) => (
                <ArticleHistoryCard
                  key={item._id}
                  article={item}
                  onView={(id) => navigate(`/articles/${id}`)}
                  onDelete={triggerOpenDelete}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between border-t border-brand-border/40 pt-6 mt-2">
                <div className="text-xs text-gray-500 font-extrabold uppercase tracking-widest">
                  Page {pagination.page} of {pagination.pages}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePageDecrement}
                    disabled={currentPage === 1 || loading}
                    icon={ChevronLeft}
                  >
                    Previous
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePageIncrement}
                    disabled={currentPage === pagination.pages || loading}
                    icon={ChevronRight}
                    className="flex-row-reverse"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
            
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteTargetId !== null}
          onClose={triggerCloseDelete}
          title="Delete Analysis Confirmation"
        >
          <div className="flex flex-col gap-4">
            <p>
              Are you sure you want to delete this analysis report? This action cannot be undone and will permanently delete all associated QA conversation logs from the database.
            </p>
            
            <div className="flex justify-end gap-3 border-t border-brand-border/40 pt-4 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={triggerCloseDelete}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              
              <Button
                variant="danger"
                size="sm"
                onClick={triggerConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </Button>
            </div>
          </div>
        </Modal>
        
      </div>
    </DashboardLayout>
  );
};

export default HistoryPage;
