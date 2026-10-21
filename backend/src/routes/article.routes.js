import { Router } from 'express';
import { analyzeArticleController, getArticles, getArticleById, deleteArticle } from '../controllers/article.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateAnalyze } from '../middleware/validation.middleware.js';

const router = Router();

router.post('/analyze', protect, validateAnalyze, analyzeArticleController);
router.get('/', protect, getArticles);
router.get('/:id', protect, getArticleById);
router.delete('/:id', protect, deleteArticle);

export default router;
