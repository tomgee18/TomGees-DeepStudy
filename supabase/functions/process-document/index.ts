import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { files, text } = await req.json();

    if (!files && !text) {
      return new Response(JSON.stringify({ error: 'Either files or text must be provided.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Initialize Supabase client for database operations
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let processedContent = '';
    let chunks = [];

    // Process uploaded files
    if (files && files.length > 0) {
      for (const file of files) {
        // In a real implementation, you would process the actual file content
        // For now, we'll simulate file processing
        console.log(`Processing file: ${file.name}`);
        
        // Simulate extracting text from different file types
        if (file.name.endsWith('.pdf')) {
          processedContent += `Content from PDF file: ${file.name}\n\nThis is simulated PDF content that would be extracted from the actual PDF file.\n\n`;
        } else if (file.name.endsWith('.docx')) {
          processedContent += `Content from DOCX file: ${file.name}\n\nThis is simulated DOCX content that would be extracted from the actual DOCX file.\n\n`;
        } else if (file.name.endsWith('.txt')) {
          processedContent += `Content from TXT file: ${file.name}\n\nThis is simulated TXT content that would be extracted from the actual TXT file.\n\n`;
        }
      }
    }

    // Add pasted text if provided
    if (text) {
      processedContent += `Pasted text content:\n\n${text}\n\n`;
    }

    // Improved chunking logic
    const chunkText = (text: string, maxChunkSize: number = 1000): string[] => {
      const chunks: string[] = [];
      const sentences = text.split(/[.!?]+/);
      let currentChunk = '';

      for (const sentence of sentences) {
        const trimmedSentence = sentence.trim();
        if (!trimmedSentence) continue;

        // If adding this sentence would exceed the chunk size, finalize current chunk
        if (currentChunk.length + trimmedSentence.length + 2 > maxChunkSize) {
          if (currentChunk) {
            chunks.push(currentChunk.trim());
            currentChunk = '';
          }
        }

        // Add sentence to current chunk
        if (currentChunk) {
          currentChunk += ' ' + trimmedSentence;
        } else {
          currentChunk = trimmedSentence;
        }

        // If we reach max chunk size, finalize it
        if (currentChunk.length >= maxChunkSize) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
      }

      // Add any remaining content
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }

      return chunks.filter(chunk => chunk.length > 0);
    };

    // Create chunks from processed content
    chunks = chunkText(processedContent);

    // Store chunks in database
    const { data: insertData, error: insertError } = await supabase
      .from('document_chunks')
      .insert(chunks.map((chunk, index) => ({
        content: chunk,
        chunk_index: index,
        total_chunks: chunks.length,
        created_at: new Date().toISOString(),
      })))
      .select();

    if (insertError) {
      console.error('Error storing chunks:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to store processed content.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ 
      message: 'Document processed successfully!',
      chunks_count: chunks.length,
      chunks: chunks,
      document_id: insertData?.[0]?.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Error in process-document edge function:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});