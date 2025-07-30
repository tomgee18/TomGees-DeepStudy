import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Removed CardDescription
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCcw, Lightbulb } from "lucide-react";
import { showSuccess } from "@/utils/toast"; // Removed showError

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
  const [flashcards] = useState<Flashcard[]>(sampleFlashcards); // Removed setFlashcards as it's not currently used
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

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

  const handleGenerateFlashcards = () => {
    // In a real application, this would trigger an AI function to generate flashcards
    // based on uploaded content. For now, we'll just show a success message.
    showSuccess("Flashcard generation feature coming soon!");
    // You might want to clear existing flashcards or add new ones here
    // setFlashcards([]);
  };

  if (flashcards.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-primary">Flashcards</h1>
          <p className="text-lg text-muted-foreground mb-8">
            No flashcards available. Upload content and generate some!
          </p>
          <Button onClick={handleGenerateFlashcards}>
            Generate Flashcards
          </Button>
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
            <Button variant="outline" size="sm" onClick={handleGenerateFlashcards}>
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