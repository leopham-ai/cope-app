import { useState, useCallback } from 'react';

interface UseAssemblyAITranscriptionReturn {
  isTranscribing: boolean;
  transcript: string | null;
  error: string | null;
  transcribe: (audioBlob: Blob) => Promise<string | null>;
}

export function useAssemblyAITranscription(): UseAssemblyAITranscriptionReturn {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const transcribe = useCallback(async (audioBlob: Blob): Promise<string | null> => {
    const apiKey = import.meta.env.VITE_ASSEMBLYAI_API_KEY;
    
    if (!apiKey) {
      setError('AssemblyAI API key not found. Add VITE_ASSEMBLYAI_API_KEY to your .env file.');
      return null;
    }

    console.log('[useAssemblyAI] Starting transcription, blob size:', audioBlob.size, 'bytes');
    setIsTranscribing(true);
    setError(null);
    setTranscript(null);

    try {
      // Step 1: Upload audio file
      console.log('[useAssemblyAI] Uploading audio...');
      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'Authorization': apiKey,
        },
        body: audioBlob,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed: ${uploadResponse.status} ${errorText}`);
      }

      const { upload_url } = await uploadResponse.json();
      console.log('[useAssemblyAI] Uploaded to:', upload_url);

      // Step 2: Start transcription
      console.log('[useAssemblyAI] Starting transcription job...');
      const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_url: upload_url,
          language_detection: true,
          speech_models: ['universal-3-pro', 'universal-2'],
        }),
      });

      if (!transcriptResponse.ok) {
        const errorText = await transcriptResponse.text();
        throw new Error(`Transcription start failed: ${transcriptResponse.status} ${errorText}`);
      }

      const { id: transcriptId } = await transcriptResponse.json();
      console.log('[useAssemblyAI] Transcription job ID:', transcriptId);

      // Step 3: Poll for completion
      const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;
      let attempts = 0;
      const maxAttempts = 100; // ~5 minutes max

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Poll every 3 seconds
        
        const pollingResponse = await fetch(pollingEndpoint, {
          headers: {
            'Authorization': apiKey,
          },
        });

        if (!pollingResponse.ok) {
          throw new Error(`Polling failed: ${pollingResponse.status}`);
        }

        const result = await pollingResponse.json();
        console.log('[useAssemblyAI] Poll attempt', attempts + 1, '- status:', result.status);

        if (result.status === 'completed') {
          console.log('[useAssemblyAI] Transcription completed!');
          const text = result.text || '';
          setTranscript(text);
          setIsTranscribing(false);
          return text;
        }

        if (result.status === 'error') {
          throw new Error(`Transcription error: ${result.error}`);
        }

        attempts++;
      }

      throw new Error('Transcription timed out after 5 minutes');

    } catch (err) {
      console.error('[useAssemblyAI] Transcription failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Transcription failed';
      setError(errorMessage);
      setIsTranscribing(false);
      return null;
    }
  }, []);

  return {
    isTranscribing,
    transcript,
    error,
    transcribe,
  };
}
