"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Home, FileText, Brain, Zap, MessageSquare, Clock, Settings, BookOpen, Lightbulb, HelpCircle } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
      }}
      className="h-screen items-stretch"
    >
      <ResizablePanel
        defaultSize={isCollapsed ? 4 : 18}
        collapsedSize={4}
        collapsible={true}
        minSize={15}
        maxSize={20}
        onCollapse={() => setIsCollapsed(true)}
        onExpand={() => setIsCollapsed(false)}
        className={cn(
          "flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out"
        )}
      >
        <div className="flex h-16 items-center justify-center px-4">
          <h1 className="text-xl font-bold text-primary">
            {isCollapsed ? "TD" : "TomGees-DeepStudy"}
          </h1>
        </div>
        <Separator />
        <ScrollArea className="flex-1 py-4">
          <TooltipProvider>
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to="/"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      !isCollapsed && "justify-start"
                    )}
                  >
                    <Home className="h-5 w-5" />
                    {!isCollapsed && "Dashboard"}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Dashboard</TooltipContent>}
              </Tooltip>

              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to="/upload"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      !isCollapsed && "justify-start"
                    )}
                  >
                    <FileText className="h-5 w-5" />
                    {!isCollapsed && "Upload Content"}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Upload Content</TooltipContent>}
              </Tooltip>

              <Separator className="my-2" />

              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to="/summarize"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      !isCollapsed && "justify-start"
                    )}
                  >
                    <BookOpen className="h-5 w-5" />
                    {!isCollapsed && "Summarize"}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Summarize</TooltipContent>}
              </Tooltip>

              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to="/flashcards"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      !isCollapsed && "justify-start"
                    )}
                  >
                    <Lightbulb className="h-5 w-5" />
                    {!isCollapsed && "Flashcards"}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Flashcards</TooltipContent>}
              </Tooltip>

              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to="/mindmap"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      !isCollapsed && "justify-start"
                    )}
                  >
                    <Brain className="h-5 w-5" />
                    {!isCollapsed && "Mind Map"}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Mind Map</TooltipContent>}
              </Tooltip>

              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to="/quizzes"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      !isCollapsed && "justify-start"
                    )}
                  >
                    <Zap className="h-5 w-5" />
                    {!isCollapsed && "Quizzes"}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Quizzes</TooltipContent>}
              </Tooltip>

              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to="/chat"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      !isCollapsed && "justify-start"
                    )}
                  >
                    <MessageSquare className="h-5 w-5" />
                    {!isCollapsed && "Chat"}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Chat</TooltipContent>}
              </Tooltip>

              <Separator className="my-2" />

              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to="/pomodoro"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      !isCollapsed && "justify-start"
                    )}
                  >
                    <Clock className="h-5 w-5" />
                    {!isCollapsed && "Pomodoro"}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Pomodoro</TooltipContent>}
              </Tooltip>

              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to="/settings"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      !isCollapsed && "justify-start"
                    )}
                  >
                    <Settings className="h-5 w-5" />
                    {!isCollapsed && "Settings"}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Settings</TooltipContent>}
              </Tooltip>

              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to="/help"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      !isCollapsed && "justify-start"
                    )}
                  >
                    <HelpCircle className="h-5 w-5" />
                    {!isCollapsed && "Help"}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Help</TooltipContent>}
              </Tooltip>
            </nav>
          </TooltipProvider>
        </ScrollArea>
        <div className="p-4 flex justify-center">
          <ModeToggle />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={82}>
        <ScrollArea className="h-full p-6">
          {children}
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}