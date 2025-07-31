import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Zap, PlusCircle, FileText, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { useDocument } from "@/contexts/DocumentContext";
import { ModelPicker } from "@/components/model-picker";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
}

const Quizzes = () => {
  const { currentDocument, getDocumentContent, isDocumentLoaded } = useDocument();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
  const [inputText, setInputText] = useState("");
  const [showGenerator, setShowGenerator] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleGenerateQuiz = async () => {
    const textToUse = isDocumentLoaded ? getDocumentContent() : inputText;
    
    if (!textToUse.trim()) {
      showError("Please upload a document or enter text to generate a quiz from.");
      return;
    }

    setIsLoading(true);
    const loadingToastId = showLoading("Generating quiz questions...");

    try {
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: { text: textToUse, model: selectedModel, questionCount: 5 },
      });

      if (error) {
        throw error;
      }

      setQuestions(data.questions.map((q: any) => ({ ...q, userAnswer: undefined })));
      setCurrentQuestionIndex(0);
      setShowGenerator(false);
      setQuizCompleted(false);
      setScore(0);
      showSuccess(`Generated ${data.questions.length} quiz questions successfully!`);
    } catch (error) {
      console.error("Error generating quiz:", error);
      showError("Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
      dismissToast(loadingToastId);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (quizCompleted) return;
    
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].userAnswer = answerIndex;
    setQuestions(updatedQuestions);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed
      const finalScore = questions.reduce((acc, q) => {
        return acc + (q.userAnswer === q.correctAnswer ? 1 : 0);
      }, 0);
      setScore(finalScore);
      setQuizCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const resetQuiz = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setScore(0);
    setShowGenerator(true);
  };

  // Show quiz completion screen
  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <h1 className="text-4xl font-bold mb-4 text-primary">Quiz Results</h1>
          
          <Card className="w-full max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
              <CardDescription>
                You scored {score} out of {questions.length} questions correct
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-bold mb-4 text-primary">
                {percentage}%
              </div>
              <Badge variant={percentage >= 70 ? "default" : percentage >= 50 ? "secondary" : "destructive"} className="mb-4">
                {percentage >= 70 ? "Great Job!" : percentage >= 50 ? "Good Effort!" : "Keep Studying!"}
              </Badge>
              <div className="flex gap-4 justify-center">
                <Button onClick={resetQuiz}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Take Another Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Show quiz generator if no questions or showGenerator is true
  if (questions.length === 0 || showGenerator) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <h1 className="text-4xl font-bold mb-4 text-primary">AI-Generated Quizzes</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Test your understanding with custom quizzes generated from your study materials.
          </p>

          {isDocumentLoaded && (
            <Card className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <FileText className="h-5 w-5" />
                  Document Loaded
                </CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">
                  {currentDocument?.fileName} • {currentDocument?.chunksCount} chunks
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-6 w-6" />
                Generate Quiz
              </CardTitle>
              <CardDescription>
                {isDocumentLoaded 
                  ? "Generate a quiz from your uploaded document or enter custom text below."
                  : "Enter your study content below to generate quiz questions."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isDocumentLoaded && (
                <Textarea
                  placeholder="Paste your study notes, article content, or any text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={10}
                  className="w-full mb-4"
                  disabled={isLoading}
                />
              )}
              <div className="flex gap-4 items-end">
                <ModelPicker
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  className="flex-1"
                />
                <div className="flex gap-2">
                  {questions.length > 0 && (
                    <Button variant="outline" onClick={() => setShowGenerator(false)}>
                      Back to Quiz
                    </Button>
                  )}
                  <Button onClick={handleGenerateQuiz} disabled={isLoading}>
                    {isLoading ? "Generating..." : "Generate Quiz"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Show quiz interface
  const currentQuestion = questions[currentQuestionIndex];
  const hasAnswered = currentQuestion.userAnswer !== undefined;

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-primary">Quiz</h1>
          <Button variant="outline" onClick={() => setShowGenerator(true)}>
            Generate New Quiz
          </Button>
        </div>

        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Question {currentQuestionIndex + 1} of {questions.length}
              </CardTitle>
              <Badge variant="outline">
                {questions.filter(q => q.userAnswer !== undefined).length} / {questions.length} answered
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={currentQuestion.userAnswer === index ? "default" : "outline"}
                    className="w-full text-left justify-start h-auto p-4"
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                    {hasAnswered && index === currentQuestion.correctAnswer && (
                      <CheckCircle className="h-4 w-4 ml-auto text-green-500" />
                    )}
                    {hasAnswered && currentQuestion.userAnswer === index && index !== currentQuestion.correctAnswer && (
                      <XCircle className="h-4 w-4 ml-auto text-red-500" />
                    )}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button 
                onClick={handleNextQuestion}
                disabled={!hasAnswered}
              >
                {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Quizzes;