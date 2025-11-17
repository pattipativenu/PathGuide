---
inclusion: always
---

# Tech Stack

## Framework & Runtime

- **Next.js 15.3.5** with App Router (React 19)
- **TypeScript 5** with strict mode enabled
- **Node.js 20+** runtime
- Turbopack for fast development builds

## UI & Styling

- **Tailwind CSS 4** with PostCSS
- **Radix UI** primitives for accessible components
- **shadcn/ui** component library pattern
- **Framer Motion** for animations
- **Lucide React** for icons
- Class variance authority (CVA) for component variants
- `cn()` utility (clsx + tailwind-merge) for className composition

## State & Data

- React hooks for local state management
- LocalStorage for session persistence (1-hour TTL)
- No external state management library

## AI & APIs

- **OpenAI SDK** (GPT-4o model)
- API routes in `/src/app/api/*` for backend logic
- Environment variables for API keys

## Development Tools

- ESLint with Next.js config
- TypeScript with strict type checking
- Build errors and type errors ignored in production builds

## Common Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack
bun dev             # Alternative with Bun runtime

# Production
npm run build       # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint
```

## Deployment

- Optimized for **Google Cloud Run**
- Vercel-compatible
- Environment variables required: `OPENAI_API_KEY`
- See DEPLOYMENT.md for detailed instructions

## Key Dependencies

- `openai` - OpenAI API client
- `zod` - Schema validation
- `react-hook-form` - Form handling
- `sonner` - Toast notifications
- `date-fns` - Date utilities
