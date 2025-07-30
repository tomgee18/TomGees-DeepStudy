import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required for summarization.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Initialize Supabase client (if needed for other operations, though not strictly for AI API calls)
    // const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '');

    // --- Placeholder for AI API call ---
    // In a real application, you would call Gemini or OpenRouter API here.
    // Example with a hypothetical AI API:
    // const response = await fetch('https://api.ai-model.com/summarize', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${Deno.env.get('GEMINI_API_KEY') || Deno.env.get('OPENROUTER_API_KEY')}`, // Use environment variables for API keys
    //   },
    //   body: JSON.stringify({ text: text, length: 'short' }),
    // });
    // const aiData = await response.json();
    // const summary = aiData.summary;
    // --- End Placeholder ---

    // For now, we'll return a simple mock summary
    const summary = `This is a summary of your text: "${text.substring(0, Math.min(text.length, 100))}..."`;

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error in summarize edge function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});