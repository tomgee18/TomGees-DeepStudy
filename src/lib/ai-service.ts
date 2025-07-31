export interface AIProvider {
  name: 'gemini' | 'openrouter';
  apiKey: string;
  baseUrl?: string;
}

export interface AIRequest {
  model: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class AIService {
  static async callGemini(request: AIRequest, apiKey: string): Promise<AIResponse> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${request.model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: request.prompt }]
            }
          ],
          generationConfig: {
            temperature: request.temperature || 0.7,
            maxOutputTokens: request.maxTokens || 1000
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text || "No response generated.";
    
    return {
      text,
      usage: data.usageMetadata ? {
        promptTokens: data.usageMetadata.promptTokenCount || 0,
        completionTokens: data.usageMetadata.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata.totalTokenCount || 0,
      } : undefined
    };
  }

  static async callOpenRouter(request: AIRequest, apiKey: string): Promise<AIResponse> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://swift-alpaca-glow.vercel.app',
        'X-Title': 'Swift Alpaca Glow - AI Study Assistant',
      },
      body: JSON.stringify({
        model: request.model,
        messages: [
          {
            role: 'user',
            content: request.prompt
          }
        ],
        max_tokens: request.maxTokens || 1000,
        temperature: request.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content || "No response generated.";
    
    return {
      text,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens || 0,
        completionTokens: data.usage.completion_tokens || 0,
        totalTokens: data.usage.total_tokens || 0,
      } : undefined
    };
  }

  static getProviderFromModel(model: string): 'gemini' | 'openrouter' {
    if (model.startsWith('gemini-')) {
      return 'gemini';
    }
    return 'openrouter';
  }

  static async generateResponse(request: AIRequest): Promise<AIResponse> {
    const provider = this.getProviderFromModel(request.model);
    
    if (provider === 'gemini') {
      const apiKey = Deno.env.get('GEMINI_API_KEY');
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY not set in environment variables');
      }
      return this.callGemini(request, apiKey);
    } else {
      const apiKey = Deno.env.get('OPENROUTER_API_KEY');
      if (!apiKey) {
        throw new Error('OPENROUTER_API_KEY not set in environment variables');
      }
      return this.callOpenRouter(request, apiKey);
    }
  }
}