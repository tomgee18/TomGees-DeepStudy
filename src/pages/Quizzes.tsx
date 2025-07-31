import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, PlusCircle } from "lucide-react";
import { showSuccess } from "@/utils/toast";

const Quizzes = () => {
  const handleGenerateQuiz = () => {
    // In a real application, this would trigger an AI function to generate a quiz
    // based on uploaded content or a given topic.
    showSuccess("Quiz generation feature coming soon!");
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">AI-Generated Quizzes</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Test your understanding with custom quizzes generated from your study materials.
        </p>

        <Card className="w-full max-w-3xl mx-auto min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
          <CardHeader>
            <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle className="text-3xl">Generate Your First Quiz</CardTitle>
            <CardDescription className="mt-2">
              Click the button below to generate a quiz from your processed content or a new topic.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <Button onClick={handleGenerateQuiz} className="mt-4">
              <PlusCircle className="h-5 w-5 mr-2" /> Generate Quiz
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              (This feature will use AI to create interactive quizzes based on your study material.)
            </p>
          </CardContent>
        </Card>

        {/* Placeholder for where the quiz interface would appear */}
        <div className="mt-8 p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center text-muted-foreground min-h-[300px] flex items-center justify-center">
          Your quiz will appear here.
        </div>
      </div>
    </MainLayout>
  );
};

export default Quizzes;