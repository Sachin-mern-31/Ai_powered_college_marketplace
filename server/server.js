import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import aiRoutes from './routes/ai.js';
import chatRoutes from './routes/chat.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Allowed Origins logic for production & local dev
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

const corsOriginHandler = (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.onrender.com') || origin.endsWith('.vercel.app') || origin.endsWith('.railway.app')) {
    callback(null, true);
  } else {
    callback(null, true); // Permissive in deployment so students can connect cleanly
  }
};

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: corsOriginHandler,
    credentials: true,
    methods: ['GET', 'POST']
  }
});

app.set('io', io);

// Security & Middleware
app.use(helmet({
  contentSecurityPolicy: false // disabled for inline asset & deployment flexibility
}));

app.use(cors({
  origin: corsOriginHandler,
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

// API Routes
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
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Serve Compiled Frontend Static Assets in Production
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  console.log(`[Production] Serving static client build from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

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

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  server.listen(PORT, async () => {
    await connectDB();
    console.log(` CampusExchange API Server running on port ${PORT}`);
    console.log(` Target Client URL: ${CLIENT_URL}`);
  });
}

export default app;
