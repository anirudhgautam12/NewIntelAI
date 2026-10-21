import { Router } from 'express';
import { askQuestion, getChatHistory } from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateAsk } from '../middleware/validation.middleware.js';

const router = Router();

router.post('/:id/ask', protect, validateAsk, askQuestion);
router.get('/:id/chat', protect, getChatHistory);

export default router;
