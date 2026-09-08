import express from 'express';
import { 
  generateDescription, 
  suggestPriceHandler, 
  parseSearchQueryHandler, 
  moderateHandler, 
  chatHandler 
} from '../controllers/aiController.js';

const router = express.Router();

// 1. GENERATE SMART LISTING DESCRIPTION
router.post('/generate-description', generateDescription);

// 2. AUTO PRICE SUGGESTION
router.post('/suggest-price', suggestPriceHandler);

// 3. PARSE NATURAL LANGUAGE SEARCH QUERY
router.post('/parse-search-query', parseSearchQueryHandler);

// 4. CONTENT MODERATION CHECK
router.post('/moderate', moderateHandler);

// 5. CAMPUS ASSISTANT CHATBOT
router.post('/chat', chatHandler);

export default router;
