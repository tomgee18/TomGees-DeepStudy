import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { AIService } from '../_shared/ai-service.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, model = 'gemini-1.5-flash', questionCount = 5 } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required for quiz generation.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const aiService = new AIService();
    const prompt = `Create a ${questionCount}-question multiple choice quiz from the following text. Return ONLY a valid JSON array with objects containing "question", "options" (array of 4 choices), and "correctAnswer" (index 0-3). No additional text.

Text: ${text}

Format: [{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0}, ...]`;

    const response = await aiService.generateResponse({
      model,
      prompt,
      maxTokens: 2000,
      temperature: 0.7,
    });
    
    try {
      const jsonMatch = response.text.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : response.text;
      const questions = JSON.parse(jsonString);
      
      return new Response(JSON.stringify({ 
        questions,
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
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Error in generate-quiz edge function:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});