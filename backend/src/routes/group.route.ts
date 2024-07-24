import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { createGroupController, createGroupMessageController, getGroupMessageController } from '../controllers/groupMessage.controller.js';
const router = express.Router();

router.post('/create', protectRoute, createGroupController)
router.get('/message/:id', protectRoute, getGroupMessageController)
router.post('/message/send/:id', protectRoute, createGroupMessageController)


export default router;