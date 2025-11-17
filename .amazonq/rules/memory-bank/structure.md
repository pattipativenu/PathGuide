# PathGuide AI Dashboard - Project Structure

## Directory Organization

```
PathGuide-AI-Dashboard-codebase/
├── src/                          # Source code directory
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API route handlers
│   │   │   ├── admission-guide/  # Admission guide generation
│   │   │   ├── chat-counsel/     # AI counseling chat
│   │   │   ├── evaluate-quiz/    # Quiz evaluation
│   │   │   ├── generate-quiz/    # Quiz generation
│   │   │   ├── generate-roadmap/ # Roadmap creation
│   │   │   ├── industry-insights/# Industry analysis
│   │   │   ├── roadmap-full/     # Full roadmap details
│   │   │   └── search-universities/ # University search
│   │   ├── page.tsx              # Main application page
│   │   ├── layout.tsx            # Root layout component
│   │   ├── globals.css           # Global styles
│   │   └── global-error.tsx      # Global error handler
│   ├── components/               # React components
│   │   ├── ui/                   # UI component library (60+ components)
│   │   └── ErrorReporter.tsx     # Error reporting component
│   ├── hooks/                    # Custom React hooks
│   │   └── use-mobile.ts         # Mobile detection hook
│   ├── lib/                      # Utility libraries
│   │   ├── hooks/                # Additional hooks
│   │   └── utils.ts              # Utility functions
│   └── visual-edits/             # Visual editing tools
│       ├── component-tagger-loader.js  # Component tagging
│       └── VisualEditsMessenger.tsx    # Visual edits messenger
├── public/                       # Static assets
│   ├── icons/                    # Application icons
│   └── *.svg                     # SVG assets
├── .amazonq/                     # Amazon Q configuration
│   └── rules/                    # Project rules
│       └── memory-bank/          # Memory bank documentation
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind CSS configuration
└── components.json               # shadcn/ui configuration
```

## Core Components and Relationships

### Application Architecture
- **Next.js 15 App Router**: Modern React framework with server and client components
- **API Routes**: Backend endpoints for AI services and data processing
- **Component Library**: Comprehensive UI components built with Radix UI and shadcn/ui
- **State Management**: React hooks and client-side state
- **Styling**: Tailwind CSS with custom animations and themes

### Key Component Relationships

#### Main Application Flow (page.tsx)
- Central hub managing all features
- Tab-based navigation (Roadmap, Universities, Insights, Quiz)
- Sidebar for quick access to features
- Integrates all API endpoints

#### API Layer
- **search-universities**: Queries and ranks universities based on criteria
- **admission-guide**: Generates personalized admission requirements
- **generate-roadmap**: Creates learning paths with milestones
- **chat-counsel**: Provides conversational AI guidance
- **industry-insights**: Analyzes industry trends and opportunities
- **generate-quiz**: Creates adaptive quizzes
- **evaluate-quiz**: Scores and provides feedback on quiz responses

#### UI Component Library
- **Layout Components**: Sidebar, Card, Tabs, Dialog, Sheet
- **Form Components**: Input, Select, Textarea, Checkbox, Radio
- **Data Display**: Table, Chart, Badge, Avatar, Progress
- **Feedback**: Alert, Toast (Sonner), Spinner, Skeleton
- **Navigation**: Navigation Menu, Breadcrumb, Pagination
- **Overlay**: Dialog, Popover, Tooltip, Hover Card

### Architectural Patterns

#### Server-Client Separation
- API routes handle server-side logic and AI integrations
- Client components manage UI state and interactions
- Streaming responses for real-time AI feedback

#### Component Composition
- Atomic design with reusable UI primitives
- Compound components for complex interactions
- Slot-based composition with Radix UI

#### Data Flow
1. User interaction in page.tsx
2. API call to appropriate endpoint
3. Server-side processing (AI, database, external APIs)
4. Response streaming or JSON return
5. Client-side state update and UI rendering

#### Visual Editing System
- Custom webpack loader for component tagging
- Visual edits messenger for real-time updates
- Turbopack integration for fast development

### Configuration Files
- **next.config.ts**: Image optimization, TypeScript/ESLint settings, Turbopack rules
- **tsconfig.json**: Strict TypeScript with path aliases (@/*)
- **components.json**: shadcn/ui component configuration
- **tailwind.config**: Custom theme, animations, and plugins
