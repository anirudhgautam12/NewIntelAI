import api from './axios.js';

/**
 * Ask a context-grounded question about an analyzed article (RAG Q&A)
 */
export const askQuestionApi = async (articleId, question) => {
  const response = await api.post(`/articles/${articleId}/ask`, { question });
  return response.data.data; // Returns the newly created ChatMessage document
};

/**
 * Fetch existing conversation messages for an article
 */
export const getChatHistoryApi = async (articleId) => {
  const response = await api.get(`/articles/${articleId}/chat`);
  return response.data.data; // Returns a list of ChatMessage documents
};
