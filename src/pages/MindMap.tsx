import React, { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, PlusCircle, FileText } from "lucide-react";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { useDocument } from "@/contexts/DocumentContext";
import { ModelPicker } from "@/components/model-picker";

interface MindMapNode {
  id: string;
  label: string;
  level: number;
  children?: MindMapNode[];
}

const MindMapNodeComponent = React.memo(({ node, depth }: { node: MindMapNode; depth: number }) => {
  const colors = ['bg-blue-100 border-blue-300', 'bg-green-100 border-green-300', 'bg-yellow-100 border-yellow-300', 'bg-purple-100 border-purple-300'];
  const colorClass = colors[depth % colors.length];
  
  return (
    <div className={`p-3 rounded-lg border-2 ${colorClass} mb-2`}>
      <div className="font-semibold text-sm">{node.label}</div>
      {node.children && node.children.length > 0 && (
        <div className="ml-4 mt-2 space-y-1">
          {node.children.map(child => (
            <MindMapNodeComponent key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
});

const MindMap = () => {
  const { currentDocument, getDocumentContent, isDocumentLoaded } = useDocument();
  const [mindMap, setMindMap] = useState<MindMapNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
  const [inputText, setInputText] = useState("");
  const [showGenerator, setShowGenerator] = useState(false);

  const handleGenerateMindMap = async () => {
    const textToUse = isDocumentLoaded ? getDocumentContent() : inputText;
    
    if (!textToUse.trim()) {
      showError("Please upload a document or enter text to generate a mind map from.");
      return;
    }

    setIsLoading(true);
    const loadingToastId = showLoading("Generating mind map...");

    try {
      const { data, error } = await supabase.functions.invoke('generate-mindmap', {
        body: { text: textToUse, model: selectedModel },
      });

      if (error) {
        throw error;
      }

      setMindMap(data.mindMap);
      setShowGenerator(false);
      showSuccess("Mind map generated successfully!");
    } catch (error) {
      console.error("Error generating mind map:", error);
      showError("Failed to generate mind map. Please try again.");
    } finally {
      setIsLoading(false);
      dismissToast(loadingToastId);
    }
  };

  // Show mind map generator if no mind map or showGenerator is true
  if (!mindMap || showGenerator) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <h1 className="text-4xl font-bold mb-4 text-primary">Mind Map Generator</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Visualize your study content with AI-generated mind maps.
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
                Generate Mind Map
              </CardTitle>
              <CardDescription>
                {isDocumentLoaded 
                  ? "Generate a mind map from your uploaded document or enter custom text below."
                  : "Enter your study content below to generate a visual mind map."
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
                  {mindMap && (
                    <Button variant="outline" onClick={() => setShowGenerator(false)}>
                      Back to Mind Map
                    </Button>
                  )}
                  <Button onClick={handleGenerateMindMap} disabled={isLoading}>
                    {isLoading ? "Generating..." : "Generate Mind Map"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Show mind map visualization
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-primary">Mind Map</h1>
          <Button variant="outline" onClick={() => setShowGenerator(true)}>
            Generate New Mind Map
          </Button>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-500" />
              {mindMap.label}
            </CardTitle>
            <CardDescription>
              AI-generated mind map visualization of your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto max-h-[600px]">
              <MindMapNodeComponent node={mindMap} depth={0} />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default MindMap;