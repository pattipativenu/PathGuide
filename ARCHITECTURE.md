# PathGuide AI — System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACE                                 │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Roadmap    │  │   College    │  │   Test Me    │  │  Industry    │   │
│  │     Mode     │  │   Explorer   │  │     Mode     │  │  Insights    │   │
│  │              │  │     Mode     │  │              │  │     Mode     │   │
│  │ • Learning   │  │ • University │  │ • Skill      │  │ • Breaking   │   │
│  │   Paths      │  │   Search     │  │   Assessment │  │   News       │   │
│  │ • Progress   │  │ • Admission  │  │ • Quiz       │  │ • Startups   │   │
│  │   Tracking   │  │   Guidance   │  │   Results    │  │ • Funding    │   │
│  │ • Resources  │  │ • Programs   │  │ • Feedback   │  │ • Trends     │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                        Dual-Pane Layout                               │ │
│  │  ┌─────────────────────┐  │  ┌─────────────────────────────────────┐ │ │
│  │  │     Chat Box        │  │  │        Result Display               │ │ │
│  │  │                     │  │  │                                     │ │ │
│  │  │ • User Input        │  │  │ • Roadmap Visualization             │ │ │
│  │  │ • AI Questions      │  │  │ • University Profiles               │ │ │
│  │  │ • Conversation      │  │  │ • Quiz Interface                    │ │ │
│  │  │ • History           │  │  │ • Industry Insights                 │ │ │
│  │  └─────────────────────┘  │  └─────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND LAYER                                    │
│                          (Next.js 15 + React 19)                            │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  • TypeScript (strict mode)      • Tailwind CSS styling              │ │
│  │  • React hooks (state management) • Responsive design                │ │
│  │  • LocalStorage (1-hour cache)    • Lucide icons                     │ │
│  │  • Client-side routing            • Error boundaries                 │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            API GATEWAY                                      │
│                        (Next.js API Routes)                                 │
│                                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐│
│  │ /api/generate-      │  │ /api/generate-quiz  │  │ /api/industry-      ││
│  │      roadmap        │  │                     │  │      insights       ││
│  │ • Intake questions  │  │ • Quiz creation     │  │ • Market trends     ││
│  │ • 2-3 questions max │  │ • 15-20 questions   │  │ • Real-time news    ││
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘│
│                                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐│
│  │ /api/roadmap-full   │  │ /api/evaluate-quiz  │  │ /api/admission-     ││
│  │                     │  │                     │  │      guide          ││
│  │ • Complete roadmap  │  │ • Quiz scoring      │  │ • University info   ││
│  │ • 5-8 stages        │  │ • Detailed feedback │  │ • Admission steps   ││
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘│
│                                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐│
│  │ /api/topic-details  │  │ /api/search-        │  │ /api/chat-counsel   ││
│  │                     │  │      universities   │  │                     ││
│  │ • Resource discovery│  │ • University search │  │ • General guidance  ││
│  │ • YouTube, articles │  │ • Program matching  │  │ • College search    ││
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘│
│                                                                             │
│  • Request validation  • Error handling  • Response formatting             │
│  • Rate limiting       • Logging         • Security middleware             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AI PROCESSING LAYER                                 │
│                            (OpenAI Services)                                │
│                                                                             │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐ │
│  │          GPT-4o                 │  │   GPT-4o-search-preview         │ │
│  │                                 │  │                                 │ │
│  │ • Roadmap intake (temp: 0.8)   │  │ • Real-time web search          │ │
│  │ • Quiz generation (temp: 0.4)  │  │ • University information        │ │
│  │ • Quiz evaluation (temp: 0.3)  │  │ • Industry insights             │ │
│  │ • General counseling            │  │ • Resource discovery            │ │
│  │ • Structured JSON output        │  │ • Topic details                 │ │
│  │ • Context understanding         │  │ • Admission guidance            │ │
│  │ • Personalization               │  │ • YouTube video finding         │ │
│  └─────────────────────────────────┘  └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SERVICES                                   │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Web Search  │  │   YouTube    │  │ Educational  │  │ Professional │  │
│  │              │  │              │  │  Resources   │  │  Platforms   │  │
│  │ • Google     │  │ • Campus     │  │ • W3Schools  │  │ • Interview  │  │
│  │ • News       │  │   Tours      │  │ • GitHub     │  │   Cake       │  │
│  │ • Academic   │  │ • Student    │  │ • MDN        │  │ • Try        │  │
│  │   DBs        │  │   Life       │  │ • Articles   │  │   Exponent   │  │
│  │ • Market     │  │ • Tutorials  │  │ • Books      │  │ • LinkedIn   │  │
│  │   Data       │  │              │  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

## Data Flow Architecture

### Complete Request Flow

```
┌──────────┐
│  User    │
│  Input   │
└────┬─────┘
     │
     ▼
┌─────────────────────┐
│ Frontend Validation │
│ • Sanitization      │
│ • Type checking     │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│   API Route         │
│ • Route selection   │
│ • Request parsing   │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  AI Processing      │
│ • Model selection   │
│ • Prompt engineering│
│ • Context assembly  │
└────┬────────────────┘
     │
     ├─────────────────────┐
     │                     │
     ▼                     ▼
┌──────────────┐    ┌──────────────┐
│   GPT-4o     │    │ GPT-4o-search│
│              │    │  -preview    │
│ • Roadmap    │    │              │
│ • Quiz       │    │ • Web search │
│ • Evaluation │    │ • Universities│
└──────┬───────┘    └──────┬───────┘
       │                   │
       │                   ▼
       │            ┌──────────────┐
       │            │ External Web │
       │            │ • Search     │
       │            │ • Scraping   │
       │            │ • Validation │
       │            └──────┬───────┘
       │                   │
       └───────┬───────────┘
               │
               ▼
┌─────────────────────┐
│ Response Assembly   │
│ • JSON formatting   │
│ • Validation        │
│ • Error handling    │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  User Display       │
│ • Rendering         │
│ • Caching           │
│ • Progress tracking │
└─────────────────────┘
```

### Roadmap Generation Flow

```
User: "I want to become a Machine Learning Engineer"
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ POST /api/generate-roadmap                                  │
│ • Model: GPT-4o (temp: 0.8)                                │
│ • System: Roadmap Intake Tutor                             │
│ • Max questions: 3                                         │
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
AI: "What's your background? (student, professional, etc.)"
  │
  ▼
User: "I'm a computer science student"
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ POST /api/generate-roadmap (with history)                  │
│ • Conversation context maintained                          │
│ • Profile building                                         │
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
AI: "Do you have any ML skills? (Python, stats, etc.)"
  │
  ▼
User: "I know Python and basic statistics"
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ POST /api/generate-roadmap (with history)                  │
│ • Skill assessment                                         │
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
AI: "How would you rate yourself? (beginner/intermediate/advanced)"
  │
  ▼
User: "Intermediate"
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ Response: {"ready_to_generate": true, "profile_summary":   │
│            "CS student, knows Python & stats, intermediate"}│
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│ POST /api/roadmap-full                                      │
│ • Model: GPT-4o-search-preview                             │
│ • Web search for current ML requirements                   │
│ • Generate 5-8 stages with topics                          │
│ • Include timelines and resources                          │
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│ Roadmap JSON Response:                                      │
│ {                                                           │
│   "stages": [                                               │
│     {                                                       │
│       "title": "Foundations",                               │
│       "sections": [                                         │
│         {                                                   │
│           "title": "Mathematics",                           │
│           "topics": ["Linear Algebra", "Calculus", ...]    │
│         }                                                   │
│       ]                                                     │
│     }                                                       │
│   ]                                                         │
│ }                                                           │
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
Display roadmap with interactive topics
```

### College Search Flow

```
User: "Best universities for Aerospace Engineering in Europe"
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ POST /api/chat-counsel (mode: colleges)                    │
│ • Model: GPT-4o-search-preview                             │
│ • Web search enabled                                       │
│ • Must return JSON (not text)                              │
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│ AI performs web search:                                     │
│ • Official university websites (.edu, .ac.uk, etc.)        │
│ • Program pages                                            │
│ • Faculty profiles                                         │
│ • Recent achievements                                      │
│ • Research highlights                                      │
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│ JSON Response:                                              │
│ {                                                           │
│   "type": "college_results",                               │
│   "programs": [                                            │
│     {                                                      │
│       "university_name": "TU Delft",                       │
│       "country": "Netherlands",                            │
│       "program_name": "MSc Aerospace Engineering",         │
│       "program_url": "https://...",                        │
│       "strengths": [...],                                  │
│       "research_highlights": [...],                        │
│       "notable_faculty": [...]                             │
│     }                                                      │
│   ]                                                        │
│ }                                                          │
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
Display university cards with "Learn more" buttons
  │
  ▼
User clicks "Learn more" on TU Delft
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ POST /api/admission-guide                                  │
│ • Model: GPT-4o-search-preview                             │
│ • Detailed admission process                               │
│ • Step-by-step guidance                                    │
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
Display detailed admission guidance with steps
```

### Quiz Generation & Evaluation Flow

```
User completes roadmap → Clicks "Start Diagnostic Test"
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ POST /api/generate-quiz                                     │
│ • Model: GPT-4o (temp: 0.4)                                │
│ • Input: goal, roadmap stages, user skills, level          │
│ • Generate 15-20 questions                                 │
│ • Difficulty distribution based on level                   │
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│ Quiz JSON Response:                                         │
│ {                                                           │
│   "quiz_context": {                                        │
│     "based_on_skills": ["Python", "Statistics"],           │
│     "user_level": "intermediate",                          │
│     "total_questions": 18                                  │
│   },                                                       │
│   "questions": [                                           │
│     {                                                      │
│       "id": "q1",                                          │
│       "question": "What is gradient descent?",             │
│       "options": ["A) ...", "B) ...", "C) ...", "D) ..."], │
│       "correct_option": "B",                               │
│       "topic": "Machine Learning Basics",                  │
│       "difficulty": "medium",                              │
│       "explanation": "..."                                 │
│     }                                                      │
│   ]                                                        │
│ }                                                          │
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
User answers all questions → Clicks "Submit"
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ POST /api/evaluate-quiz                                    │
│ • Model: GPT-4o (temp: 0.3)                                │
│ • Input: questions, user answers                           │
│ • Calculate score and category breakdown                   │
│ • Identify strengths and weaknesses                        │
│ • Recommend resources                                      │
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│ Evaluation JSON Response:                                   │
│ {                                                           │
│   "score_percent": 72,                                     │
│   "correct_count": 13,                                     │
│   "total_count": 18,                                       │
│   "strengths": ["Python", "Data Structures"],              │
│   "weak_topics": ["Linear Algebra", "Neural Networks"],    │
│   "category_breakdown": [                                  │
│     {                                                      │
│       "category": "Mathematics",                           │
│       "correct": 2,                                        │
│       "total": 5,                                          │
│       "percentage": 40                                     │
│     }                                                      │
│   ],                                                       │
│   "recommended_resources": [                               │
│     {                                                      │
│       "topic": "Linear Algebra",                           │
│       "resources": ["3Blue1Brown videos", "Khan Academy"]  │
│     }                                                      │
│   ]                                                        │
│ }                                                          │
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
Display detailed feedback with visual indicators
```

### Industry Insights Flow

```
User: "Latest trends in Artificial Intelligence"
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│ POST /api/industry-insights                                 │
│ • Model: GPT-4o-search-preview (temp: 0.2)                 │
│ • Real-time web search                                     │
│ • Sources: Bloomberg, TechCrunch, Reuters, Nature, ArXiv   │
│ • Categories: news, startups, funding, research, policy    │
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│ Web Search Process:                                         │
│ 1. Search for "AI trends 2024"                             │
│ 2. Filter by date (last 30-90 days)                        │
│ 3. Verify source legitimacy                                │
│ 4. Extract key information                                 │
│ 5. Categorize by type                                      │
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│ Insights JSON Response:                                     │
│ {                                                           │
│   "type": "industry_insights",                             │
│   "summary": "AI industry seeing rapid growth...",         │
│   "insights": {                                            │
│     "breaking_news": [                                     │
│       {                                                    │
│         "title": "OpenAI releases GPT-5",                  │
│         "summary": "...",                                  │
│         "date": "2024-11-15",                              │
│         "source": "TechCrunch",                            │
│         "url": "https://...",                              │
│         "category": "breaking_news"                        │
│       }                                                    │
│     ],                                                     │
│     "startup_activity": [...],                             │
│     "funding_investments": [...],                          │
│     "research_breakthroughs": [...],                       │
│     "policy_regulations": [...],                           │
│     "market_trends": [...],                                │
│     "notable_achievements": [...]                          │
│   }                                                        │
│ }                                                          │
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
Display categorized insights with source links
```

## Environment Variable Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Development Environment                   │
│                                                             │
│  .env file (local, gitignored)                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ OPENAI_API_KEY=sk-...                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│  process.env.OPENAI_API_KEY                                │
│                           │                                 │
│                           ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ const openai = new OpenAI({                          │  │
│  │   apiKey: process.env.OPENAI_API_KEY                 │  │
│  │ });                                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   Production Environment                     │
│                    (Google Cloud Run)                        │
│                                                             │
│  Environment Variables (Cloud Run Console)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ OPENAI_API_KEY = sk-...                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│  OR Google Secret Manager                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Secret: openai-api-key                               │  │
│  │ Value: sk-...                                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│  Container receives environment variable                    │
│                           │                                 │
│                           ▼                                 │
│  Application uses process.env.OPENAI_API_KEY              │
└─────────────────────────────────────────────────────────────┘

Security Rules:
✅ .env in .gitignore
✅ .env.example with placeholders committed
✅ Environment variables in deployment platform
✅ No hardcoded keys in source code
❌ Never commit .env file
❌ Never hardcode API keys
```

## Mode Routing Logic

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface State                      │
│                                                             │
│  const [mode, setMode] = useState<'roadmap' | 'colleges' |  │
│                                   'test' | 'insights'>()    │
└────┬────────────────────────────────────────────────────────┘
     │
     ├─────────────┬─────────────┬─────────────┬──────────────┐
     │             │             │             │              │
     ▼             ▼             ▼             ▼              ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
│ Roadmap  │ │ Colleges │ │  Test    │ │ Insights │ │   Welcome    │
│  Mode    │ │  Mode    │ │  Mode    │ │  Mode    │ │   Screen     │
└────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────────────┘
     │            │            │            │
     ▼            ▼            ▼            ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Roadmap  │ │ College  │ │  Quiz    │ │ Insights │
│ Intake   │ │ Search   │ │ Display  │ │ Display  │
│ Chat     │ │ Chat     │ │          │ │          │
└────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
     │            │            │            │
     ▼            ▼            ▼            ▼
┌──────────────────────────────────────────────────┐
│           API Route Selection                    │
│                                                  │
│  if (mode === 'roadmap')                        │
│    → /api/generate-roadmap                      │
│    → /api/roadmap-full                          │
│    → /api/topic-details                         │
│                                                  │
│  if (mode === 'colleges')                       │
│    → /api/chat-counsel (mode: colleges)         │
│    → /api/admission-guide                       │
│                                                  │
│  if (mode === 'test')                           │
│    → /api/generate-quiz                         │
│    → /api/evaluate-quiz                         │
│                                                  │
│  if (mode === 'insights')                       │
│    → /api/industry-insights                     │
└──────────────────────────────────────────────────┘
```

## Component Architecture

```
src/app/page.tsx (Main Application)
│
├── Header
│   ├── Logo
│   └── Branding
│
├── Mode Selector
│   ├── Roadmap Button
│   ├── Colleges Button
│   ├── Test Me Button
│   └── Insights Button
│
├── Main Content (Dual-Pane Layout)
│   │
│   ├── Chat Box (Left Pane - flex-[7])
│   │   ├── Message History
│   │   │   ├── User Messages
│   │   │   └── AI Messages
│   │   ├── Input Area
│   │   │   ├── Textarea
│   │   │   └── Send Button
│   │   └── Mode-Specific Controls
│   │       ├── Clear History
│   │       ├── Start Test (Test Mode)
│   │       └── Category Filters (Insights Mode)
│   │
│   └── Result Box (Right Pane - flex-[3])
│       ├── Welcome Screen (No Mode Selected)
│       ├── Roadmap Display (Roadmap Mode)
│       │   ├── Stage Cards
│       │   │   ├── Section Boxes
│       │   │   └── Topic Boxes (clickable)
│       │   └── Progress Indicators
│       ├── University Cards (Colleges Mode)
│       │   ├── University Info
│       │   ├── Program Details
│       │   └── Learn More Button
│       ├── Quiz Interface (Test Mode)
│       │   ├── Question Display
│       │   ├── Option Buttons
│       │   ├── Submit Button
│       │   └── Results Display
│       └── Insights Display (Insights Mode)
│           ├── Category Tabs
│           ├── Insight Cards
│           └── Source Links
│
└── Topic Detail Slider (Overlay)
    ├── Close Button
    ├── Topic Title
    ├── Resource Lists
    │   ├── YouTube Videos
    │   ├── Articles
    │   ├── Books
    │   └── GitHub Repos
    └── Progress Controls
        ├── Mark as Done
        ├── Mark as In Progress
        └── Skip
```

## State Management

```
┌─────────────────────────────────────────────────────────────┐
│                    React State (useState)                    │
│                                                             │
│  UI State:                                                  │
│  • mode: 'roadmap' | 'colleges' | 'test' | 'insights'      │
│  • loading: boolean                                         │
│  • error: string | null                                     │
│                                                             │
│  Roadmap State:                                             │
│  • roadmapData: RoadmapJSON | null                         │
│  • conversationHistory: Message[]                           │
│  • selectedTopic: Topic | null                              │
│  • topicProgress: Map<string, 'done' | 'progress' | 'skip'>│
│                                                             │
│  College State:                                             │
│  • collegeResults: University[]                            │
│  • selectedUniversity: University | null                    │
│  • admissionGuide: AdmissionGuide | null                   │
│                                                             │
│  Quiz State:                                                │
│  • quizData: Quiz | null                                   │
│  • userAnswers: Map<string, string>                        │
│  • quizResults: QuizResults | null                         │
│  • currentQuestionIndex: number                            │
│                                                             │
│  Insights State:                                            │
│  • insightsData: Insights | null                           │
│  • selectedCategory: string | null                         │
│  • region: string                                          │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              LocalStorage (1-hour expiration)                │
│                                                             │
│  Key: 'pathguide_history'                                  │
│  Value: {                                                  │
│    timestamp: number,                                      │
│    roadmaps: RoadmapData[],                               │
│    quizResults: QuizResults[],                            │
│    progress: ProgressMap                                   │
│  }                                                         │
│                                                             │
│  Expiration: 1 hour (3600000 ms)                          │
│  Cleanup: Automatic on page load                           │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Source Code (GitHub/Bitbucket)            │
│                                                             │
│  • Next.js application                                      │
│  • TypeScript files                                         │
│  • Configuration files                                      │
│  • .env.example (no secrets)                               │
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Build Process                             │
│                                                             │
│  npm run build                                              │
│  ├── TypeScript compilation                                 │
│  ├── Next.js optimization                                   │
│  ├── Static asset generation                                │
│  └── Bundle creation                                        │
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Container Image                           │
│                                                             │
│  Dockerfile                                                 │
│  ├── Node.js runtime                                        │
│  ├── Application code                                       │
│  ├── Dependencies                                           │
│  └── Start command                                          │
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Google Cloud Run                          │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Container Instance 1                                 │ │
│  │  • Environment: OPENAI_API_KEY                        │ │
│  │  • Port: 3000                                         │ │
│  │  • Memory: 512MB                                      │ │
│  │  • CPU: 1                                             │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Auto-scaling                                         │ │
│  │  • Min instances: 0                                   │ │
│  │  • Max instances: 10                                  │ │
│  │  │  • Scale based on traffic                          │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Load Balancer                                        │ │
│  │  • HTTPS termination                                  │ │
│  │  • Request routing                                    │ │
│  │  • Health checks                                      │ │
│  └───────────────────────────────────────────────────────┘ │
└────┬────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Public URL                                │
│                                                             │
│  https://pathguide-ai-xxxxx.run.app                        │
│  • TLS 1.3 encryption                                       │
│  • Global CDN                                               │
│  • DDoS protection                                          │
└─────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
│                                                             │
│  Layer 1: Environment Security                              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ • API keys in environment variables only              │ │
│  │ • No secrets in source code                           │ │
│  │ • .env in .gitignore                                  │ │
│  │ • Secret Manager for production                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Layer 2: Transport Security                                │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ • TLS 1.3 encryption                                  │ │
│  │ • HTTPS enforcement                                   │ │
│  │ • Secure headers                                      │ │
│  │ • CORS configuration                                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Layer 3: Input Validation                                  │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ • Request sanitization                                │ │
│  │ • Type validation (TypeScript)                        │ │
│  │ • Rate limiting                                       │ │
│  │ • Size limits                                         │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Layer 4: Data Privacy                                      │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ • No permanent user data storage                      │ │
│  │ • Local browser cache only (1-hour)                   │ │
│  │ • Minimal data sent to AI                             │ │
│  │ • No tracking or analytics                            │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                    Optimization Strategies                   │
│                                                             │
│  Frontend Optimizations:                                    │
│  • Code splitting (Next.js automatic)                       │
│  • Lazy loading of components                               │
│  • Image optimization                                       │
│  • CSS purging (Tailwind)                                   │
│  • Bundle size minimization                                 │
│                                                             │
│  Backend Optimizations:                                     │
│  • Serverless functions (fast cold start)                   │
│  • Response streaming where possible                        │
│  • Efficient JSON parsing                                   │
│  • Error handling without crashes                           │
│                                                             │
│  Caching Strategy:                                          │
│  • Browser cache (1-hour localStorage)                      │
│  • CDN caching for static assets                            │
│  • API response caching (client-side)                       │
│  • No server-side caching (stateless)                       │
│                                                             │
│  AI Optimization:                                           │
│  • Appropriate temperature settings                         │
│  • Structured output (JSON mode)                            │
│  • Efficient prompt engineering                             │
│  • Timeout management                                       │
└─────────────────────────────────────────────────────────────┘
```

---

*This architecture document provides a comprehensive overview of PathGuide AI's system design, data flows, and technical implementation.*
