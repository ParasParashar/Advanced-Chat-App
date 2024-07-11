import express from 'express';
import { getMessageController, getUserforSidebar, sendMessageController } from '../controllers/messages.controller.js';
import protectRoute from '../middleware/protectRoute.js';
const router = express.Router();

router.get('/conversations', protectRoute, getUserforSidebar);
router.get('/:id', protectRoute, getMessageController);
router.post('/send/:id', protectRoute, sendMessageController);

export default router;