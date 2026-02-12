# Flowbase - AI-Powered LinkedIn Growth Operating System

Production-ready SaaS MVP for LinkedIn creators. Analyze your content with AI, get a growth score, and receive a personalized 7-day growth plan.

## Tech Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Backend   | Node.js + Express                   |
| Database  | PostgreSQL + Prisma ORM             |
| AI        | Google Gemini 1.5 Flash             |
| Frontend  | React (Vite) + Tailwind CSS         |
| Auth      | LinkedIn OAuth 2.0 + JWT            |

## Project Structure

```
flowbase/
├── server/                    # Backend API
│   ├── controllers/           # Request/response handlers
│   ├── routes/                # Route definitions
│   ├── services/              # Business logic
│   │   ├── geminiService.js   # AI analysis & plans
│   │   ├── linkedinService.js # LinkedIn OAuth
│   │   ├── growthScoreService.js
│   │   └── tokenService.js
│   ├── models/                # Prisma client
│   ├── middleware/            # Auth, errors, 404
│   ├── utils/                 # Config, logger, helpers
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   └── app.js                 # Entry point
│
├── client/                    # Frontend React app
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # Auth state management
│   │   ├── lib/               # API client
│   │   └── pages/             # Page components
│   └── index.html
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- LinkedIn Developer App ([create one](https://www.linkedin.com/developers/apps))
- Google AI Studio API Key ([get one](https://aistudio.google.com/apikey))

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd flowbase

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
```

Edit `.env` with your actual credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/flowbase"
JWT_SECRET=a-long-random-secret-string
LINKEDIN_CLIENT_ID=your-linkedin-app-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-app-client-secret
LINKEDIN_REDIRECT_URI=http://localhost:5000/api/auth/linkedin/callback
GEMINI_API_KEY=your-google-ai-api-key
CLIENT_URL=http://localhost:5173
```

### 3. Setup Database

```bash
cd server

# Generate Prisma client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to inspect data
npx prisma studio
```

### 4. Configure LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Create an app (or use existing one)
3. Under **Auth** tab:
   - Add redirect URL: `http://localhost:5000/api/auth/linkedin/callback`
   - Request products: **Sign In with LinkedIn using OpenID Connect**
4. Copy Client ID and Client Secret to your `.env`

### 5. Run the App

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- Health check: http://localhost:5000/api/health

## API Endpoints

| Method | Endpoint                        | Auth | Description                    |
| ------ | ------------------------------- | ---- | ------------------------------ |
| GET    | `/api/health`                   | No   | Health check                   |
| GET    | `/api/auth/linkedin`            | No   | Start LinkedIn OAuth flow      |
| GET    | `/api/auth/linkedin/callback`   | No   | OAuth callback handler         |
| GET    | `/api/auth/me`                  | Yes  | Get current user profile       |
| POST   | `/api/auth/logout`              | Yes  | Logout                         |
| POST   | `/api/analysis`                 | Yes  | Analyze posts (body: {posts})  |
| GET    | `/api/analysis`                 | Yes  | List all user analyses         |
| GET    | `/api/analysis/:id`             | Yes  | Get single analysis detail     |
| DELETE | `/api/analysis/:id`             | Yes  | Delete an analysis             |

### API Response Format

All API responses follow this consistent format:

```json
{
  "success": true,
  "data": {},
  "message": "Description of the result"
}
```

## Core Features

### 1. LinkedIn OAuth Authentication
- Secure OAuth 2.0 flow with PKCE-ready architecture
- JWT-based session management
- Automatic user upsert on login

### 2. AI Profile Analysis (Gemini)
- Detects niche, audience, tone, strengths, gaps
- Validates structured JSON output
- Graceful error handling with retry-friendly design

### 3. Growth Score (0-100)
- **Consistency** (0-25): Tone consistency, posting patterns
- **Niche Clarity** (0-25): Focus, strengths vs gaps
- **CTA Usage** (0-25): Call-to-action effectiveness
- **Engagement** (0-25): Growth opportunities, audience targeting

### 4. 7-Day Growth Plan
- Daily post ideas with compelling hooks
- Specific CTAs and engagement tasks
- Posting time and format suggestions

## Security

- Secrets stored in `.env`, never exposed to frontend
- JWT authentication with httpOnly cookie support
- Rate limiting: 100 req/15min general, 10 req/hour for analysis
- Helmet security headers
- CORS configured for frontend origin only
- Input validation on all endpoints
- Prisma parameterized queries (SQL injection safe)

## License

MIT
