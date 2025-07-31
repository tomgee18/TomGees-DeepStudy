import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const Help = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">Help & Support</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Find answers to common questions and get support for using TomGees-DeepStudy.
        </p>

        <Card className="w-full max-w-3xl mx-auto min-h-[200px] flex flex-col items-center justify-center p-6 text-center">
          <CardHeader>
            <HelpCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <CardTitle className="text-3xl">How Can We Help?</CardTitle>
            <CardDescription className="mt-2">
              This page will contain FAQs, tutorials, and contact information for support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mt-4">
              (Look for guides on uploading content, using AI tools, and troubleshooting.)
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Help;