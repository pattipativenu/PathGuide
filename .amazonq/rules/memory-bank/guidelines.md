# PathGuide AI Dashboard - Development Guidelines

## Code Quality Standards

### TypeScript Configuration
- **Strict Mode**: Enabled with strict type checking
- **Target**: ES2017 for modern JavaScript features
- **Module System**: ESNext with bundler resolution
- **Path Aliases**: Use `@/*` for imports from `src/` directory
- **Type Safety**: All components and functions should have explicit types

### File Organization
- **Client Components**: Mark with `"use client"` directive at the top
- **Component Files**: One primary component per file with related helpers
- **Naming Convention**: PascalCase for components, camelCase for utilities
- **File Extensions**: `.tsx` for React components, `.ts` for utilities

### Code Formatting
- **Semicolons**: Not required (project uses ASI)
- **Quotes**: Double quotes for strings
- **Indentation**: 2 spaces consistently
- **Line Length**: Keep reasonable, break long lines for readability
- **Trailing Commas**: Used in multiline arrays and objects

## React and Next.js Patterns

### Component Structure
```typescript
"use client"

import { useState, useEffect } from "react"
import { ComponentProps } from "react"

// Type definitions first
interface MyComponentProps {
  prop1: string
  prop2?: number
}

// Main component
export default function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // State declarations
  const [state, setState] = useState<Type>(initialValue)
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies])
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  }
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

### State Management
- **useState**: Primary hook for local component state
- **useRef**: For DOM references and mutable values that don't trigger re-renders
- **useEffect**: For side effects, cleanup, and subscriptions
- **useMemo/useCallback**: For performance optimization when needed
- **State Initialization**: Use function form for expensive initial state

### API Route Patterns
- **Location**: `src/app/api/[feature]/route.ts`
- **Method**: POST for data mutations and complex queries
- **Headers**: Always set `Content-Type: application/json`
- **Error Handling**: Try-catch blocks with appropriate error responses
- **Response Format**: Consistent JSON structure with type field

Example:
```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Process request
    return Response.json({ type: 'success', data: result })
  } catch (error) {
    return Response.json({ error: 'Message' }, { status: 500 })
  }
}
```

## UI Component Patterns

### shadcn/ui Integration
- **Import Pattern**: Import from `@/components/ui/[component]`
- **Customization**: Extend base components with additional props
- **Composition**: Build complex UIs by composing primitive components
- **Variants**: Use `class-variance-authority` for component variants

Example:
```typescript
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

<Button variant="outline" size="sm" onClick={handleClick}>
  Click Me
</Button>
```

### Styling Approach
- **Tailwind CSS**: Primary styling method with utility classes
- **Inline Styles**: Only for dynamic values (colors, dimensions)
- **CSS Variables**: For theme values and reusable properties
- **Conditional Classes**: Use `cn()` utility from `@/lib/utils`

Example:
```typescript
import { cn } from "@/lib/utils"

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className
)}>
```

### Animation Patterns
- **Framer Motion**: For complex animations and transitions
- **CSS Transitions**: For simple hover and state changes
- **Tailwind Animate**: For predefined animations
- **Duration**: 300ms standard, 500ms for complex transitions

Example:
```typescript
className="transition-all duration-300 hover:scale-[1.02]"
```

## Data Fetching Patterns

### Client-Side Fetching
```typescript
const [loading, setLoading] = useState(false)

const fetchData = async () => {
  setLoading(true)
  try {
    const response = await fetch("/api/endpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const result = await response.json()
    // Handle result
  } catch (error) {
    console.error("Error:", error)
  }
  setLoading(false)
}
```

### Loading States
- **Boolean Flags**: `loading`, `isLoading` for async operations
- **UI Feedback**: Show spinners, skeletons, or disabled states
- **Error Handling**: Display user-friendly error messages
- **Optimistic Updates**: Update UI before server confirmation when appropriate

## TypeScript Patterns

### Interface Definitions
- **Props Interfaces**: Define before component
- **Data Models**: Separate interfaces for API responses
- **Utility Types**: Use built-in types (Partial, Pick, Omit)
- **Generic Types**: For reusable components and functions

Example:
```typescript
interface User {
  id: string
  name: string
  email: string
}

interface ApiResponse<T> {
  type: string
  data: T
  error?: string
}
```

### Type Assertions
- **Minimal Use**: Prefer type guards and narrowing
- **DOM Elements**: Use type assertions for event targets
- **API Responses**: Validate and type responses properly

## Event Handling

### Event Handlers
- **Naming**: Prefix with `handle` (handleClick, handleSubmit)
- **Inline vs Defined**: Define separately for complex logic
- **Event Types**: Use proper React event types
- **Prevent Default**: Call when needed for forms and links

Example:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  // Submit logic
}

<form onSubmit={handleSubmit}>
```

### Keyboard Events
- **Enter Key**: Check `e.key === "Enter"` for submission
- **Modifiers**: Check `e.metaKey` or `e.ctrlKey` for shortcuts
- **Prevent Propagation**: Use when needed to stop event bubbling

## Performance Optimization

### Memoization
- **useMemo**: For expensive calculations
- **useCallback**: For functions passed to child components
- **React.memo**: For components that render often with same props

### Lazy Loading
- **Dynamic Imports**: For large components not needed immediately
- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Use Next.js Image component when possible

### State Updates
- **Batch Updates**: React automatically batches in event handlers
- **Functional Updates**: Use when new state depends on previous
- **Avoid Unnecessary Re-renders**: Split state when possible

## Error Handling

### Try-Catch Blocks
- **API Calls**: Always wrap in try-catch
- **User Feedback**: Show error messages to users
- **Console Logging**: Log errors for debugging
- **Graceful Degradation**: Provide fallback UI

### Error Boundaries
- **Global Error Handler**: `global-error.tsx` for app-level errors
- **Component-Level**: ErrorReporter component for specific features

## Accessibility

### Semantic HTML
- **Proper Tags**: Use button, nav, main, header, footer
- **ARIA Labels**: Add when semantic HTML isn't enough
- **Alt Text**: Always provide for images
- **Focus Management**: Ensure keyboard navigation works

### Interactive Elements
- **Buttons**: Use button element, not div with onClick
- **Links**: Use anchor tags for navigation
- **Forms**: Proper label associations
- **Keyboard Support**: All interactive elements accessible via keyboard

## Custom Hooks

### Hook Patterns
- **Naming**: Prefix with `use` (useMobile, useChart)
- **Location**: `src/hooks/` or `src/lib/hooks/`
- **Reusability**: Extract common logic into hooks
- **Dependencies**: Properly declare in dependency arrays

Example:
```typescript
export function useCustomHook() {
  const [state, setState] = useState()
  
  useEffect(() => {
    // Effect logic
  }, [])
  
  return { state, setState }
}
```

## Visual Editing System

### Component Tagging
- **Loader**: Custom webpack loader tags JSX elements
- **Attributes**: `data-orchids-id` and `data-orchids-name` added automatically
- **Context Tracking**: Map contexts and variable references tracked
- **Blacklists**: Three.js and Drei components excluded from tagging

### Visual Edit Mode
- **State Management**: localStorage persistence for edit mode
- **Element Selection**: Click to focus, hover to preview
- **Style Editing**: Inline style changes with parent sync
- **Text Editing**: contentEditable for text nodes
- **Image Editing**: Direct src attribute updates

## Code Comments

### When to Comment
- **Complex Logic**: Explain non-obvious algorithms
- **Workarounds**: Document why unusual approaches are needed
- **TODOs**: Mark future improvements
- **API Contracts**: Document expected data structures

### When Not to Comment
- **Obvious Code**: Self-explanatory code doesn't need comments
- **Redundant Info**: Don't repeat what code clearly shows
- **Outdated Comments**: Remove or update stale comments

## Testing Considerations

### Manual Testing
- **Browser Testing**: Test in Chrome, Safari, Firefox
- **Mobile Testing**: Verify responsive behavior
- **Edge Cases**: Test with empty states, errors, loading
- **User Flows**: Complete end-to-end scenarios

### Code Review
- **Type Safety**: Ensure proper TypeScript usage
- **Performance**: Check for unnecessary re-renders
- **Accessibility**: Verify keyboard and screen reader support
- **Error Handling**: Confirm graceful error handling
