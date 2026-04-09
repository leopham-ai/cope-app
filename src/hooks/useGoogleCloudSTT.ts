/// <reference types="vite/client" />

import { useState, useCallback, useRef, useEffect } from 'react'

export type RecordingState = 'idle' | 'recording' | 'processing'

interface StreamingRecognitionResult {
  transcript: string
  isFinal: boolean
}

export function useGoogleCloudSTT() {
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'recording' | 'error'>('idle')

  const websocketRef = useRef<WebSocket | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const isSupported = typeof window !== 'undefined' && !!navigator.mediaDevices?.getUserMedia

  // Clean up function
  const cleanup = useCallback(() => {
    console.log('[GoogleCloudSTT] Cleaning up...');
    
    if (websocketRef.current) {
      websocketRef.current.close()
      websocketRef.current = null
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    mediaRecorderRef.current = null
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close()
    }
    audioContextRef.current = null
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    audioChunksRef.current = []
  }, [])

  const startRecording = useCallback(async () => {
    console.log('[GoogleCloudSTT] Starting recording...');
    
    if (!isSupported) {
      setError('Microphone access not supported in this browser')
      return
    }

    try {
      setError(null)
      setTranscript('')
      setInterimTranscript('')
      setStatus('loading')

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      })
      streamRef.current = stream
      console.log('[GoogleCloudSTT] Got microphone access');

      // Create AudioContext for processing
      const audioContext = new AudioContext({ sampleRate: 16000 })
      audioContextRef.current = audioContext

      // Create WebSocket connection
      const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_SPEECH_API_KEY
      if (!apiKey) {
        throw new Error('Google Cloud Speech API key not configured')
      }

      const wsUrl = `wss://speech.googleapis.com/v1/speech:streamingRecognize?key=${apiKey}`
      console.log('[GoogleCloudSTT] Connecting to WebSocket...');
      
      const ws = new WebSocket(wsUrl)
      websocketRef.current = ws

      ws.onopen = () => {
        console.log('[GoogleCloudSTT] WebSocket connected');
        
        // Send the streaming config first
        const config = {
          config: {
            encoding: 'WEBM_OPUS' as const,
            sampleRateHertz: 16000,
            languageCode: 'en-US',
            enableWordTimeOffsets: false,
            enableAutomaticPunctuation: true,
            model: 'default',
          },
          interimResults: true,
        }
        
        ws.send(JSON.stringify(config))
        console.log('[GoogleCloudSTT] Sent streaming config');
        
        setStatus('recording')
        setRecordingState('recording')
      }

      ws.onmessage = (event) => {
        console.log('[GoogleCloudSTT] Received message:', event.data);
        
        try {
          const response = JSON.parse(event.data)
          
          if (response.error) {
            console.error('[GoogleCloudSTT] API error:', response.error)
            setError(`API error: ${response.error.message || response.error}`)
            return
          }
          
          if (response.results) {
            for (const result of response.results) {
              const alternative = result.alternatives?.[0]
              if (alternative?.transcript) {
                const transcriptText = alternative.transcript
                
                if (result.isFinal) {
                  console.log('[GoogleCloudSTT] Final transcript:', transcriptText)
                  setTranscript(prev => {
                    const newTranscript = prev + transcriptText
                    console.log('[GoogleCloudSTT] Updated transcript:', newTranscript)
                    return newTranscript
                  })
                  setInterimTranscript('')
                } else {
                  console.log('[GoogleCloudSTT] Interim transcript:', transcriptText)
                  setInterimTranscript(transcriptText)
                }
              }
            }
          }
        } catch (err) {
          console.error('[GoogleCloudSTT] Error parsing response:', err)
        }
      }

      ws.onerror = (event) => {
        console.error('[GoogleCloudSTT] WebSocket error:', event)
        setError('WebSocket connection error')
      }

      ws.onclose = (event) => {
        console.log('[GoogleCloudSTT] WebSocket closed:', event.code, event.reason)
        
        if (event.code === 1000) {
          // Normal closure
        } else {
          setError(`Connection closed: ${event.reason || event.code}`)
        }
        
        setRecordingState('idle')
        setStatus('idle')
      }

      // Set up MediaRecorder to capture audio
      // Note: MediaRecorder doesn't give us raw PCM, so we'll use AudioContext to resample
      const source = audioContext.createMediaStreamSource(stream)
      const processor = audioContext.createScriptProcessor(4096, 1, 1)
      
      processor.onaudioprocess = (audioEvent) => {
        if (ws.readyState === WebSocket.OPEN) {
          const inputData = audioEvent.inputBuffer.getChannelData(0)
          
          // Convert Float32Array to Int16Array (LINEAR16)
          const int16Array = new Int16Array(inputData.length)
          for (let i = 0; i < inputData.length; i++) {
            const s = Math.max(-1, Math.min(1, inputData[i]))
            int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
          }
          
          // Create audio content (base64 encoded)
          // Convert Int16Array to base64 properly
          const uint8Array = new Uint8Array(int16Array.buffer)
          let binary = ''
          for (let i = 0; i < uint8Array.length; i++) {
            binary += String.fromCharCode(uint8Array[i])
          }
          const base64 = btoa(binary)
          
          const audioContent = {
            audio: {
              content: base64,
            }
          }
          
          ws.send(JSON.stringify(audioContent))
        }
      }

      // Connect the audio processing chain
      source.connect(processor)
      processor.connect(audioContext.destination)

      // Keep processor alive by storing reference
      mediaRecorderRef.current = processor as any

      console.log('[GoogleCloudSTT] Recording started');

    } catch (err: any) {
      console.error('[GoogleCloudSTT] Error starting recording:', err)
      setError(`Failed to start: ${err.message || err}`)
      cleanup()
    }
  }, [isSupported, cleanup])

  const stopRecording = useCallback(() => {
    console.log('[GoogleCloudSTT] Stopping recording...')
    
    cleanup()
    setRecordingState('idle')
    setStatus('idle')
    
    console.log('[GoogleCloudSTT] Recording stopped')
  }, [cleanup])

  const resetTranscript = useCallback(() => {
    console.log('[GoogleCloudSTT] Resetting transcript')
    setTranscript('')
    setInterimTranscript('')
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return {
    transcript,
    interimTranscript,
    recordingState,
    startRecording,
    stopRecording,
    resetTranscript,
    isSupported,
    error,
    status,
  }
}
