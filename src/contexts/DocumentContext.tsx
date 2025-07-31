import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DocumentChunk {
  id: string;
  content: string;
  chunk_index: number;
  total_chunks: number;
}

export interface ProcessedDocument {
  id: string;
  chunks: DocumentChunk[];
  totalSize: number;
  fileName?: string;
  processedAt: Date;
  chunksCount: number;
}

interface DocumentContextType {
  currentDocument: ProcessedDocument | null;
  setCurrentDocument: (document: ProcessedDocument | null) => void;
  isDocumentLoaded: boolean;
  getDocumentContent: () => string;
  clearDocument: () => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const [currentDocument, setCurrentDocument] = useState<ProcessedDocument | null>(null);

  const isDocumentLoaded = currentDocument !== null;

  const getDocumentContent = (): string => {
    if (!currentDocument) return '';
    return currentDocument.chunks
      .sort((a, b) => a.chunk_index - b.chunk_index)
      .map(chunk => chunk.content)
      .join('\n\n');
  };

  const clearDocument = () => {
    setCurrentDocument(null);
  };

  const value: DocumentContextType = {
    currentDocument,
    setCurrentDocument,
    isDocumentLoaded,
    getDocumentContent,
    clearDocument,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};