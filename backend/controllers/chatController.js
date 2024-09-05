import asyncHandler from 'express-async-handler';
import Chat from '../models/chatModel.js';
import User from '../models/User.js';


// @route   POST /api/chat/
// @access  Private
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error('UserId param not sent with request');
  }

  let chat = await Chat.findOne({
    participants: { $all: [req.user._id, userId] },
  }).populate('participants', '-password').populate('messages.sender', '-password');

  if (chat) {
    res.send(chat);
  } else {
    chat = await Chat.create({
      participants: [req.user._id, userId],
    });

    const fullChat = await Chat.findById(chat._id).populate('participants', '-password');

    res.status(201).json(fullChat);
  }
});

// @desc    Send message
// @route   POST /api/chat/message
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;

  if (!chatId || !content) {
    res.status(400);
    throw new Error('chatId and content are required');
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  const message = {
    sender: req.user._id,
    content: content,
  };

  chat.messages.push(message);
  await chat.save();

  const updatedChat = await Chat.findById(chatId)
    .populate('participants', '-password')
    .populate('messages.sender', '-password');

  res.status(201).json(updatedChat);
});

// @desc    Fetch all chats for a user
// @route   GET /api/chat/
// @access  Private
const fetchChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ participants: { $in: [req.user._id] } })
    .populate('participants', '-password')
    .populate('messages.sender', '-password')
    .sort({ updatedAt: -1 });

  res.status(200).json(chats);
});

export { accessChat,
       sendMessage,
        fetchChats
   };