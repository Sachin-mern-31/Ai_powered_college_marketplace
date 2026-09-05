import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{ type: String, required: true }],
  listingId: { type: String, required: true },
  listingTitle: { type: String },
  lastMessageAt: { type: Date, default: Date.now }
});

export const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);

const messageSchema = new mongoose.Schema({
  conversationId: { type: String, required: true },
  senderId: { type: String, required: true },
  senderName: { type: String },
  text: { type: String, required: true },
  readAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
