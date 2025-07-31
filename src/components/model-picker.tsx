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
  provider: 'gemini' | 'openrouter';
}

export const availableModels: AIModel[] = [
  // Gemini Models
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    description: "Fast and efficient for most tasks",
    maxTokens: 1000000,
    provider: 'gemini',
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    description: "More capable for complex reasoning",
    maxTokens: 2000000,
    provider: 'gemini',
  },
  {
    id: "gemini-1.0-pro",
    name: "Gemini 1.0 Pro",
    description: "Reliable baseline model",
    maxTokens: 30720,
    provider: 'gemini',
  },
  // OpenRouter Free Models
  {
    id: "microsoft/phi-3-mini-128k-instruct:free",
    name: "Phi-3 Mini (Free)",
    description: "Microsoft's efficient small model - Free",
    maxTokens: 128000,
    provider: 'openrouter',
  },
  {
    id: "microsoft/phi-3-medium-128k-instruct:free",
    name: "Phi-3 Medium (Free)",
    description: "Microsoft's balanced model - Free",
    maxTokens: 128000,
    provider: 'openrouter',
  },
  {
    id: "google/gemma-7b-it:free",
    name: "Gemma 7B (Free)",
    description: "Google's open model - Free",
    maxTokens: 8192,
    provider: 'openrouter',
  },
  {
    id: "meta-llama/llama-3-8b-instruct:free",
    name: "Llama 3 8B (Free)",
    description: "Meta's open-source model - Free",
    maxTokens: 8192,
    provider: 'openrouter',
  },
  {
    id: "huggingface/zephyr-7b-beta:free",
    name: "Zephyr 7B (Free)",
    description: "HuggingFace's fine-tuned model - Free",
    maxTokens: 4096,
    provider: 'openrouter',
  },
  {
    id: "openchat/openchat-7b:free",
    name: "OpenChat 7B (Free)",
    description: "Open-source conversational model - Free",
    maxTokens: 8192,
    provider: 'openrouter',
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
                <div className="flex items-center gap-2">
                  <span className="font-medium">{model.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {model.provider}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{model.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}