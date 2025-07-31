// Shared AI service for handling multiple providers

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
  private geminiApiKey: string;
  private openRouterApiKey: string;

  constructor() {
    this.geminiApiKey = Deno.env.get('GEMINI_API_KEY') || '';
    this.openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY') || '';
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const { model, prompt, maxTokens = 1000, temperature = 0.7 } = request;

    if (model.startsWith('gemini-')) {
      return this.callGemini(model, prompt, maxTokens, temperature);
    } else {
      return this.callOpenRouter(model, prompt, maxTokens, temperature);
    }
  }

  private async callGemini(
    model: string,
    prompt: string,
    maxTokens: number,
    temperature: number
  ): Promise<AIResponse> {
    if (!this.geminiApiKey) {
      throw new Error('GEMINI_API_KEY not set in Supabase secrets.');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text || '';

    return {
      text,
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0,
      }
    };
  }

  private async callOpenRouter(
    model: string,
    prompt: string,
    maxTokens: number,
    temperature: number
  ): Promise<AIResponse> {
    if (!this.openRouterApiKey) {
      throw new Error('OPENROUTER_API_KEY not set in Supabase secrets.');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://swift-alpaca-glow.vercel.app',
        'X-Title': 'Swift Alpaca Glow - AI Study Assistant',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content || '';

    return {
      text,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      }
    };
  }
}