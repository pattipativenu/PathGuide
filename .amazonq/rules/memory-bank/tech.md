# PathGuide AI Dashboard - Technology Stack

## Programming Languages
- **TypeScript 5**: Primary language for type-safe development
- **JavaScript**: Used in specific loaders and configurations
- **CSS**: Global styles and Tailwind utilities

## Core Framework
- **Next.js 15.3.5**: React framework with App Router
  - Server Components and Client Components
  - API Routes for backend functionality
  - Turbopack for fast development builds
  - Image optimization with remote patterns
  - File-based routing

## Frontend Technologies

### UI Framework
- **React 19.0.0**: Latest React with concurrent features
- **React DOM 19.0.0**: DOM rendering

### UI Component Libraries
- **Radix UI**: Unstyled, accessible component primitives
  - 30+ components (Dialog, Dropdown, Select, Tabs, etc.)
  - Full accessibility support
  - Customizable with Tailwind
- **shadcn/ui**: Component collection built on Radix UI
- **Lucide React**: Icon library (552+ icons)
- **Tabler Icons**: Additional icon set
- **Heroicons**: Hero icon collection

### Styling
- **Tailwind CSS 4**: Utility-first CSS framework
  - Custom theme configuration
  - PostCSS integration
  - Typography plugin
  - Animate CSS integration
- **tailwind-merge**: Utility for merging Tailwind classes
- **tailwindcss-animate**: Animation utilities
- **class-variance-authority**: Component variant management
- **clsx**: Conditional class name utility

### Animation & Visual Effects
- **Framer Motion 12.23.24**: Animation library
- **Motion & Motion DOM**: Additional animation utilities
- **React Three Fiber**: 3D graphics with Three.js
- **React Three Drei**: Helpers for React Three Fiber
- **Three.js 0.178.0**: 3D graphics library
- **Three Globe**: 3D globe visualization
- **Cobe**: Globe rendering
- **tsparticles**: Particle effects
- **Simplex Noise**: Noise generation for effects

### Form Management
- **React Hook Form 7.60.0**: Form state management
- **Hookform Resolvers**: Validation resolvers
- **Zod 4.1.12**: Schema validation
- **Input OTP**: OTP input component

### Data Visualization
- **Recharts 3.0.2**: Charting library
- **Number Flow**: Animated number transitions

### UI Enhancements
- **Embla Carousel**: Carousel with autoplay and auto-scroll
- **React Fast Marquee**: Scrolling marquee component
- **React Dropzone**: File upload component
- **React Syntax Highlighter**: Code syntax highlighting
- **React Wrap Balancer**: Text balancing
- **React Intersection Observer**: Viewport detection
- **React Resizable Panels**: Resizable panel layouts
- **React Responsive Masonry**: Masonry grid layouts
- **Swiper**: Touch slider

### Theming
- **Next Themes**: Dark/light mode support

### Notifications
- **Sonner**: Toast notifications

## Backend Technologies

### AI Integration
- **OpenAI 6.9.0**: GPT models for AI features
  - University recommendations
  - Admission guide generation
  - Roadmap creation
  - Chat counseling
  - Quiz generation and evaluation
  - Industry insights

### Database
- **Drizzle ORM 0.44.7**: TypeScript ORM
- **Drizzle Kit 0.31.6**: Database migrations
- **@libsql/client**: LibSQL database client

### Authentication
- **Better Auth 1.3.10**: Authentication library
- **bcrypt 6.0.0**: Password hashing

### Payment Processing
- **Stripe 19.2.0**: Payment integration

## Development Tools

### Build Tools
- **Turbopack**: Next.js fast bundler (via --turbopack flag)
- **PostCSS**: CSS processing
- **Babel Parser**: JavaScript parsing

### Code Quality
- **ESLint 9.38.0**: Linting
  - Next.js ESLint config
  - Custom ESLint configuration
- **TypeScript**: Type checking with strict mode

### Utilities
- **date-fns 4.1.0**: Date manipulation
- **qss**: Query string parsing
- **mini-svg-data-uri**: SVG to data URI conversion
- **dotted-map**: Map visualization
- **estree-walker**: AST traversal

### Custom Tools
- **component-tagger-loader.js**: Custom webpack loader for component tagging
- **VisualEditsMessenger.tsx**: Visual editing communication

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- Path aliases: @/* → ./src/*
- JSX: preserve (handled by Next.js)
- Module resolution: bundler

## Next.js Configuration
- Remote image patterns: All HTTPS/HTTP hosts allowed
- TypeScript build errors: Ignored
- ESLint during builds: Ignored
- Turbopack rules: Custom loader for JSX/TSX files
- Output file tracing for optimized builds

## Package Manager
- **npm**: Primary package manager
- **bun.lock**: Bun compatibility
