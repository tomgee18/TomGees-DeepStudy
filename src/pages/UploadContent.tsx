import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, Clipboard, Loader2 } from "lucide-react";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";

interface UploadContentProps {
  onProcessComplete?: (chunks: string[]) => void;
}

const UploadContent = ({ onProcessComplete }: UploadContentProps) => {
  const [pastedText, setPastedText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    showSuccess(`${acceptedFiles.length} file(s) added for upload.`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    multiple: true,
  });

  const handleProcessContent = async () => {
    if (uploadedFiles.length === 0 && pastedText.trim() === "") {
      showError("Please upload files or paste text to process.");
      return;
    }

    setIsProcessing(true);
    const loadingToastId = showLoading("Processing your content...");

    try {
      // Prepare files data for the edge function
      const filesData = uploadedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      }));

      // Call the Supabase Edge Function for document processing
      const { data, error } = await supabase.functions.invoke('process-document', {
        body: { 
          files: filesData, 
          text: pastedText 
        },
      });

      if (error) {
        throw error;
      }

      showSuccess(`Content processed successfully! Created ${data.chunks_count} chunks.`);
      dismissToast(loadingToastId);

      // Call the callback if provided
      if (onProcessComplete && data.chunks) {
        onProcessComplete(data.chunks);
      }

      // Reset state after processing
      setUploadedFiles([]);
      setPastedText("");
      
    } catch (error) {
      console.error("Error processing content:", error);
      showError("Failed to process content. Please try again.");
      dismissToast(loadingToastId);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">Upload Your Study Materials</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Upload documents (PDF, DOCX, TXT) or paste text to begin your deep study journey.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <FileUp className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>Drag & drop your documents here, or click to select files.</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors duration-200"
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-blue-500">Drop the files here ...</p>
                ) : (
                  <p className="text-muted-foreground">
                    Drag 'n' drop some files here, or click to select files
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Supported formats: PDF, DOCX, TXT
                </p>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-semibold mb-2">Files to upload:</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {uploadedFiles.map((file, index) => (
                      <li key={index}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clipboard className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle>Paste Text</CardTitle>
              <CardDescription>Paste any text content directly into the box below.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your study notes, article content, or any text here..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                rows={10}
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button 
            size="lg" 
            onClick={handleProcessContent} 
            disabled={isProcessing || (uploadedFiles.length === 0 && pastedText.trim() === "")}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Process Content"
            )}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default UploadContent;