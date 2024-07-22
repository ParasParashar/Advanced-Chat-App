import express from 'express';
import { deleteChatsController, deleteConversationController, getMessageController, getUserConversations, getUserforSidebar, sendMessageController, updateMessageController } from '../controllers/messages.controller.js';
import protectRoute from '../middleware/protectRoute.js';
const router = express.Router();

router.get('/users', protectRoute, getUserforSidebar);
router.get('/conversations', protectRoute, getUserConversations);
router.get('/:id', protectRoute, getMessageController);
router.post('/send/:id', protectRoute, sendMessageController);
router.patch('/update/:id', protectRoute, updateMessageController);
router.delete('/conversation/:id', protectRoute, deleteConversationController);
router.delete('/conversation/chat/:id', protectRoute, deleteChatsController);


export default router;