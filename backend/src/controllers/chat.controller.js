import ArticleAnalysis from '../models/ArticleAnalysis.js';
import ChatMessage from '../models/ChatMessage.js';
import { askArticleQuestion } from '../services/ai.service.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Ask a question about a specific analyzed article (RAG Q&A)
 * Route: POST /api/articles/:id/ask
 */
export const askQuestion = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const articleId = req.params.id;
  const { question } = req.body;

  // 1. Locate the article and check user ownership
  const article = await ArticleAnalysis.findOne({ _id: articleId, userId });
  if (!article) {
    throw new ApiError(404, 'Article not found or access denied');
  }

  // 2. Ensure RAG is only enabled for successfully analyzed articles
  if (article.status !== 'COMPLETED') {
    throw new ApiError(400, `Cannot ask questions on this article. Analysis status is ${article.status}`);
  }

  // 3. Request answer from FastAPI service (RAG index/lookup pipeline)
  const qaResult = await askArticleQuestion(article._id, article.originalText, question);

  // 4. Record interaction in database chat history
  const chatMessage = await ChatMessage.create({
    userId,
    articleId: article._id,
    question,
    answer: qaResult.answer,
    sources: qaResult.sources
  });

  res.status(200).json(new ApiResponse(200, chatMessage, 'Question processed and answered successfully'));
});

/**
 * Get full chat history for an article
 * Route: GET /api/articles/:id/chat
 */
export const getChatHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const articleId = req.params.id;

  // Verify ownership of the article
  const article = await ArticleAnalysis.findOne({ _id: articleId, userId });
  if (!article) {
    throw new ApiError(404, 'Article not found or access denied');
  }

  // Fetch conversations sorted oldest to newest for consistent chat timeline view
  const chatHistory = await ChatMessage.find({ articleId: article._id, userId }).sort({ createdAt: 1 });

  res.status(200).json(new ApiResponse(200, chatHistory, 'Chat history retrieved successfully'));
});
