import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send } from "lucide-react";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") {
      showError("Please enter a message.");
      return;
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage("");
    setIsLoading(true);
    const loadingToastId = showLoading("AI is thinking...");

    try {
      // In a real application, you would send the user's message and relevant context
      // (e.g., processed document ID) to a Supabase Edge Function.
      // For now, we'll simulate an AI response.
      const { data, error } = await supabase.functions.invoke('chat-response', {
        body: { message: inputMessage },
      });

      if (error) {
        throw error;
      }

      const aiResponse: Message = {
        id: Date.now().toString() + "-ai",
        text: data.response || "I'm sorry, I couldn't process that request.",
        sender: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      showSuccess("AI responded!");

    } catch (error) {
      console.error("Error getting AI response:", error);
      showError("Failed to get AI response. Please try again.");
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        text: "Error: Could not get a response from the AI. Please try again.",
        sender: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      dismissToast(loadingToastId);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 h-full flex flex-col">
        <h1 className="text-4xl font-bold mb-4 text-primary">Contextual Chat</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Chat with AI about your study materials for deeper understanding.
        </p>

        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-orange-500" /> AI Study Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-4">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-10">
                    Start a conversation! Type your question below.
                  </div>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="flex w-full space-x-2">
              <Input
                placeholder="Ask a question about your content..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Chat;