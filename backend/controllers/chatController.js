import asyncHandler from 'express-async-handler';
import Chat from '../models/chatModel.js';
import User from '../models/User.js';

const accessChat = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  if (!_id) {
    res.status(400);
    throw new Error('_id param not sent with request');
  }

  let chat = await Chat.findOne({
    users: { $all: [req.user._id, _id] },
  })
    .populate('users', '-password')
    .populate('latestMessage');

  if (chat) {
    res.status(200).json(chat);
  } else {
    const chatData = {
      chatName: 'sender',
      users: [req.user._id, _id],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findById(createdChat._id).populate('users', '-password');
      res.status(201).json(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error('Chat creation failed');
    }
  }
});
// @desc    Send a message to a chat
// @route   POST /api/chat/message

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

  chat.latestMessage = content;  // This assumes `content` is the message or message ID
  await chat.save();

  const updatedChat = await Chat.findById(chatId)
    .populate('users', '-password')
    .populate('latestMessage');

  res.status(201).json(updatedChat);
});

// @desc    Fetch all chats for a user
// @route   GET /api/chat/
// @access  Private
const fetchChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ users: { $in: [req.user._id] } })
    .populate('users', '-password')
    .populate('latestMessage')
    .sort({ updatedAt: -1 });

  res.status(200).json(chats);
});

export { accessChat, sendMessage, fetchChats };
