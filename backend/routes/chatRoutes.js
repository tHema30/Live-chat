import express from 'express';
import { accessChat, sendMessage, fetchChats } from '../controllers/chatController.js';
import  protect  from '../middleware/authMiddleware.js';
const router = express.Router();

// Access or create chat
router.post('/access',protect, accessChat);

// Send message
router.post('/message',protect, sendMessage);

// Fetch all chats
router.get('/', protect,protect, fetchChats);

export default router;