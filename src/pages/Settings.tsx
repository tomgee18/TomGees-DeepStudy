import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, User, Palette, Database, Bell, Shield, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useDocument } from "@/contexts/DocumentContext";
import { showSuccess, showError } from "@/utils/toast";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { clearDocument, currentDocument } = useDocument();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [defaultModel, setDefaultModel] = useState("gemini-1.5-flash");

  const handleClearAllData = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      clearDocument();
      localStorage.clear();
      showSuccess("All data cleared successfully.");
    }
  };

  const handleExportData = () => {
    if (!currentDocument) {
      showError("No document data to export.");
      return;
    }

    const dataToExport = {
      document: currentDocument,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swift-alpaca-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSuccess("Data exported successfully.");
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 text-primary">Settings</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Manage your application preferences and account settings.
        </p>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme-select">Theme</Label>
                  <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                </div>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* AI Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                AI Preferences
              </CardTitle>
              <CardDescription>
                Configure your AI model preferences and behavior.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="default-model">Default AI Model</Label>
                  <p className="text-sm text-muted-foreground">Your preferred model for new tasks</p>
                </div>
                <Select value={defaultModel} onValueChange={setDefaultModel}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                    <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                    <SelectItem value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                    <SelectItem value="openai/gpt-4o">GPT-4o</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Application Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Application
              </CardTitle>
              <CardDescription>
                General application settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications for completed tasks</p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-save">Auto-save Progress</Label>
                  <p className="text-sm text-muted-foreground">Automatically save your work</p>
                </div>
                <Switch
                  id="auto-save"
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Manage your stored data and documents.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Current Document</Label>
                  <p className="text-sm text-muted-foreground">
                    {currentDocument ? `${currentDocument.fileName} (${currentDocument.chunksCount} chunks)` : "No document loaded"}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleExportData}
                  disabled={!currentDocument}
                >
                  Export Data
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Clear All Data</Label>
                  <p className="text-sm text-muted-foreground">Remove all stored documents and settings</p>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={handleClearAllData}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Your privacy and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>• Your documents are processed securely and not stored permanently on our servers.</p>
                <p>• AI processing is done through encrypted connections to Google AI and OpenRouter.</p>
                <p>• Local data is stored in your browser and can be cleared at any time.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;