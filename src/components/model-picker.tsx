"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Brain } from "lucide-react";

export interface AIModel {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
}

export const availableModels: AIModel[] = [
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    description: "Fast and efficient for most tasks",
    maxTokens: 1000000,
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    description: "More capable for complex reasoning",
    maxTokens: 2000000,
  },
  {
    id: "gemini-1.0-pro",
    name: "Gemini 1.0 Pro",
    description: "Reliable baseline model",
    maxTokens: 30720,
  },
];

interface ModelPickerProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  className?: string;
}

export function ModelPicker({ selectedModel, onModelChange, className }: ModelPickerProps) {
  return (
    <div className={className}>
      <Label htmlFor="model-select" className="flex items-center gap-2 text-sm font-medium mb-2">
        <Brain className="h-4 w-4" />
        AI Model
      </Label>
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger id="model-select">
          <SelectValue placeholder="Select AI model" />
        </SelectTrigger>
        <SelectContent>
          {availableModels.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex flex-col">
                <span className="font-medium">{model.name}</span>
                <span className="text-xs text-muted-foreground">{model.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}