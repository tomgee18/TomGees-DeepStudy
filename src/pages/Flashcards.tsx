import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, RotateCcw, Lightbulb, Plus } from "lucide-react";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { ModelPicker } from "@/components/model-picker";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

const sampleFlashcards: Flashcard[] = [
  { id: "1", question: "What is the capital of France?", answer: "Paris" },
  { id: "2", question: "What is the chemical symbol for water?", answer: "H2O" },
  { id: "3", question: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare" },
  { id: "4", question: "What is the largest planet in our solar system?", answer: "Jupiter" },
];

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(sampleFlashcards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
  const [isLoading, setIsLoading] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  const handleNextCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePreviousCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) =>
      prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
    );
  };

  const handleFlipCard = () => {
    setShowAnswer((prev) => !prev);
  };

  const handleGenerateFlashcards = async () => {
    if (inputText.trim() === "") {
      showError("Please enter text to generate flashcards from.");
      return;
    }

    setIsLoading(true);
    const loadingToastId = showLoading("Generating flashcards...");

    try {
      const { data, error } = await supabase.functions.invoke('generate-flashcards', {
        body: { text: inputText, model: selectedModel, count: 5 },
      });

      if (error) {
        throw error;
      }

      const newFlashcards = data.flashcards.map((card: any, index: number) => ({
        id: `generated-${Date.now()}-${index}`,
        question: card.question,
        answer: card.answer,
      }));

      setFlashcards(newFlashcards);
      setCurrentCardIndex(0);
      setShowAnswer(false);
      setShowGenerator(false);
      showSuccess(`Generated ${newFlashcards.length} flashcards successfully!`);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      showError("Failed to generate flashcards. Please try again.");
    } finally {
      setIsLoading(false);
      dismissToast(loadingToastId);
    }
  };

  if (flashcards.length === 0 || showGenerator) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <h1 className="text-4xl font-bold mb-4 text-primary">Flashcards</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Generate AI-powered flashcards from your study content.
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-6 w-6" />
                Generate Flashcards
              </CardTitle>
              <CardDescription>
                Enter your study content below to generate flashcards automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your study notes, article content, or any text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={10}
                className="w-full mb-4"
                disabled={isLoading}
              />
              <div className="flex gap-4 items-end">
                <ModelPicker
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  className="flex-1"
                />
                <div className="flex gap-2">
                  {flashcards.length > 0 && (
                    <Button variant="outline" onClick={() => setShowGenerator(false)}>
                      Back to Cards
                    </Button>
                  )}
                  <Button onClick={handleGenerateFlashcards} disabled={isLoading}>
                    {isLoading ? "Generating..." : "Generate Flashcards"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const currentCard = flashcards[currentCardIndex];

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">Flashcards</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Test your knowledge with AI-generated flashcards.
        </p>

        <Card className="w-full max-w-2xl mx-auto min-h-[300px] flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">
              <Lightbulb className="inline-block mr-2 h-6 w-6 text-yellow-500" />
              Flashcard {currentCardIndex + 1} / {flashcards.length}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowGenerator(true)}>
              Generate New
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center p-6 text-center">
            <div className="text-3xl font-semibold text-foreground">
              {showAnswer ? currentCard.answer : currentCard.question}
            </div>
          </CardContent>
          <div className="flex justify-center gap-4 p-4 border-t">
            <Button variant="outline" onClick={handlePreviousCard}>
              <ArrowLeft className="h-5 w-5 mr-2" /> Previous
            </Button>
            <Button onClick={handleFlipCard}>
              <RotateCcw className="h-5 w-5 mr-2" /> Flip
            </Button>
            <Button onClick={handleNextCard}>
              Next <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Flashcards;