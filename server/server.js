import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import aiRoutes from './routes/ai.js';
import chatRoutes from './routes/chat.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST']
  }
});

app.set('io', io);

// Security & Middleware
app.use(helmet({
  contentSecurityPolicy: false // disabled for inline preview flexibility
}));

app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Auth & AI Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many authentication attempts. Please try again later.' }
});

const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: { message: 'AI request limit reached. Please wait a minute.' }
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'CampusExchange Backend API',
    timestamp: new Date().toISOString()
  });
});

// Socket.io Connection Logic
io.on('connection', (socket) => {
  socket.on('joinRoom', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('sendMessage', (data) => {
    io.to(data.conversationId).emit('newMessage', data);
  });

  socket.on('disconnect', () => {
    // Client disconnected
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start Server & Connect Database
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n Error: Port ${PORT} is already in use by another process.`);
    console.error(` Close the process running on port ${PORT} or change PORT in server/.env\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

server.listen(PORT || 3000, async () => {
  await connectDB();

  console.log(` CampusExchange API Server running on port ${PORT}`);
  console.log(` Target Client URL: ${CLIENT_URL}`);

});
