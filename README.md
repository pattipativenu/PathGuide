# PathGuide AI — Intelligent Career & Education Guidance Platform

> 🎯 **AI-powered personalized roadmaps, university guidance, skill assessments, and industry insights for students worldwide**

PathGuide AI is a comprehensive platform that transforms how students and professionals navigate their educational and career journeys. Using advanced AI and real-time web search, PathGuide delivers personalized learning paths, university recommendations, diagnostic assessments, and market intelligence—all in one unified experience.

## ✨ Features

### 🗺️ Roadmap Mode — Personalized Learning Paths
- AI-generated roadmaps for any career or skill (ML Engineer, Chartered Accountant, Pilot, Chef, etc.)
- Adaptive content based on your background and experience level (beginner/intermediate/advanced)
- Interactive topic exploration with curated resources (YouTube, articles, GitHub, books)
- Progress tracking with visual indicators (Done, In Progress, Skip)
- 5-8 stages with detailed topic breakdowns and realistic timelines

### 🏛️ College Explorer Mode — Intelligent University Discovery
- AI-powered university matching based on your goals and profile
- Detailed profiles: programs, admission requirements, faculty, research highlights
- Direct links to official program pages and applications
- Recent achievements, research breakthroughs, and notable faculty
- Global coverage with verified information from official sources

### 📝 Test Me Mode — Adaptive Skill Assessment
- Personalized diagnostic tests (15-20 questions) based on your roadmap
- Adaptive difficulty matched to your declared skill level
- Comprehensive feedback: strengths, weaknesses, category breakdowns
- Specific learning resources for improvement areas
- Actionable next steps for skill development

### 📊 Industry Insights Mode — Real-Time Market Intelligence
- Current industry trends, breaking news, and developments
- Startup activity, funding rounds, and acquisitions
- Research breakthroughs and technological advances
- Policy changes and regulatory updates
- Market trends and emerging opportunities
- Categorized insights with source links and dates

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pathguide-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Add your OpenAI API key**
   
   Open `.env` and add your key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```
   
   ⚠️ **IMPORTANT**: Never commit `.env` to version control!

5. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Live Deployment

**Cloud Run URL**: `[Your deployment URL will appear here after deployment]`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Google Cloud Run or Vercel.

## 🏗️ Architecture

### Technology Stack

**Frontend**
- Next.js 15 with App Router
- React 19
- TypeScript 5 (strict mode)
- Tailwind CSS 4
- Lucide React (icons)

**Backend**
- Next.js API Routes (serverless functions)
- OpenAI GPT-4o (language model)
- OpenAI GPT-4o-search-preview (web search)

**Deployment**
- Google Cloud Run (recommended)
- Vercel (compatible)
- Docker containerization

### Project Structure

```
pathguide-ai/
├── src/
│   ├── app/
│   │   ├── api/                    # API endpoints
│   │   │   ├── roadmap-full/       # Roadmap generation
│   │   │   ├── generate-roadmap/   # Roadmap intake questions
│   │   │   ├── generate-quiz/      # Quiz creation
│   │   │   ├── evaluate-quiz/      # Quiz scoring
│   │   │   ├── admission-guide/    # University details
│   │   │   ├── topic-details/      # Resource discovery
│   │   │   ├── industry-insights/  # Market intelligence
│   │   │   ├── search-universities/# University search
│   │   │   └── chat-counsel/       # General guidance
│   │   ├── globals.css            # Global styles
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Main application
│   ├── components/
│   │   └── ui/                    # Reusable UI components
│   ├── hooks/                     # Custom React hooks
│   └── lib/                       # Utility functions
├── public/                        # Static assets
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── tailwind.config.ts             # Tailwind config
├── next.config.ts                 # Next.js config
├── README.md                      # This file
├── DEPLOYMENT.md                  # Deployment guide
├── PROJECT_DESCRIPTION.md         # Detailed project overview
└── AI_TOOLS_DISCLOSURE.md         # AI transparency document
```

## 🎯 How Each Mode Works

### Roadmap Mode

1. **User Input**: "I want to become a Machine Learning Engineer"
2. **AI Questions**: Asks 2-3 questions about background, skills, level
3. **Roadmap Generation**: Creates 5-8 stage learning path
4. **Topic Exploration**: Click any topic for resources (videos, articles, repos)
5. **Progress Tracking**: Mark topics as Done, In Progress, or Skip

**API Flow**:
```
POST /api/generate-roadmap → Conversational intake
POST /api/roadmap-full → Generate complete roadmap
POST /api/topic-details → Get resources for specific topic
```

### College Explorer Mode

1. **Search Query**: "Best universities for Aerospace Engineering in Europe"
2. **AI Matching**: Web search for real universities
3. **Results Display**: 5-10 universities with detailed profiles
4. **Deep Dive**: Click "Learn more" for admission guidance
5. **Refinement**: Ask follow-up questions to narrow search

**API Flow**:
```
POST /api/chat-counsel (mode: colleges) → University search
POST /api/admission-guide → Detailed university profile
```

### Test Me Mode

1. **Prerequisite**: Complete a roadmap first
2. **Test Generation**: Click "Start Diagnostic Test"
3. **Personalized Questions**: 15-20 questions based on your roadmap and skills
4. **Adaptive Difficulty**: 
   - Beginner: 70% easy, 25% medium, 5% hard
   - Intermediate: 30% easy, 50% medium, 20% hard
   - Advanced: 10% easy, 30% medium, 60% hard
5. **Detailed Feedback**: Strengths, weaknesses, resources for improvement

**API Flow**:
```
POST /api/generate-quiz → Create personalized quiz
POST /api/evaluate-quiz → Score and analyze results
```

### Industry Insights Mode

1. **Query Input**: "Latest trends in Artificial Intelligence"
2. **Web Search**: Real-time search across legitimate sources
3. **Categorized Results**:
   - Breaking News (last 15-30 days)
   - Startup Activity
   - Funding & Investments
   - Research Breakthroughs
   - Policy & Regulations
   - Market Trends
   - Notable Achievements
4. **Source Links**: Every insight includes verification URL
5. **Filtering**: By category or region

**API Flow**:
```
POST /api/industry-insights → Real-time market intelligence
```

## 🔌 API Endpoints Overview

| Endpoint | Method | Purpose | AI Model |
|----------|--------|---------|----------|
| `/api/generate-roadmap` | POST | Conversational intake for roadmap | GPT-4o |
| `/api/roadmap-full` | POST | Generate complete roadmap | GPT-4o-search-preview |
| `/api/generate-quiz` | POST | Create personalized quiz | GPT-4o |
| `/api/evaluate-quiz` | POST | Score and analyze quiz | GPT-4o |
| `/api/admission-guide` | POST | University details and guidance | GPT-4o-search-preview |
| `/api/topic-details` | POST | Resource discovery for topics | GPT-4o-search-preview |
| `/api/industry-insights` | POST | Real-time market intelligence | GPT-4o-search-preview |
| `/api/search-universities` | POST | University search | GPT-4o-search-preview |
| `/api/chat-counsel` | POST | General guidance and college search | GPT-4o / GPT-4o-search-preview |

### Example API Request

```typescript
// Generate a roadmap
const response = await fetch('/api/roadmap-full', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    originalQuestion: "I want to become a Data Scientist",
    conversationHistory: [
      { role: "user", content: "I want to become a Data Scientist" },
      { role: "assistant", content: "What's your background?" },
      { role: "user", content: "I'm a computer science student" }
    ]
  })
});

const roadmap = await response.json();
```

## 🧪 How Quizzes Work

### Quiz Generation Algorithm

1. **Profile Analysis**: Reviews your roadmap, mentioned skills, declared level
2. **Question Selection**: Generates 15-20 questions covering relevant topics
3. **Difficulty Distribution**:
   ```
   Beginner:     [======70%======][==25%==][5%]
   Intermediate: [==30%==][======50%======][==20%==]
   Advanced:     [10%][==30%==][======60%======]
   ```
4. **Topic Coverage**: Ensures questions span multiple categories from your roadmap
5. **Explanation Generation**: Each question includes detailed explanation

### Quiz Evaluation Process

1. **Answer Comparison**: Matches user answers to correct answers
2. **Score Calculation**: Computes percentage and category breakdowns
3. **Strength Identification**: Topics with 80%+ correct
4. **Weakness Detection**: Topics with <60% correct
5. **Resource Recommendation**: Specific materials for weak areas
6. **Next Steps**: Actionable items for improvement

## 🔐 Security Notes

### Environment Variables

- **NEVER** commit `.env` file to version control
- `.env` is in `.gitignore` by default
- Only `.env.example` (with placeholders) should be committed
- Use environment variables in deployment platforms (Cloud Run, Vercel)

### API Key Security

```typescript
// ✅ CORRECT: Use environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ❌ WRONG: Never hardcode API keys
const openai = new OpenAI({
  apiKey: 'sk-...',  // DON'T DO THIS!
});
```

### Data Privacy

- No user data stored permanently on servers
- Results cached locally in browser (1-hour expiration)
- No user accounts or authentication required
- Minimal data sent to AI services (only necessary information)

## 🛠️ Development

### Local Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Lint code
npm run lint
```

### Environment Setup

Create `.env` file (never commit this):

```bash
# OpenAI API Configuration
OPENAI_API_KEY=sk-your-actual-api-key-here
```

Get your API key from: https://platform.openai.com/api-keys

### Code Quality

- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Next.js recommended configuration
- **Tailwind CSS**: Utility-first styling with consistent design
- **Component Structure**: Modular, reusable components

### Testing Locally

1. Start dev server: `npm run dev`
2. Test each mode:
   - Roadmap: Create a learning path
   - Colleges: Search for universities
   - Test Me: Generate and complete a quiz
   - Insights: Check industry trends
3. Verify API responses in browser console
4. Check for errors in terminal

## 📚 Documentation

- **[PROJECT_DESCRIPTION.md](./PROJECT_DESCRIPTION.md)**: Comprehensive project overview, features, and impact
- **[AI_TOOLS_DISCLOSURE.md](./AI_TOOLS_DISCLOSURE.md)**: Complete transparency about AI usage and data handling
- **[DEPLOYMENT.md](./DEPLOYMENT.md)**: Step-by-step deployment guide for Google Cloud Run and Vercel

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Contribution Guidelines

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow existing code style
   - Add TypeScript types for new code
   - Test thoroughly
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Standards

- **TypeScript**: All new code must be typed
- **Code Style**: Follow existing patterns and conventions
- **Documentation**: Update docs for API or feature changes
- **Testing**: Test new features thoroughly before submitting
- **Security**: Never commit secrets or API keys

### Areas for Contribution

- **New Features**: Additional modes or capabilities
- **UI/UX Improvements**: Better design and user experience
- **Performance**: Optimization and caching strategies
- **Documentation**: Tutorials, examples, translations
- **Bug Fixes**: Report and fix issues
- **Testing**: Add test coverage

## 🐛 Troubleshooting

### Common Issues

**"OpenAI API key not found" error**
```
Solution:
1. Verify .env file exists in project root
2. Check OPENAI_API_KEY is set correctly
3. Ensure no extra spaces or quotes
4. Restart development server after adding key
```

**Build failures**
```
Solution:
1. Run: npm run build
2. Check for TypeScript errors in output
3. Verify all imports are correct
4. Ensure dependencies are installed
```

**Port 3000 already in use**
```
Solution:
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

**API requests failing**
```
Solution:
1. Check browser console for errors
2. Verify API key is valid
3. Check OpenAI API status
4. Review server logs in terminal
```

## 📊 Performance

### Optimization Features

- **Server-Side Rendering**: Fast initial page loads
- **Code Splitting**: Optimized bundle sizes
- **Lazy Loading**: On-demand resource loading
- **Caching**: Intelligent caching strategies
- **Turbopack**: Fast development builds

### Monitoring

- Build analytics for bundle size tracking
- API response time monitoring
- Error tracking and logging
- User interaction analytics (privacy-respecting)

## 🌍 Deployment

### Google Cloud Run (Recommended)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.

Quick deploy:
```bash
gcloud run deploy pathguide-ai \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars OPENAI_API_KEY=your_key_here
```

### Vercel

1. Connect your repository to Vercel
2. Add environment variable: `OPENAI_API_KEY`
3. Deploy

### Docker

```bash
# Build image
docker build -t pathguide-ai .

# Run container
docker run -p 3000:3000 -e OPENAI_API_KEY=your_key pathguide-ai
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI**: For providing advanced AI capabilities (GPT-4o models)
- **Next.js Team**: For the excellent React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Lucide**: For the beautiful icon library
- **Vercel**: For hosting and deployment platform
- **Google Cloud**: For Cloud Run infrastructure

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Documentation**: See docs folder for detailed guides
- **Email**: support@pathguide.ai

---

**PathGuide AI** — Empowering educational and career success through intelligent guidance.

*Built with ❤️ for students worldwide using Next.js, TypeScript, and OpenAI*
