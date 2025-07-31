# Technology Stack

## Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6.3.4
- **Styling**: Tailwind CSS with shadcn/ui components
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: React Router v6
- **Theme**: next-themes for dark/light mode
- **Icons**: Lucide React

## Backend
- **Platform**: Supabase Edge Functions (Deno runtime)
- **AI Providers**: Google Gemini API, OpenRouter API
- **File Processing**: Multi-format document processing (PDF, DOCX, TXT, MD, RTF)

## Development Tools
- **Linting**: ESLint with TypeScript support
- **Package Manager**: pnpm (preferred)
- **Component Tagging**: @dyad-sh/react-vite-component-tagger

## Common Commands

### Development
```bash
pnpm dev              # Start development server (localhost:8080)
pnpm build            # Production build
pnpm build:dev        # Development build
pnpm preview          # Preview production build
```

### Code Quality
```bash
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues automatically
pnpm type-check       # Run TypeScript type checking
```

### Supabase Functions
```bash
supabase functions deploy <function-name>    # Deploy specific function
supabase functions deploy                    # Deploy all functions
supabase secrets set KEY=value              # Set environment secrets
```

## Key Dependencies
- **Form Handling**: react-hook-form with @hookform/resolvers and zod validation
- **File Upload**: react-dropzone for drag-and-drop file handling
- **Date Handling**: date-fns for date manipulation
- **Charts**: recharts for data visualization
- **Notifications**: sonner for toast notifications
- **Carousel**: embla-carousel-react for image/content carousels