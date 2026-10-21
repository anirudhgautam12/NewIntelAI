import axios from 'axios';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

// Create a reusable Axios client with 120s timeout for model inference
const aiClient = axios.create({
  baseURL: config.aiServiceUrl,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request article text extraction from a URL
 * @param {string} url 
 * @returns {Promise<{title: string, articleText: string}>}
 */
export const extractArticle = async (url) => {
  try {
    const response = await aiClient.post('/api/extract-article', { url });
    return {
      title: response.data.title,
      articleText: response.data.article_text
    };
  } catch (error) {
    const message = error.response?.data?.detail || error.message || 'Failed to extract article from URL';
    const status = error.response?.status || 500;
    throw new ApiError(status, `AI service extraction error: ${message}`);
  }
};

/**
 * Request NLP & Transformer analysis on raw text
 * @param {string} articleText 
 * @param {string} summaryLength 
 * @returns {Promise<Object>}
 */
export const analyzeArticle = async (articleText, summaryLength = 'medium') => {
  try {
    const response = await aiClient.post('/api/analyze', {
      article_text: articleText,
      summary_length: summaryLength
    });

    const data = response.data;
    return {
      processedText: data.processed_text,
      summary: data.summary,
      sentiment: data.sentiment,
      keywords: data.keywords,
      entities: data.entities,
      originalWordCount: data.original_word_count,
      summaryWordCount: data.summary_word_count,
      compressionRatio: data.compression_ratio
    };
  } catch (error) {
    const message = error.response?.data?.detail || error.message || 'Failed to analyze article text';
    const status = error.response?.status || 500;
    throw new ApiError(status, `AI service analysis error: ${message}`);
  }
};

/**
 * Ask context-aware questions against the indexed article vector store
 * @param {string} articleId 
 * @param {string} articleText 
 * @param {string} question 
 * @returns {Promise<{answer: string, sources: Array}>}
 */
export const askArticleQuestion = async (articleId, articleText, question) => {
  try {
    const response = await aiClient.post('/api/ask', {
      article_id: articleId.toString(),
      article_text: articleText,
      question: question
    });
    return {
      answer: response.data.answer,
      sources: response.data.sources
    };
  } catch (error) {
    const message = error.response?.data?.detail || error.message || 'Failed to answer question';
    const status = error.response?.status || 500;
    throw new ApiError(status, `AI service Q&A error: ${message}`);
  }
};
