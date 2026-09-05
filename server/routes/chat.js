import express from 'express';
import { Conversation, Message } from '../models/Conversation.js';
import { inMemoryDb } from '../config/db.js';
import { verifyJWT } from '../middleware/auth.js';

const router = express.Router();

// 1. GET ALL CONVERSATIONS FOR LOGGED IN USER
router.get('/conversations', verifyJWT, async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    let convs = [];
    if (!inMemoryDb.isInMemory) {
      convs = await Conversation.find({ participants: currentUserId }).sort({ lastMessageAt: -1 });
    } else {
      convs = Array.from(inMemoryDb.conversations.values()).filter(c => 
        c.participants.includes(currentUserId)
      );
      convs.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
    }

    return res.json(convs);
  } catch (error) {
    console.error('Fetch conversations error:', error);
    return res.status(500).json({ message: 'Failed to retrieve conversations.' });
  }
});

// 2. GET OR START A CONVERSATION FOR A SPECIFIC LISTING & SELLER
router.post('/conversations/start', verifyJWT, async (req, res) => {
  try {
    const { sellerId, listingId, listingTitle } = req.body;
    const buyerId = req.user.userId;

    if (buyerId === sellerId) {
      return res.status(400).json({ message: 'You cannot initiate a chat with yourself.' });
    }

    let existing = null;
    if (!inMemoryDb.isInMemory) {
      existing = await Conversation.findOne({
        participants: { $all: [buyerId, sellerId] },
        listingId
      });
    } else {
      existing = Array.from(inMemoryDb.conversations.values()).find(c => 
        c.listingId === listingId && 
        c.participants.includes(buyerId) && 
        c.participants.includes(sellerId)
      );
    }

    if (existing) {
      return res.json(existing);
    }

    const newConv = {
      _id: 'conv_' + Date.now(),
      participants: [buyerId, sellerId],
      listingId,
      listingTitle: listingTitle || 'Listing Inquiry',
      lastMessageAt: new Date()
    };

    if (!inMemoryDb.isInMemory) {
      const created = await Conversation.create(newConv);
      newConv._id = created._id;
    } else {
      inMemoryDb.conversations.set(newConv._id, newConv);
    }

    return res.status(201).json(newConv);
  } catch (error) {
    console.error('Start conversation error:', error);
    return res.status(500).json({ message: 'Failed to create conversation.' });
  }
});

// 3. GET MESSAGES FOR A CONVERSATION
router.get('/conversations/:id/messages', verifyJWT, async (req, res) => {
  try {
    const convId = req.params.id;

    let msgs = [];
    if (!inMemoryDb.isInMemory) {
      msgs = await Message.find({ conversationId: convId }).sort({ createdAt: 1 });
    } else {
      msgs = Array.from(inMemoryDb.messages.values())
        .filter(m => m.conversationId === convId)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return res.json(msgs);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch messages.' });
  }
});

// 4. POST A NEW MESSAGE IN A CONVERSATION
router.post('/conversations/:id/messages', verifyJWT, async (req, res) => {
  try {
    const convId = req.params.id;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Message text cannot be empty.' });
    }

    const newMsg = {
      _id: 'msg_' + Date.now(),
      conversationId: convId,
      senderId: req.user.userId,
      senderName: req.user.name,
      text,
      createdAt: new Date()
    };

    if (!inMemoryDb.isInMemory) {
      await Message.create(newMsg);
      await Conversation.findByIdAndUpdate(convId, { lastMessageAt: new Date() });
    } else {
      inMemoryDb.messages.set(newMsg._id, newMsg);
      const conv = inMemoryDb.conversations.get(convId);
      if (conv) {
        conv.lastMessageAt = new Date();
        inMemoryDb.conversations.set(convId, conv);
      }
    }

    // Access Socket.io instance from app if attached
    const io = req.app.get('io');
    if (io) {
      io.to(convId).emit('newMessage', newMsg);
    }

    return res.status(201).json(newMsg);
  } catch (error) {
    console.error('Post message error:', error);
    return res.status(500).json({ message: 'Failed to send message.' });
  }
});

export default router;
