import express from 'express';
import { accessChat, sendMessage, fetchChats } from '../controllers/chatController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to access or create a chat
router.post('/access',protect, accessChat);

// Route to send a message
router.post('/message', protect, sendMessage);

// Route to fetch all chats for the user
router.get('/', protect, fetchChats);

export default router;
