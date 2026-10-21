import api from './axios.js';

/**
 * Submit text or URL to undergo AI summarization and NLP analysis
 */
export const analyzeArticleApi = async (payload) => {
  const response = await api.post('/articles/analyze', payload);
  return response.data.data; // Returns the analyzed article document
};

/**
 * Fetch paginated analysis history with sentiment filtering option
 */
export const getArticlesApi = async (page = 1, limit = 10, sentiment = '') => {
  const params = { page, limit };
  if (sentiment && sentiment !== 'ALL') {
    params.sentiment = sentiment;
  }
  
  const response = await api.get('/articles', { params });
  return response.data.data; // Returns { articles, pagination: { total, page, limit, pages } }
};

/**
 * Retrieve full analysis details of an article by its ID
 */
export const getArticleByIdApi = async (id) => {
  const response = await api.get(`/articles/${id}`);
  return response.data.data; // Returns the full article document
};

/**
 * Delete a specific article analysis and cascade delete its chat history
 */
export const deleteArticleApi = async (id) => {
  const response = await api.delete(`/articles/${id}`);
  return response.data; // Returns standard success response
};
