import ArticleAnalysis from '../models/ArticleAnalysis.js';
import ChatMessage from '../models/ChatMessage.js';
import { extractArticle, analyzeArticle } from '../services/ai.service.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Extract and analyze article from text or URL
 * Route: POST /api/articles/analyze
 */
export const analyzeArticleController = asyncHandler(async (req, res, next) => {
  const { inputType, articleText, articleUrl, summaryLength = 'medium' } = req.body;
  const userId = req.user._id;

  let title = 'Untitled Article';
  let textToAnalyze = '';

  // 1. Resolve input source: url extraction vs raw text
  if (inputType === 'url') {
    try {
      const extracted = await extractArticle(articleUrl);
      textToAnalyze = extracted.articleText;
      if (extracted.title) {
        title = extracted.title;
      }
    } catch (err) {
      return next(new ApiError(err.statusCode || 500, `Article extraction failed: ${err.message}`));
    }
  } else {
    textToAnalyze = articleText;
    // Set a neat preview title from the first 5 words
    title = articleText.trim().split(/\s+/).slice(0, 5).join(' ') + '...';
  }

  // 2. Initialize analysis record in database with PROCESSING status
  const analysisDoc = await ArticleAnalysis.create({
    userId,
    inputType,
    articleUrl: inputType === 'url' ? articleUrl : undefined,
    title,
    originalText: textToAnalyze,
    originalWordCount: textToAnalyze.trim().split(/\s+/).filter(Boolean).length,
    status: 'PROCESSING'
  });

  // 3. Process analysis inside a try-catch to handle internal failures cleanly
  try {
    const analysisResults = await analyzeArticle(textToAnalyze, summaryLength);

    // Map FastAPI response variables to Node.js model properties
    analysisDoc.processedText = analysisResults.processedText;
    analysisDoc.summary = analysisResults.summary;
    analysisDoc.sentiment = analysisResults.sentiment;
    analysisDoc.keywords = analysisResults.keywords;
    analysisDoc.entities = analysisResults.entities;
    analysisDoc.originalWordCount = analysisResults.originalWordCount;
    analysisDoc.summaryWordCount = analysisResults.summaryWordCount;
    analysisDoc.compressionRatio = analysisResults.compressionRatio;
    analysisDoc.status = 'COMPLETED';

    await analysisDoc.save();

    return res.status(200).json(new ApiResponse(200, analysisDoc, 'Article analyzed successfully'));
  } catch (error) {
    // Flag document as failed and store error details
    analysisDoc.status = 'FAILED';
    analysisDoc.errorMessage = error.message || 'AI Microservice analysis failed';
    await analysisDoc.save();

    return next(new ApiError(error.statusCode || 500, `Article analysis processing failed: ${error.message}`));
  }
});

/**
 * Get current user's articles (paginated)
 * Route: GET /api/articles
 */
export const getArticles = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 10;
  if (limit > 50) limit = 50; // Cap limit at 50

  const skip = (page - 1) * limit;

  // Filter criteria
  const query = { userId };
  if (req.query.sentiment) {
    query['sentiment.label'] = req.query.sentiment.toUpperCase();
  }

  // Fetch articles, excluding long texts for history lists, sorted newest first
  const articles = await ArticleAnalysis.find(query)
    .select('-originalText -processedText')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await ArticleAnalysis.countDocuments(query);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        articles,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      },
      'Articles list retrieved successfully'
    )
  );
});

/**
 * Get single article analysis details by ID
 * Route: GET /api/articles/:id
 */
export const getArticleById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const articleId = req.params.id;

  const article = await ArticleAnalysis.findOne({ _id: articleId, userId });
  if (!article) {
    throw new ApiError(404, 'Article not found or access denied');
  }

  res.status(200).json(new ApiResponse(200, article, 'Article details retrieved successfully'));
});

/**
 * Delete single article and its associated chat history
 * Route: DELETE /api/articles/:id
 */
export const deleteArticle = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const articleId = req.params.id;

  const article = await ArticleAnalysis.findOne({ _id: articleId, userId });
  if (!article) {
    throw new ApiError(404, 'Article not found or access denied');
  }

  // Delete related chat history
  await ChatMessage.deleteMany({ articleId, userId });

  // Delete actual article
  await ArticleAnalysis.deleteOne({ _id: articleId, userId });

  res.status(200).json(new ApiResponse(200, null, 'Article and related chat history deleted successfully'));
});
