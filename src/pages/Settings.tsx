import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">Settings</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Manage your application preferences and account settings.
        </p>

        <Card className="w-full max-w-3xl mx-auto min-h-[200px] flex flex-col items-center justify-center p-6 text-center">
          <CardHeader>
            <SettingsIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <CardTitle className="text-3xl">Application Settings</CardTitle>
            <CardDescription className="mt-2">
              This page will allow you to configure various aspects of the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mt-4">
              (Features like API key management, profile settings, etc., will be added here.)
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Settings;