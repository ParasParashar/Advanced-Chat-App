import express from 'express';
import { getUserController, loginController, logoutController, signupController } from '../controllers/auth.controller.js';
import protectRoute from '../middleware/protectRoute.js';
const router = express.Router();
router.get('/me', protectRoute, getUserController);
router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/logout', logoutController);
export default router;
