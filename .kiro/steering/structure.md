---
inclusion: always
---

# Project Structure

## Directory Organization

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API route handlers
│   │   ├── admission-guide/
│   │   ├── chat-counsel/
│   │   ├── evaluate-quiz/
│   │   ├── generate-quiz/
│   │   ├── generate-roadmap/
│   │   ├── industry-insights/
│   │   ├── roadmap-full/
│   │   ├── search-universities/
│   │   └── topic-details/
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main application page
│   └── global-error.tsx   # Error boundary
├── components/
│   ├── ui/                # shadcn/ui components
│   └── ErrorReporter.tsx  # Error handling component
├── hooks/                 # Custom React hooks
├── lib/
│   ├── hooks/            # Additional hooks
│   └── utils.ts          # Utility functions (cn, etc.)
└── visual-edits/         # Visual editing tools
```

## Key Conventions

### API Routes

- Each API route is a separate directory with `route.ts`
- All routes use OpenAI SDK for AI interactions
- POST method for all AI endpoints
- JSON request/response format
- Error handling with try-catch and 500 status codes

### Components

- UI components follow shadcn/ui patterns
- Use Radix UI primitives as base
- Variants defined with `class-variance-authority`
- Props extend native HTML element props
- `asChild` pattern for composition
- `data-slot` attributes for styling hooks

### Styling

- Tailwind utility classes for all styling
- `cn()` utility for conditional classes
- No CSS modules or styled-components
- Dark mode support via `next-themes`
- Responsive design with Tailwind breakpoints

### Type Safety

- Interfaces defined inline in components/pages
- Strict TypeScript mode enabled
- Type errors ignored in production builds (pragmatic approach)
- Zod for runtime validation where needed

### State Management

- React hooks (`useState`, `useEffect`, `useRef`)
- Props drilling for component communication
- LocalStorage for persistence with TTL
- No Redux, Zustand, or other state libraries

### File Naming

- Components: PascalCase (e.g., `Button.tsx`)
- API routes: kebab-case directories (e.g., `generate-roadmap/`)
- Utilities: kebab-case (e.g., `use-mobile.ts`)
- Config files: kebab-case with extensions (e.g., `next.config.ts`)

## Import Patterns

- Use `@/` path alias for src imports
- Absolute imports preferred over relative
- Example: `import { Button } from "@/components/ui/button"`

## Environment Variables

- Stored in `.env` (gitignored)
- `.env.example` provides template
- Access via `process.env.VARIABLE_NAME`
- Required: `OPENAI_API_KEY`

## Page Architecture

The main application (`page.tsx`) is a large client component with:
- Multiple mode states (roadmap, insights, colleges, test)
- Dual-pane UI (chat box + result box)
- Complex state management for different features
- Inline component definitions for UI elements
