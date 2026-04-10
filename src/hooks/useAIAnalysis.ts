import { useState, useCallback } from 'react';
import { generateAIAnalysis, type AIAnalysisRequest, type AIAnalysisResponse } from '@/services/openrouter';

interface UseAIAnalysisOptions {
  apiKey: string;
  model?: string;
}

interface UseAIAnalysisReturn {
  analysis: AIAnalysisResponse | null;
  isLoading: boolean;
  error: string | null;
  analyze: (request: AIAnalysisRequest) => Promise<void>;
  clearAnalysis: () => void;
}

export function useAIAnalysis({ apiKey, model = 'openai/gpt-oss-120b:free' }: UseAIAnalysisOptions): UseAIAnalysisReturn {
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (request: AIAnalysisRequest) => {
    if (!apiKey) {
      setError('OpenRouter API key not configured');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await generateAIAnalysis(request, apiKey, model);
      setAnalysis(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate analysis';
      setError(message);
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, model]);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    analysis,
    isLoading,
    error,
    analyze,
    clearAnalysis,
  };
}
