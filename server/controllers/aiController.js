import { 
  generateListingDetails, 
  suggestPrice, 
  parseSearchQuery, 
  moderateContent, 
  askCampusAssistant 
} from '../services/llmService.js';

// 1. GENERATE SMART LISTING DESCRIPTION
export const generateDescription = async (req, res) => {
  try {
    const { rawTitle, category, condition, bulletPoints, originalPrice } = req.body;
    if (!rawTitle) {
      return res.status(400).json({ message: 'Title or bullet point required.' });
    }

    const result = await generateListingDetails({
      rawTitle,
      category,
      condition,
      bulletPoints,
      originalPrice
    });

    return res.json(result);
  } catch (error) {
    console.error('AI generate-description error:', error);
    return res.status(500).json({ message: 'AI generation failed.' });
  }
};

// 2. AUTO PRICE SUGGESTION
export const suggestPriceHandler = async (req, res) => {
  try {
    const { title, category, condition, originalPrice, description } = req.body;
    const priceAnalysis = await suggestPrice({
      title,
      category,
      condition,
      originalPrice,
      description
    });

    return res.json(priceAnalysis);
  } catch (error) {
    console.error('AI suggest-price error:', error);
    return res.status(500).json({ message: 'Price suggestion failed.' });
  }
};

// 3. PARSE NATURAL LANGUAGE SEARCH QUERY
export const parseSearchQueryHandler = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: 'Search query string is required.' });
    }

    const parsedFilters = await parseSearchQuery(query);
    return res.json(parsedFilters);
  } catch (error) {
    console.error('AI parse-search error:', error);
    return res.status(500).json({ message: 'Search query parsing failed.' });
  }
};

// 4. CONTENT MODERATION CHECK
export const moderateHandler = async (req, res) => {
  try {
    const { title, description } = req.body;
    const moderationResult = await moderateContent({ title, description });
    return res.json(moderationResult);
  } catch (error) {
    return res.status(500).json({ message: 'Moderation check failed.' });
  }
};

// 5. CAMPUS ASSISTANT CHATBOT
export const chatHandler = async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'User message required.' });
    }

    const botReply = await askCampusAssistant(message, history);
    return res.json({ reply: botReply });
  } catch (error) {
    console.error('AI chat error:', error);
    return res.status(500).json({ message: 'AI chatbot error.' });
  }
};
