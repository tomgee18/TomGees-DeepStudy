import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { AIService } from '../_shared/ai-service.ts';
import {
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

    const aiService = new AIService();
    const prompt = `Please provide a concise summary of the following text:\n\n${text}`;
    
    const response = await aiService.generateResponse({
      model,
      prompt,
      maxTokens: 500,
      temperature: 0.7,
    });

    return new Response(JSON.stringify({ 
      summary: response.text,
      usage: response.usage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
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
    console.error("Error in summarize edge function:", error);
    return new Response(JSON.stringify({ error: 'Request failed.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});