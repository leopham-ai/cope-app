import { useState, useCallback, useRef, useEffect } from 'react'

export type RecordingState = 'idle' | 'recording' | 'processing'

interface SpeechRecognitionResultItem {
  transcript: string
  confidence: number
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResultItem
  [index: number]: {
    isFinal: boolean
    0: SpeechRecognitionResultItem
  }
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent {
  error: string
  message?: string
}

interface SpeechRecognitionInterface {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInterface
    webkitSpeechRecognition: new () => SpeechRecognitionInterface
  }
}

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognitionInterface | null>(null)

  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  console.log('[WebSpeech] isSupported:', isSupported);
  console.log('[WebSpeech] current state:', { transcript, interimTranscript, recordingState, error });

  const startRecording = useCallback(() => {
    console.log('[WebSpeech] startRecording called');
    
    if (!isSupported) {
      console.log('[WebSpeech] NOT SUPPORTED - setting error');
      setError('Speech recognition not supported in this browser');
      return;
    }

    try {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition
      console.log('[WebSpeech] Using class:', SpeechRecognitionClass?.name);
      
      const recognition = new SpeechRecognitionClass()
      console.log('[WebSpeech] Recognition instance created');

      recognition.lang = 'en-US'
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        console.log('[WebSpeech] onresult fired', { resultIndex: event.resultIndex, length: event.results.length });
        
        let finalTranscript = ''
        let interimText = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const transcriptText = result[0].transcript
          console.log('[WebSpeech] Result item:', { isFinal: result.isFinal, transcript: transcriptText });

          if (result.isFinal) {
            finalTranscript += transcriptText
          } else {
            interimText += transcriptText
          }
        }

        if (finalTranscript) {
          console.log('[WebSpeech] Final transcript:', finalTranscript);
          setTranscript(prev => {
            const newTranscript = prev + finalTranscript
            console.log('[WebSpeech] Updated transcript:', newTranscript);
            return newTranscript.trim()
          })
        }

        if (interimText) {
          console.log('[WebSpeech] Interim transcript:', interimText);
          setInterimTranscript(interimText)
        }
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.log('[WebSpeech] onerror fired', { error: event.error, message: event.message });
        setError(event.error)
        setRecordingState('idle')
      }

      recognition.onend = () => {
        console.log('[WebSpeech] onend fired - recognition stopped');
        setRecordingState('idle')
        setInterimTranscript('')
      }

      recognitionRef.current = recognition
      setError(null)
      setRecordingState('recording')
      console.log('[WebSpeech] Calling recognition.start()');
      recognition.start()
      console.log('[WebSpeech] recognition.start() called successfully');
    } catch (err) {
      console.error('[WebSpeech] Exception in startRecording:', err);
      setError(`Failed to start: ${err}`);
    }
  }, [isSupported])

  const stopRecording = useCallback(() => {
    console.log('[WebSpeech] stopRecording called');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
        console.log('[WebSpeech] recognition.stop() called');
      } catch (err) {
        console.error('[WebSpeech] Error stopping:', err);
      }
      recognitionRef.current = null
    }
    setRecordingState('idle')
  }, [])

  const resetTranscript = useCallback(() => {
    console.log('[WebSpeech] resetTranscript called');
    setTranscript('')
    setInterimTranscript('')
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    console.log('[WebSpeech] Cleanup effect running');
    return () => {
      if (recognitionRef.current) {
        console.log('[WebSpeech] Aborting recognition on cleanup');
        recognitionRef.current.abort()
        recognitionRef.current = null
      }
    }
  }, [])

  return {
    transcript,
    interimTranscript,
    recordingState,
    startRecording,
    stopRecording,
    resetTranscript,
    isSupported,
    error,
  }
}
