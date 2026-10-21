import { Router } from 'express';
import { registerUser, loginUser, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateRegister, validateLogin } from '../middleware/validation.middleware.js';

const router = Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/me', protect, getMe);

export default router;
