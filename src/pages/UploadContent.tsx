import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, Clipboard, Loader2, X } from "lucide-react";
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

  const removeFile = (indexToRemove: number) => {
    setUploadedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    showSuccess("File removed.");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/rtf': ['.rtf'],
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB limit per file
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(rejection => {
        if (rejection.errors.some(e => e.code === 'file-too-large')) {
          showError(`File ${rejection.file.name} is too large. Maximum size is 10MB.`);
        } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
          showError(`File ${rejection.file.name} has an unsupported format.`);
        }
      });
    },
  });

  const handleProcessContent = async () => {
    if (uploadedFiles.length === 0 && pastedText.trim() === "") {
      showError("Please upload files or paste text to process.");
      return;
    }

    setIsProcessing(true);
    const loadingToastId = showLoading("Processing your content...");

    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add text content
      if (pastedText.trim()) {
        formData.append('text', pastedText);
      }
      
      // Add files
      uploadedFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      // Call the Supabase Edge Function with FormData
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-document`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process content');
      }

      const data = await response.json();

      showSuccess(`Content processed successfully! Created ${data.chunks_count} chunks from ${Math.round(data.total_size / 1024)}KB of content.`);
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
      showError(error instanceof Error ? error.message : "Failed to process content. Please try again.");
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
                  Supported formats: PDF, DOCX, TXT, MD, RTF (Max 10MB per file)
                </p>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-semibold mb-2">Files to upload:</h3>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span className="text-sm">
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
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