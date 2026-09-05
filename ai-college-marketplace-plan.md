# AI-Powered College Marketplace — Project Plan (MERN Stack)

## 1. Project Overview

A platform where college students can buy/sell/exchange items (books, electronics, furniture, notes, hostel essentials), find roommates, and get AI-assisted help throughout — from writing listings to pricing suggestions to a shopping assistant chatbot.

**Core value prop:** Students trust it because it's college-verified (via college email), and AI removes friction (better listings, smarter search, fair pricing).

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React (Vite) + TailwindCSS | Fast dev, easy styling |
| State mgmt | Redux Toolkit / Zustand | Zustand if you want less boilerplate |
| Backend | Node.js + Express.js | REST API |
| Database | MongoDB (Atlas) + Mongoose | Flexible schema for listings |
| Auth | JWT (access + refresh tokens) | httpOnly cookies for refresh token |
| File storage | Cloudinary / AWS S3 | Product images, docs |
| Real-time | Socket.io | Chat between buyer/seller |
| LLM Integration | Anthropic Claude API (or OpenAI) | See section 6 |
| Payments (optional) | Razorpay/Stripe (test mode) | Or "meet & pay" only, no real payments — safer for a college project |
| Deployment | Vercel (frontend) + Render/Railway (backend) + MongoDB Atlas | Free tiers available |
| Search | MongoDB Atlas Search / Elasticsearch (optional) | For fuzzy/semantic search |

---

## 3. Core Features (MVP)

1. **Auth & Onboarding**
   - Sign up with college email (OTP/email verification)
   - Login/logout, JWT-based sessions
   - Profile (name, college, hostel/dept, avatar)

2. **Listings**
   - Create/edit/delete listing (title, description, price, category, images, condition)
   - Browse/search/filter listings (category, price range, college/campus)
   - Listing detail page

3. **Chat / Contact Seller**
   - Real-time chat (Socket.io) between buyer and seller
   - Notifications (new message, listing sold, etc.)

4. **User Dashboard**
   - My listings, my purchases/interests, saved/wishlist items

5. **Admin Panel**
   - Manage users, flagged listings, categories

### AI-Powered Features (what makes it "AI-powered")

- **Smart listing generator**: user uploads a photo + 2-3 bullet points → LLM writes a polished title & description
- **Auto price suggestion**: LLM/heuristic suggests a fair price based on category, condition, and similar past listings
- **AI search assistant**: natural language search ("cheap physics books under 300 near hostel 4") → parsed into structured filters
- **Chatbot assistant**: answers FAQs, guides users, can be embedded as a widget
- **Content moderation**: LLM flags inappropriate/prohibited listings (weapons, drugs, plagiarism services, etc.) before publishing
- **Image tagging/categorization**: auto-suggest category from uploaded image (via vision-capable LLM or a lightweight classifier)
- **Fraud/spam detection**: LLM scores listing text for scammy patterns

---

## 4. Database Schema (MongoDB)

**User**
```
{
  name, email (college domain verified), passwordHash,
  college, role: "student" | "admin",
  avatarUrl, isVerified,
  refreshTokens: [ { token, expiresAt } ],
  createdAt
}
```

**Listing**
```
{
  title, description, price, category, condition,
  images: [url], sellerId (ref User),
  status: "active" | "sold" | "flagged" | "removed",
  aiGenerated: { descriptionByAI: bool, suggestedPrice: number },
  moderationScore, location/hostel,
  createdAt
}
```

**Conversation / Message**
```
Conversation: { participants: [userId, userId], listingId, lastMessageAt }
Message: { conversationId, senderId, text, readAt, createdAt }
```

**Wishlist / SavedItems**
```
{ userId, listingId, createdAt }
```

---

## 5. JWT Authentication Design (important part)

- **Access token**: short-lived (15 min), sent in `Authorization: Bearer <token>` header, stored in memory (not localStorage — avoids XSS token theft).
- **Refresh token**: long-lived (7 days), stored in an **httpOnly, Secure, SameSite=Strict cookie**. Used only to hit `/auth/refresh` to get a new access token.
- **Flow:**
  1. Login → server issues access token (response body) + refresh token (httpOnly cookie)
  2. Frontend attaches access token to each API call
  3. On 401 → frontend calls `/auth/refresh` → server validates refresh token → issues new access token
  4. Logout → server invalidates refresh token (remove from DB / token blacklist)
- **Middleware**: `verifyJWT` on protected routes; `verifyAdmin` for admin routes
- Store refresh tokens (or their hashes) in DB per user so you can revoke on logout/password change
- Rate-limit auth routes (`express-rate-limit`) to prevent brute force
- Hash passwords with bcrypt (salt rounds ~10-12)

---

## 6. Where LLMs Plug In (concretely)

| Feature | How |
|---|---|
| Listing description generator | Backend route `/api/ai/generate-description` → sends bullet points to Claude API → returns polished text |
| Price suggestion | Prompt LLM with category + condition + comparable listings (fetched from DB) → returns a price range with reasoning |
| Natural language search | User query → LLM converts to structured JSON filters (category, priceMax, keywords) → used to build a Mongo query |
| Chatbot widget | Separate `/api/ai/chat` endpoint, maintains short conversation context, streams response |
| Moderation | On listing create, backend calls LLM with a moderation-style prompt → returns flag + reason → auto-hide if flagged, notify admin |
| Image → category | Send image (base64/URL) to a vision-capable model → returns suggested category/tags |

**Practical tip:** Keep your API key server-side only (never expose in frontend). Add caching (e.g., Redis) for repeated AI calls like price suggestions to control cost.

---

## 7. API Route Structure

```
/api/auth
  POST   /register
  POST   /verify-otp
  POST   /login
  POST   /refresh
  POST   /logout

/api/users
  GET    /me
  PUT    /me
  GET    /:id

/api/listings
  GET    /              (search/filter/paginate)
  POST   /               (auth required)
  GET    /:id
  PUT    /:id            (owner only)
  DELETE /:id            (owner only)

/api/ai
  POST   /generate-description
  POST   /suggest-price
  POST   /parse-search-query
  POST   /moderate
  POST   /chat

/api/chat
  GET    /conversations
  GET    /conversations/:id/messages
  POST   /conversations/:id/messages   (also emits via Socket.io)

/api/admin
  GET    /flagged-listings
  PUT    /listings/:id/status
```

---

## 8. Suggested Folder Structure

```
college-marketplace/
├── client/                # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/          (redux/zustand)
│   │   ├── hooks/
│   │   ├── api/            (axios instance + interceptors for JWT refresh)
│   │   └── utils/
├── server/
│   ├── config/             (db.js, cloudinary.js)
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/          (auth.js, errorHandler.js, rateLimiter.js)
│   ├── services/
│   │   └── llmService.js    (all AI prompt logic isolated here)
│   ├── sockets/
│   └── server.js
└── README.md
```

---

## 9. Build Phases (Suggested Timeline)

**Phase 1 — Foundation (Week 1-2)**
- Project setup, DB schema, JWT auth (register/login/refresh/logout)
- Basic protected routes, middleware

**Phase 2 — Core Marketplace (Week 2-4)**
- CRUD for listings, image upload (Cloudinary), search/filter/pagination
- User dashboard, wishlist

**Phase 3 — Real-time Chat (Week 4-5)**
- Socket.io setup, conversations, message persistence, notifications

**Phase 4 — AI Integration (Week 5-7)**
- LLM service layer, description generator, price suggestion
- Natural language search parsing, moderation pipeline, chatbot widget

**Phase 5 — Admin + Polish (Week 7-8)**
- Admin panel, flagged content review
- UI polish, loading states, error handling, responsive design

**Phase 6 — Deployment & Testing (Week 8-9)**
- Deploy (Vercel + Render/Railway + Atlas)
- Write tests (Jest/Supertest for backend, basic RTL for frontend)
- Load test AI endpoints, add caching/rate-limiting on them

---

## 10. Security & Best Practices Checklist

- [ ] Passwords hashed with bcrypt
- [ ] Access token short-lived, refresh token httpOnly cookie
- [ ] Input validation (Zod/Joi) on every route
- [ ] Rate limiting on auth + AI endpoints (AI calls cost money)
- [ ] Sanitize user input (prevent NoSQL injection, XSS)
- [ ] CORS configured to only allow your frontend origin
- [ ] Helmet.js for HTTP headers
- [ ] Environment variables for all secrets (never commit `.env`)
- [ ] File upload validation (type/size limits) before sending to Cloudinary
- [ ] LLM API key stored server-side only; never sent to client
- [ ] Log/monitor AI usage to avoid runaway costs

---

## 11. Stretch Goals (if time permits)

- Roommate finder with AI-based compatibility matching
- "Notes marketplace" with plagiarism-check via LLM before approval
- Recommendation engine ("students who bought this also viewed...")
- Voice-based search using speech-to-text + LLM parsing
- Semantic/vector search (embeddings + MongoDB Atlas Vector Search) for "find similar items"

---

### Suggested first coding step
Start with Phase 1: set up the Express server, MongoDB connection, User model, and the full JWT auth flow (register → login → protected route → refresh → logout) before touching anything else. Everything else depends on this being solid.
