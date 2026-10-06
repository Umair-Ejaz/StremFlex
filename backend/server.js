import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';

dotenv.config();

connectDB();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Attach io instance to req object so controllers can emit real-time events
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json());

// Apply global rate limiting to all API routes
app.use('/api', apiLimiter);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io connection event listeners
io.on('connection', (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  // User joins a video-specific room
  socket.on('join_video', (videoId) => {
    socket.join(videoId);
    console.log(`User ${socket.id} joined video room: ${videoId}`);
  });

  // User leaves a video-specific room
  socket.on('leave_video', (videoId) => {
    socket.leave(videoId);
    console.log(`User ${socket.id} left video room: ${videoId}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});