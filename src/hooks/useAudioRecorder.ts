import { useState, useRef, useCallback } from 'react';

export type RecordingState = 'idle' | 'recording' | 'processing';

interface UseAudioRecorderReturn {
  recordingState: RecordingState;
  audioBlob: Blob | null;
  audioUrl: string | null;
  error: string | null;
  isSupported: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecording: () => void;
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const isSupported = typeof window !== 'undefined' && 'MediaRecorder' in window;

  const startRecording = useCallback(async () => {
    console.log('[useAudioRecorder] Starting recording...');
    setError(null);
    chunksRef.current = [];
    
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          channelCount: 1,
          sampleRate: 16000,
        } 
      });
      streamRef.current = stream;
      
      // Determine supported MIME type
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        mimeType = 'audio/ogg;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }
      
      console.log('[useAudioRecorder] Using MIME type:', mimeType);
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        console.log('[useAudioRecorder] Data available:', event.data.size, 'bytes');
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        console.log('[useAudioRecorder] Recording stopped, combining chunks...');
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        setAudioBlob(blob);
        setAudioUrl(url);
        setRecordingState('idle');
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        console.log('[useAudioRecorder] Recording complete, blob size:', blob.size, 'bytes');
      };
      
      mediaRecorder.onerror = (event) => {
        console.error('[useAudioRecorder] MediaRecorder error:', event);
        setError('Recording failed');
        setRecordingState('idle');
      };
      
      mediaRecorder.start(100); // Collect data every 100ms
      setRecordingState('recording');
      console.log('[useAudioRecorder] Recording started');
      
    } catch (err) {
      console.error('[useAudioRecorder] Failed to start recording:', err);
      setError(err instanceof Error ? err.message : 'Failed to access microphone');
      setRecordingState('idle');
    }
  }, []);

  const stopRecording = useCallback(() => {
    console.log('[useAudioRecorder] Stopping recording...');
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const resetRecording = useCallback(() => {
    console.log('[useAudioRecorder] Resetting recording');
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    chunksRef.current = [];
  }, [audioUrl]);

  return {
    recordingState,
    audioBlob,
    audioUrl,
    error,
    isSupported,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
