import express from 'express';
import { getUserController, getUserDataController, loginController, logoutController, signupController } from '../controllers/auth.controller.js';
import protectRoute from '../middleware/protectRoute.js';
import cacheMiddleware from '../middleware/redisCache.js';

const router = express.Router();

router.get('/me', protectRoute, getUserController)
router.get('/userdata/:id', protectRoute, cacheMiddleware, getUserDataController)
router.post('/signup', signupController)
router.post('/login', loginController)
router.post('/logout', logoutController)

export default router