import { createContext, useContext } from 'react';

/**
 * Global transcript context for sharing voice transcription across pages.
 * 
 * Usage in VoiceInput page (provider):
 *   <TranscriptContext.Provider value={transcript}>
 * 
 * Usage in other pages (consumer):
 *   import { useTranscript } from '@/contexts/TranscriptContext';
 *   const transcript = useTranscript();
 */
export const TranscriptContext = createContext<string>('');

/**
 * Hook to access the global transcript from any page.
 * Must be used within a component that has TranscriptContext.Provider
 * (typically in App.tsx or a layout component).
 */
export function useTranscript(): string {
  return useContext(TranscriptContext);
}

/**
 * Global state holder for transcript.
 * This persists across page navigations.
 */
let globalTranscript = '';

/**
 * Get the current global transcript.
 */
export function getGlobalTranscript(): string {
  return globalTranscript;
}

/**
 * Set the global transcript.
 */
export function setGlobalTranscript(transcript: string): void {
  globalTranscript = transcript;
}
