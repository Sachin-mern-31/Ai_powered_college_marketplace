import express from 'express';
import { 
  getConversations, 
  startConversation, 
  getMessages, 
  postMessage 
} from '../controllers/chatController.js';
import { verifyJWT } from '../middlewares/auth.js';

const router = express.Router();

// 1. GET ALL CONVERSATIONS FOR LOGGED IN USER
router.get('/conversations', verifyJWT, getConversations);

// 2. GET OR START A CONVERSATION FOR A SPECIFIC LISTING & SELLER
router.post('/conversations/start', verifyJWT, startConversation);

// 3. GET MESSAGES FOR A CONVERSATION
router.get('/conversations/:id/messages', verifyJWT, getMessages);

// 4. POST A NEW MESSAGE IN A CONVERSATION
router.post('/conversations/:id/messages', verifyJWT, postMessage);

export default router;
