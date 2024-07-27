import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { addGroupMemberController, createGroupController, createGroupMessageController, deleteGroupController, deleteGroupMessagesController, getGroupDataController, getGroupInfo, getGroupMessageController, groupMemberController, groupMessageUpdateController, leaveGroupController } from '../controllers/groupMessage.controller.js';
const router = express.Router();

router.get('/groupdata/:id', protectRoute, getGroupDataController)
router.get('/message/:id', protectRoute, getGroupMessageController)
router.get('/info/:id', protectRoute, getGroupInfo);
router.patch('/info/update', protectRoute, groupMemberController);
router.patch('/message/update', protectRoute, groupMessageUpdateController);
router.post('/create', protectRoute, createGroupController);
router.post('/addmembers', protectRoute, addGroupMemberController);
router.post('/message/send/:id', protectRoute, createGroupMessageController)
router.post('/leave', protectRoute, leaveGroupController);
router.delete('/delete/:id', protectRoute, deleteGroupController);
router.delete('/messagesdelete/:id', protectRoute, deleteGroupMessagesController);


export default router;