// Import necessary modules
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import http from 'http'; // Required for socket.io server
import authRoutes from '../backend/routes/authRoutes.js';
import chatRoutes from '../backend/routes/chatRoutes.js';
import { notFound, errorHandler } from '../backend/middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
  
  // Start server after successful DB connection
  const server = http.createServer(app);
  
  // Socket.io setup
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Frontend URL
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for 'chat message' events
    socket.on('chat message', (msg) => {
      console.log('Message received: ' + msg);
      io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
})
.catch((error) => {
  console.error('Database connection failed:', error.message);
  process.exit(1);
});
