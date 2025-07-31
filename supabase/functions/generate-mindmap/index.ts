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
    const { text, model = 'gemini-1.5-flash' } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required for mind map generation.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const aiService = new AIService();
    const prompt = `Create a hierarchical mind map structure from the following text. Return ONLY a valid JSON object with a central topic and branches. Each node should have "id", "label", "children" (array), and "level" (0 for root, 1 for main branches, etc.).

Text: ${text}

Format: {"id": "root", "label": "Main Topic", "level": 0, "children": [{"id": "branch1", "label": "Subtopic 1", "level": 1, "children": [...]}]}`;

    const response = await aiService.generateResponse({
      model,
      prompt,
      maxTokens: 2000,
      temperature: 0.7,
    });
    
    try {
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : response.text;
      const mindMap = JSON.parse(jsonString);
      
      return new Response(JSON.stringify({ 
        mindMap,
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
    console.error("Error in generate-mindmap edge function:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});