// File processing utilities for different document types

export interface ProcessedFile {
  name: string;
  content: string;
  size: number;
  type: string;
  chunks: string[];
}

export class FileProcessor {
  private static readonly MAX_CHUNK_SIZE = 2000; // Optimal chunk size for AI processing
  private static readonly CHUNK_OVERLAP = 200; // Overlap between chunks for context

  static async processFile(file: File): Promise<ProcessedFile> {
    let content = '';
    
    try {
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        content = await this.processTxtFile(file);
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        content = await this.processPdfFile(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        content = await this.processDocxFile(file);
      } else {
        throw new Error(`Unsupported file type: ${file.type}`);
      }

      const chunks = this.createOptimalChunks(content);

      return {
        name: file.name,
        content,
        size: file.size,
        type: file.type,
        chunks,
      };
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
      throw new Error(`Failed to process file ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async processTxtFile(file: File): Promise<string> {
    return await file.text();
  }

  private static async processPdfFile(file: File): Promise<string> {
    // For PDF processing, we'll use a simple approach for now
    // In production, you'd want to use a proper PDF parsing library
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Simple text extraction - this is very basic and won't work for all PDFs
    // For production, consider using pdf-parse or similar library
    let text = '';
    for (let i = 0; i < uint8Array.length; i++) {
      const char = String.fromCharCode(uint8Array[i]);
      if (char.match(/[a-zA-Z0-9\s.,!?;:()\-'"]/)) {
        text += char;
      }
    }
    
    // Clean up the extracted text
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,!?;:()\-'"]/g, '')
      .trim();
  }

  private static async processDocxFile(file: File): Promise<string> {
    // For DOCX processing, we'll extract text from the XML structure
    // This is a simplified approach - for production, use a proper DOCX parser
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to string and look for text content
    const content = new TextDecoder().decode(uint8Array);
    
    // Extract text between XML tags (very basic approach)
    const textMatches = content.match(/<w:t[^>]*>([^<]*)<\/w:t>/g);
    if (textMatches) {
      return textMatches
        .map(match => match.replace(/<[^>]*>/g, ''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    return 'Could not extract text from DOCX file';
  }

  static createOptimalChunks(text: string): string[] {
    if (!text || text.trim().length === 0) {
      return [];
    }

    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    let currentChunk = '';
    
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;

      const potentialChunk = currentChunk 
        ? `${currentChunk}. ${trimmedSentence}`
        : trimmedSentence;

      // If adding this sentence would exceed max size, finalize current chunk
      if (potentialChunk.length > this.MAX_CHUNK_SIZE) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          
          // Start new chunk with overlap from previous chunk
          const words = currentChunk.split(' ');
          const overlapWords = words.slice(-Math.floor(this.CHUNK_OVERLAP / 6)); // Rough word estimate
          currentChunk = `${overlapWords.join(' ')}. ${trimmedSentence}`;
        } else {
          // Single sentence is too long, split it by words
          const words = trimmedSentence.split(' ');
          for (let i = 0; i < words.length; i += Math.floor(this.MAX_CHUNK_SIZE / 6)) {
            const wordChunk = words.slice(i, i + Math.floor(this.MAX_CHUNK_SIZE / 6)).join(' ');
            if (wordChunk.trim()) {
              chunks.push(wordChunk.trim());
            }
          }
          currentChunk = '';
        }
      } else {
        currentChunk = potentialChunk;
      }
    }

    // Add any remaining content
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks.filter(chunk => chunk.length > 10); // Filter out very short chunks
  }

  static async processMultipleFiles(files: File[]): Promise<ProcessedFile[]> {
    const processedFiles: ProcessedFile[] = [];
    
    for (const file of files) {
      try {
        const processed = await this.processFile(file);
        processedFiles.push(processed);
      } catch (error) {
        console.error(`Failed to process file ${file.name}:`, error);
        // Continue processing other files even if one fails
      }
    }
    
    return processedFiles;
  }

  static combineChunks(processedFiles: ProcessedFile[], additionalText?: string): string[] {
    const allChunks: string[] = [];
    
    // Add chunks from processed files
    for (const file of processedFiles) {
      // Add file header
      allChunks.push(`--- Content from ${file.name} ---`);
      allChunks.push(...file.chunks);
    }
    
    // Add additional text if provided
    if (additionalText && additionalText.trim()) {
      allChunks.push('--- Additional Text Content ---');
      const textChunks = this.createOptimalChunks(additionalText);
      allChunks.push(...textChunks);
    }
    
    return allChunks;
  }
}