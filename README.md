# Swift Alpaca Glow - AI Study Assistant

A modern, AI-powered study assistant built with React, TypeScript, and Supabase. Transform your study materials into interactive flashcards, summaries, quizzes, mind maps, and engage in contextual chat with AI.

## ✨ Features

### 🤖 AI-Powered Study Tools
- **Smart Summarization**: Generate concise summaries from any text content
- **Interactive Flashcards**: Create AI-generated flashcards for active recall
- **Dynamic Quizzes**: Generate multiple-choice quizzes to test understanding
- **Mind Maps**: Visualize concepts with AI-generated mind maps
- **Contextual Chat**: Chat with AI about your study materials

### 🎯 Core Functionality
- **Content Upload**: Support for text input and file uploads
- **Model Selection**: Choose from multiple AI models (Gemini 1.5 Flash, Pro, 1.0 Pro)
- **Dark/Light Theme**: Seamless theme switching
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Processing**: Fast AI-powered content generation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- Google AI (Gemini) API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd swift-alpaca-glow
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   
   Create `.env.local` file:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Supabase Setup**
   
   Deploy the Edge Functions:
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Link your project
   supabase link --project-ref your-project-ref
   
   # Deploy functions
   supabase functions deploy summarize
   supabase functions deploy chat-response
   supabase functions deploy generate-flashcards
   supabase functions deploy generate-quiz
   supabase functions deploy generate-mindmap
   ```

5. **Set Supabase Secrets**
   ```bash
   supabase secrets set GEMINI_API_KEY=your-gemini-api-key
   ```

6. **Start Development Server**
   ```bash
   pnpm dev
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components
│   ├── model-picker.tsx # AI model selection
│   └── theme-provider.tsx
├── pages/              # Application pages
│   ├── Index.tsx       # Dashboard/Home
│   ├── UploadContent.tsx
│   ├── Summarize.tsx
│   ├── Flashcards.tsx
│   ├── Quizzes.tsx
│   ├── MindMap.tsx
│   ├── Chat.tsx
│   └── Settings.tsx
├── integrations/       # External service integrations
│   └── supabase/
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── utils/              # Helper functions

supabase/
└── functions/          # Edge Functions
    ├── summarize/
    ├── chat-response/
    ├── generate-flashcards/
    ├── generate-quiz/
    └── generate-mindmap/
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm type-check` - Run TypeScript type checking
- `pnpm preview` - Preview production build

## 🤖 AI Models

The application supports multiple Gemini AI models:

- **Gemini 1.5 Flash** - Fast and efficient for most tasks
- **Gemini 1.5 Pro** - More capable for complex reasoning
- **Gemini 1.0 Pro** - Reliable baseline model

## 📚 API Documentation

### Edge Functions

#### `/summarize`
Generates concise summaries from text content.

**Request:**
```json
{
  "text": "Content to summarize",
  "model": "gemini-1.5-flash"
}
```

**Response:**
```json
{
  "summary": "Generated summary text"
}
```

#### `/generate-flashcards`
Creates flashcards from study content.

**Request:**
```json
{
  "text": "Study content",
  "model": "gemini-1.5-flash",
  "count": 5
}
```

**Response:**
```json
{
  "flashcards": [
    {
      "question": "Question text",
      "answer": "Answer text"
    }
  ]
}
```

#### `/generate-quiz`
Generates multiple-choice quizzes.

**Request:**
```json
{
  "text": "Content for quiz",
  "model": "gemini-1.5-flash",
  "questionCount": 5
}
```

**Response:**
```json
{
  "questions": [
    {
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0
    }
  ]
}
```

#### `/generate-mindmap`
Creates hierarchical mind map structures.

**Request:**
```json
{
  "text": "Content for mind map",
  "model": "gemini-1.5-flash"
}
```

**Response:**
```json
{
  "mindMap": {
    "id": "root",
    "label": "Main Topic",
    "level": 0,
    "children": []
  }
}
```

#### `/chat-response`
Provides contextual AI chat responses.

**Request:**
```json
{
  "message": "User question",
  "model": "gemini-1.5-flash"
}
```

**Response:**
```json
{
  "response": "AI response text"
}
```

## 🎨 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **Backend**: Supabase Edge Functions
- **AI**: Google Gemini API
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Theme**: next-themes
- **Icons**: Lucide React

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `GEMINI_API_KEY` | Google AI API key (Supabase secret) | Yes |

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build command: `pnpm build`
2. Publish directory: `dist`
3. Set environment variables in Netlify dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Google AI](https://ai.google.dev/) for the Gemini API
- [Lucide](https://lucide.dev/) for the icon set
