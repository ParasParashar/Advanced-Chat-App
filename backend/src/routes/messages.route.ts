import express from 'express';
import { getMessageController, getUserConversations, getUserforSidebar, sendMessageController } from '../controllers/messages.controller.js';
import protectRoute from '../middleware/protectRoute.js';
const router = express.Router();

router.get('/users', protectRoute, getUserforSidebar);
router.get('/conversations', protectRoute, getUserConversations);
router.get('/:id', protectRoute, getMessageController);
router.post('/send/:id', protectRoute, sendMessageController);

export default router;