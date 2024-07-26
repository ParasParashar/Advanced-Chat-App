import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { createGroupController, createGroupMessageController, getGroupDataController, getGroupInfo, getGroupMessageController, groupMemberController, groupMessageUpdateController } from '../controllers/groupMessage.controller.js';
const router = express.Router();

router.get('/groupdata/:id', protectRoute, getGroupDataController)
router.get('/message/:id', protectRoute, getGroupMessageController)
router.get('/info/:id', protectRoute, getGroupInfo)
router.patch('/info/update', protectRoute, groupMemberController);
router.patch('/message/update', protectRoute, groupMessageUpdateController);
router.post('/create', protectRoute, createGroupController)
router.post('/message/send/:id', protectRoute, createGroupMessageController)


export default router;