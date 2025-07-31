import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  HelpCircle, 
  FileUp, 
  Brain, 
  MessageSquare, 
  Zap, 
  BookOpen,
  ChevronDown,
  ChevronRight,
  Search,
  ExternalLink
} from "lucide-react";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openSections, setOpenSections] = useState<string[]>(["getting-started"]);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const faqSections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <BookOpen className="h-5 w-5" />,
      items: [
        {
          question: "How do I upload documents?",
          answer: "Go to the Upload Content page and either drag & drop files or click to select them. Supported formats include PDF, DOCX, TXT, MD, and RTF files up to 10MB each."
        },
        {
          question: "What AI models are available?",
          answer: "We support multiple AI providers: Gemini (1.5 Flash, 1.5 Pro, 1.0 Pro), OpenRouter (Claude 3.5 Sonnet, GPT-4o, GPT-4o Mini, Llama 3.1 70B). You can select your preferred model for each task."
        },
        {
          question: "How does document processing work?",
          answer: "Your documents are split into optimized chunks with overlap for better context preservation. This allows the AI to understand and work with your content more effectively."
        }
      ]
    },
    {
      id: "features",
      title: "Features & Tools",
      icon: <Brain className="h-5 w-5" />,
      items: [
        {
          question: "How do I generate summaries?",
          answer: "After uploading a document, go to the Summarize page. The AI will automatically use your uploaded content, or you can paste new text to summarize."
        },
        {
          question: "Can I create flashcards from my documents?",
          answer: "Yes! The Flashcards page will generate interactive flashcards from your uploaded content. You can flip cards, navigate between them, and generate new sets."
        },
        {
          question: "How do quizzes work?",
          answer: "The Quiz feature creates multiple-choice questions from your content. Answer all questions to see your score and get feedback on correct/incorrect answers."
        },
        {
          question: "What are mind maps?",
          answer: "Mind maps create visual hierarchical representations of your content, showing main topics and subtopics in an organized tree structure."
        }
      ]
    },
    {
      id: "chat",
      title: "AI Chat",
      icon: <MessageSquare className="h-5 w-5" />,
      items: [
        {
          question: "How does the chat feature work?",
          answer: "The chat allows you to have conversations with AI about your uploaded content. Ask questions, request explanations, or discuss concepts from your documents."
        },
        {
          question: "Can I change AI models during chat?",
          answer: "Yes, click the settings icon in the chat header to select a different AI model. Each model has different strengths and capabilities."
        }
      ]
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: <Zap className="h-5 w-5" />,
      items: [
        {
          question: "My file upload failed. What should I do?",
          answer: "Check that your file is under 10MB and in a supported format (PDF, DOCX, TXT, MD, RTF). If the problem persists, try refreshing the page or using a different browser."
        },
        {
          question: "The AI is not responding or giving errors.",
          answer: "This might be due to API rate limits or temporary service issues. Try again in a few minutes, or switch to a different AI model."
        },
        {
          question: "My generated content seems incomplete.",
          answer: "Some AI models have token limits. Try breaking your content into smaller chunks or using a model with higher token limits like Gemini 1.5 Pro."
        },
        {
          question: "How do I clear my data?",
          answer: "Go to Settings > Data Management and click 'Clear All Data'. This will remove all stored documents and reset the application."
        }
      ]
    }
  ];

  const filteredSections = faqSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      searchQuery === "" || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <MainLayout>
      <div className="container mx-auto py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 text-primary">Help & Support</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Find answers to common questions and learn how to use Swift Alpaca Glow effectively.
        </p>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>Get up and running in minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <FileUp className="h-6 w-6" />
                <span className="text-sm">1. Upload Content</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Brain className="h-6 w-6" />
                <span className="text-sm">2. Choose AI Tool</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Zap className="h-6 w-6" />
                <span className="text-sm">3. Generate Content</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                <span className="text-sm">4. Chat & Learn</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Sections */}
        <div className="space-y-4">
          {filteredSections.map((section) => (
            <Card key={section.id}>
              <Collapsible
                open={openSections.includes(section.id)}
                onOpenChange={() => toggleSection(section.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {section.icon}
                        {section.title}
                      </div>
                      {openSections.includes(section.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {section.items.map((item, index) => (
                        <div key={index} className="border-l-2 border-muted pl-4">
                          <h4 className="font-semibold mb-2">{item.question}</h4>
                          <p className="text-muted-foreground text-sm">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Still Need Help?
            </CardTitle>
            <CardDescription>
              Can't find what you're looking for? Get in touch with our support team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View Documentation
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Help;