import app from '../server/server.js';
import { connectDB } from '../server/config/db.js';

// Connect to MongoDB or In-Memory Database on Vercel Serverless invocation
connectDB().catch((err) => {
  console.warn('[Vercel Serverless DB Warning]', err.message);
});

export default app;
