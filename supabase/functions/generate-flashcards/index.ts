import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { AIService } from '../_shared/ai-service.ts';
import {
  ensureBoundedInteger,
  ensureStringWithinLimit,
  ensureValidModel,
  MAX_TEXT_LENGTH,
  parseJsonBody,
} from '../_shared/request-guards.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  try {
    const body = await parseJsonBody(req);
    const text = ensureStringWithinLimit(body.text, 'text', MAX_TEXT_LENGTH);
    const model = ensureValidModel(body.model, 'gemini-1.5-flash');
    const count = ensureBoundedInteger(body.count, 5, 1, 20);

    const aiService = new AIService();
    const prompt = `Create ${count} flashcards from the following text. Return ONLY a valid JSON array with objects containing "question" and "answer" fields. No additional text or formatting.

Text: ${text}

Format: [{"question": "...", "answer": "..."}, ...]`;

    const response = await aiService.generateResponse({
      model,
      prompt,
      maxTokens: 1500,
      temperature: 0.7,
    });
    
    try {
      // Clean the response to extract JSON
      const jsonMatch = response.text.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : response.text;
      const flashcards = JSON.parse(jsonString);
      
      return new Response(JSON.stringify({ 
        flashcards,
        usage: response.usage 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return new Response(JSON.stringify({ error: 'Failed to parse AI response' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (
        error.message === 'INVALID_JSON_BODY' ||
        error.message === 'TEXT_REQUIRED' ||
        error.message === 'TEXT_TOO_LARGE' ||
        error.message === 'INVALID_MODEL'
      ) {
        return new Response(JSON.stringify({ error: 'Invalid request payload.' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }
    }
    console.error("Error in generate-flashcards edge function:", error);
    return new Response(JSON.stringify({ error: 'Request failed.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});