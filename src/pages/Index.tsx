import { MainLayout } from "@/components/layout/main-layout";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, Lightbulb, Brain, Zap, MessageSquare, Clock } from "lucide-react";

const Index = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl mb-4 text-primary">
            TomGees-DeepStudy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock deeper understanding and recall with intelligent AI tools for students and lifelong learners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <FileText className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>Upload & Process</CardTitle>
              <CardDescription>Upload your study materials (PDF, DOCX, TXT) or paste content.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/upload">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <Lightbulb className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle>Flashcards & Summaries</CardTitle>
              <CardDescription>Generate spaced-repetition flashcards and concise summaries.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/flashcards">Explore Tools</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <Brain className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle>Mind Maps & Quizzes</CardTitle>
              <CardDescription>Visualize concepts with mind maps and test knowledge with auto-graded quizzes.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/mindmap">Start Learning</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-orange-500 mb-2" />
              <CardTitle>Contextual Chat</CardTitle>
              <CardDescription>Engage in AI chat with your document's context for deeper understanding.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/chat">Chat Now</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <Clock className="h-8 w-8 text-red-500 mb-2" />
              <CardTitle>Pomodoro Timer</CardTitle>
              <CardDescription>Boost focus and productivity with built-in Pomodoro sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/pomodoro">Focus Up</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
            <CardHeader>
              <Zap className="h-8 w-8 text-yellow-500 mb-2" />
              <CardTitle>AI Powered</CardTitle>
              <CardDescription>Leveraging Gemini and OpenRouter APIs for intelligent insights.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                (API key setup required for full functionality)
              </p>
            </CardContent>
          </Card>
        </div>
        <MadeWithDyad />
      </div>
    </MainLayout>
  );
};

export default Index;