import { useState, useCallback } from 'react';
import {
  analyzeArticleApi,
  getArticlesApi,
  getArticleByIdApi,
  deleteArticleApi
} from '../api/article.api.js';

/**
 * Custom hook to manage article state, analysis requests, fetching history, and deletion.
 */
export const useArticle = () => {
  const [articles, setArticles] = useState([]);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });

  // Requests Node API to scrape or ingest article text and run AI models
  const analyzeArticle = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeArticleApi(payload);
      setCurrentArticle(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'An error occurred during analysis';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetches a paginated history list of analyzed articles belonging to the current user
  const fetchArticles = useCallback(async (page = 1, limit = 10, sentiment = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArticlesApi(page, limit, sentiment);
      setArticles(data.articles || []);
      setPagination(data.pagination || { total: 0, page, limit, pages: 1 });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch article history';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch full details of an article analysis by its ID
  const fetchArticleById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArticleByIdApi(id);
      setCurrentArticle(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch article details';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete an article analysis and its corresponding chat logs
  const deleteArticle = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteArticleApi(id);
      setArticles((prev) => prev.filter((item) => item._id !== id));
      if (currentArticle && currentArticle._id === id) {
        setCurrentArticle(null);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete the article';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    articles,
    currentArticle,
    loading,
    error,
    pagination,
    analyzeArticle,
    fetchArticles,
    fetchArticleById,
    deleteArticle,
    setCurrentArticle,
    setError
  };
};
