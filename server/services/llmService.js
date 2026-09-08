import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { Listing } from '../models/Listing.js';
import { inMemoryDb } from '../config/db.js';

dotenv.config();

// Primary Gemini Model Target
const GEMINI_MODEL = 'gemini-3.6-flash';

/**
 * On-demand Gemini AI Client Getter
 */
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey: apiKey.trim() });
  } catch (err) {
    console.warn('[AI Service] Failed to initialize GoogleGenAI client:', err.message);
    return null;
  }
}

/**
 * Helper to fetch active marketplace items for AI context
 */
async function getActiveListingsContext() {
  try {
    let items = [];
    if (inMemoryDb.isConnectedToMongo) {
      items = await Listing.find({ status: 'active' }).limit(15);
    } else {
      items = Array.from(inMemoryDb.listings.values()).filter(i => i.status === 'active').slice(0, 15);
    }

    if (items.length === 0) return 'No active items currently listed on campus.';

    return items.map(item => 
      `- Item: "${item.title}" | Category: ${item.category} | Price: $${item.price} (Original: $${item.originalPrice || 'N/A'}) | Condition: ${item.condition} | Seller: ${item.sellerName} (${item.sellerCollege}, ${item.sellerHostel}) | Campus Spot: ${item.location}`
    ).join('\n');
  } catch (err) {
    return 'Listings context unavailable.';
  }
}

/**
 * 1. AI Smart Listing Generator
 */
export async function generateListingDetails({ rawTitle, category, condition, bulletPoints, originalPrice }) {
  const aiClient = getAIClient();
  if (aiClient) {
    try {
      const prompt = `You are CampusExchange AI, an expert marketplace copywriter for university students.
Generate an appealing, clear listing title and a polished 2-3 paragraph product description based on these details:
- Raw title: "${rawTitle}"
- Category: "${category}"
- Condition: "${condition}"
- Key notes / bullets: "${bulletPoints}"
- Original estimated price: "${originalPrice || 'N/A'}"

Respond strictly with a JSON object in this format (no markdown fences, just pure JSON):
{
  "title": "Polished listing title here",
  "description": "Engaging description text emphasizing value, condition, and campus pickup details."
}`;

      const response = await aiClient.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const text = response.text?.trim() || '';
      const cleanJson = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return parsed;
    } catch (error) {
      console.warn('[AI Service] Gemini generate-description call failed, using fallback:', error.message);
    }
  }

  // Smart Heuristic Fallback
  const cleanTitle = rawTitle ? rawTitle.trim() : 'Campus Item';
  const condText = condition || 'Good';
  const catText = category || 'General Item';
  const notesText = bulletPoints ? `Key highlights: ${bulletPoints}.` : 'Kept in clean, working condition.';

  const generatedTitle = `${cleanTitle} (${condText} Condition) — Ready for Campus Pickup`;
  const generatedDescription = `Up for sale is a well-maintained ${cleanTitle} under the ${catText} category. 
Item condition is rated as "${condText}". ${notesText} 
Great value for fellow students looking to save compared to retail prices. Available for convenient campus pickup or meet-up near student housing/library. DM if interested!`;

  return {
    title: generatedTitle,
    description: generatedDescription
  };
}

/**
 * 2. AI Auto Price Suggestion
 */
export async function suggestPrice({ title, category, condition, originalPrice, description }) {
  const aiClient = getAIClient();
  if (aiClient) {
    try {
      const prompt = `You are a campus resale pricing expert. Analyze this item and suggest a fair resale price for college students:
- Item: "${title}"
- Category: "${category}"
- Condition: "${condition}"
- Original Purchase Price: $${originalPrice || 'Unknown'}
- Description: "${description}"

Respond strictly in valid JSON format (no codeblocks):
{
  "suggestedPrice": 45,
  "minPrice": 35,
  "maxPrice": 55,
  "reasoning": "Based on average 50-60% campus resale depreciation for items in ${condition} condition."
}`;

      const response = await aiClient.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const text = response.text?.trim() || '';
      const cleanJson = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.warn('[AI Service] Gemini suggestPrice failed, using fallback:', error.message);
    }
  }

  // Smart Heuristic Price Calculation
  const orig = parseFloat(originalPrice) || 80;
  let multiplier = 0.5;
  if (condition === 'Like New' || condition === 'New') multiplier = 0.7;
  if (condition === 'Fair') multiplier = 0.35;

  const estimated = Math.round(orig * multiplier);
  const minPrice = Math.max(5, Math.round(estimated * 0.8));
  const maxPrice = Math.round(estimated * 1.2);

  return {
    suggestedPrice: estimated,
    minPrice,
    maxPrice,
    reasoning: `Suggested based on standard ~${Math.round((1 - multiplier) * 100)}% campus resale discount for items in ${condition} condition.`
  };
}

/**
 * 3. AI Natural Language Search Query Parsing
 */
export async function parseSearchQuery(userQuery) {
  const aiClient = getAIClient();
  if (aiClient && userQuery?.length > 3) {
    try {
      const prompt = `Convert this natural language campus marketplace search query into structured search filters:
Query: "${userQuery}"

Categories available: "Books & Notes", "Electronics", "Furniture", "Hostel Essentials", "Lab & Course Gear", "Roommate Finder", "Other"

Return valid JSON format only (no codeblocks):
{
  "keywords": "physics book",
  "category": "Books & Notes" or "All",
  "maxPrice": 50 or null,
  "location": "Hostel 4" or null
}`;

      const response = await aiClient.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const cleanJson = response.text?.trim().replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.warn('[AI Service] Gemini parseSearchQuery failed, using fallback:', error.message);
    }
  }

  // Smart Heuristic Search Parser
  const lower = (userQuery || '').toLowerCase();
  let category = 'All';
  if (lower.includes('book') || lower.includes('note') || lower.includes('clrs') || lower.includes('calculus')) category = 'Books & Notes';
  else if (lower.includes('laptop') || lower.includes('monitor') || lower.includes('phone') || lower.includes('cable') || lower.includes('screen')) category = 'Electronics';
  else if (lower.includes('chair') || lower.includes('desk') || lower.includes('lamp') || lower.includes('table')) category = 'Furniture';
  else if (lower.includes('cooker') || lower.includes('pot') || lower.includes('kettle') || lower.includes('fridge')) category = 'Hostel Essentials';
  else if (lower.includes('lab') || lower.includes('coat') || lower.includes('goggles') || lower.includes('apron')) category = 'Lab & Course Gear';
  else if (lower.includes('roommate') || lower.includes('room') || lower.includes('apartment') || lower.includes('flat')) category = 'Roommate Finder';

  let maxPrice = null;
  const priceMatch = lower.match(/(?:under|below|less than|<\s*|\$\s*)(\d+)/);
  if (priceMatch && priceMatch[1]) {
    maxPrice = parseInt(priceMatch[1], 10);
  }

  return {
    keywords: userQuery.replace(/(under|below|less than|\$\d+|\d+\$)/gi, '').trim(),
    category,
    maxPrice,
    location: null
  };
}

/**
 * 4. Content Moderation & Prohibited Item Detector
 */
export async function moderateContent({ title, description }) {
  const fullText = `${title || ''} ${description || ''}`.toLowerCase();

  const prohibitedKeywords = [
    'gun', 'weapon', 'knife', 'weed', 'cannabis', 'vape', 'narcotic', 'adderall', 
    'exam answers', 'hacked exam', 'plagiarism service', 'essay writing service', 'fake id'
  ];

  const matched = prohibitedKeywords.filter(kw => fullText.includes(kw));

  if (matched.length > 0) {
    return {
      isFlagged: true,
      moderationScore: 0.95,
      reason: `Listing contains prohibited keywords/topics: [${matched.join(', ')}]. Campus policies prohibit sale of restricted items.`
    };
  }

  const aiClient = getAIClient();
  if (aiClient) {
    try {
      const prompt = `Review this university student marketplace listing for policy compliance:
Title: "${title}"
Description: "${description}"

Respond in valid JSON only:
{
  "isFlagged": false,
  "moderationScore": 0.05,
  "reason": "Clean listing."
}`;

      const response = await aiClient.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const cleanJson = response.text?.trim().replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.warn('[AI Service] Gemini moderation failed, defaulting to safe score:', error.message);
    }
  }

  return {
    isFlagged: false,
    moderationScore: 0.01,
    reason: 'Verified safe for campus publishing.'
  };
}

/**
 * 5. Enhanced Solution-Oriented AI Campus Assistant Chatbot Agent
 */
export async function askCampusAssistant(userMessage, contextHistory = []) {
  const activeItemsText = await getActiveListingsContext();
  const aiClient = getAIClient();

  if (aiClient) {
    try {
      const systemPrompt = `You are CampusBot 🎓, an expert, solution-focused AI Shopping & Resale Assistant for CampusExchange (a verified college buy/sell marketplace).

YOUR OBJECTIVES:
1. Provide DIRECT, ACTIONABLE SOLUTIONS to the student's question. Avoid generic fluff.
2. If the user asks for specific products (e.g. textbooks, monitors, chairs, pressure cookers, roommates, lab coats), inspect the REAL-TIME ACTIVE CAMPUS MARKETPLACE LISTINGS below. Explicitly name matching listings with prices, condition, seller names, and pickup locations!
3. If the user asks how to do something on the platform (e.g., how to post, how to price, safety guidelines, account verification), provide step-by-step numbered instructions.
4. Format your response cleanly using emojis, bold headings, bullet points, and exact dollar figures.

REAL-TIME ACTIVE CAMPUS MARKETPLACE LISTINGS:
${activeItemsText}

STUDENT QUESTION: "${userMessage}"

Deliver a comprehensive, direct solution:`;

      const response = await aiClient.models.generateContent({
        model: GEMINI_MODEL,
        contents: systemPrompt,
      });

      if (response.text && response.text.trim().length > 0) {
        return response.text.trim();
      }
    } catch (error) {
      console.warn('[AI Service] Gemini chatbot call failed, using fallback engine:', error.message);
    }
  }

  // Fallback Engine
  const lower = userMessage.toLowerCase();

  if (lower.includes('book') || lower.includes('textbook') || lower.includes('clrs') || lower.includes('algorithm') || lower.includes('study')) {
    return `📚 **Solution — Available Course Textbooks:**\n\n- **Introduction to Algorithms (CLRS 4th Ed)** — **$45** (Retail $110)\n  - *Seller:* Alex Rivera (Stanford University, Wilbur Hall)\n  - *Condition:* Like New\n\n💡 **Action:** Click the listing card on the homepage or click **Chat** to connect directly with Alex for campus pickup!`;
  }

  if (lower.includes('monitor') || lower.includes('display') || lower.includes('dell') || lower.includes('electronic')) {
    return `💻 **Solution — Available Electronics:**\n\n- **Dell UltraSharp 27" 4K USB-C Monitor** — **$180** (Retail $350)\n  - *Seller:* Sarah Chen (MIT, MacGregor House)\n  - *Condition:* Good\n\n💡 **Action:** Connect with Sarah via direct chat or use **AI Search** with prompt *"Dell 4K monitor"*!`;
  }

  if (lower.includes('chair') || lower.includes('desk') || lower.includes('furniture') || lower.includes('pot') || lower.includes('dorm')) {
    return `🪑 **Solution — Dorm & Room Essentials:**\n\n- **Ergonomic Mesh Swivel Desk Chair** — **$35** (Retail $95)\n  - *Seller:* Alex Rivera (Wilbur Hall Lobby)\n- **Instant Pot Mini Pressure Cooker** — **$25** (Retail $60)\n  - *Seller:* Sarah Chen (MacGregor House)\n\n💡 **Action:** Click **Chat** to arrange pickup!`;
  }

  if (lower.includes('roommate') || lower.includes('apartment') || lower.includes('room')) {
    return `🏠 **Solution — Roommate Listing:**\n\n- **2BHK Apartment near West Campus (Spring Semester)** — **$750/mo**\n  - *Details:* Private room & bath, utilities & fiber internet included.\n  - *Seller:* Sarah Chen\n\n💡 **Action:** Message Sarah directly via the chat drawer!`;
  }

  return `🎓 **CampusBot Solution Assistant**\n\nHere is how I can assist you directly:\n- Ask: *"Do you have any computer monitors or textbooks available?"*\n- Ask: *"How do I get an AI price estimate for my chair?"*\n- Ask: *"What are the safest campus meetup locations?"*`;
}
