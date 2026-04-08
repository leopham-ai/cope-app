import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSpeechRecognition } from './useSpeechRecognition'

describe('useSpeechRecognition', () => {
  // Store callbacks set on recognition instance
  let recognitionCallbacks: {
    onresult?: (event: { results: { length: number; [index: number]: { isFinal: boolean; 0: { transcript: string } } }; resultIndex: number }) => void
    onerror?: (event: { error: string }) => void
    onend?: () => void
  } = {}

  beforeEach(() => {
    vi.clearAllMocks()
    recognitionCallbacks = {}

    class MockSpeechRecognition {
      lang = 'en-US'
      continuous = true
      interimResults = true
      start = vi.fn(() => {
        // Store reference to the instance to manually trigger callbacks
        // @ts-expect-error - internal tracking
        MockSpeechRecognition._lastInstance = this
      })
      stop = vi.fn()
      abort = vi.fn()
      set onresult(fn: typeof recognitionCallbacks.onresult) {
        recognitionCallbacks.onresult = fn
      }
      get onresult() { return recognitionCallbacks.onresult }
      set onerror(fn: typeof recognitionCallbacks.onerror) {
        recognitionCallbacks.onerror = fn
      }
      get onerror() { return recognitionCallbacks.onerror }
      set onend(fn: typeof recognitionCallbacks.onend) {
        recognitionCallbacks.onend = fn
      }
      get onend() { return recognitionCallbacks.onend }
    }
    
    // @ts-expect-error - Mock the webkit prefix
    window.webkitSpeechRecognition = MockSpeechRecognition
  })

  it('should return initial state', () => {
    const { result } = renderHook(() => useSpeechRecognition())

    expect(result.current.recordingState).toBe('idle')
    expect(result.current.transcript).toBe('')
    expect(result.current.interimTranscript).toBe('')
    expect(result.current.error).toBe(null)
  })

  it('should return isSupported as true when SpeechRecognition is available', () => {
    const { result } = renderHook(() => useSpeechRecognition())
    expect(result.current.isSupported).toBe(true)
  })

  it('should transition to recording state when startRecording is called', () => {
    const { result } = renderHook(() => useSpeechRecognition())

    act(() => {
      result.current.startRecording()
    })

    expect(result.current.recordingState).toBe('recording')
  })

  it('should transition to idle state when stopRecording is called', () => {
    const { result } = renderHook(() => useSpeechRecognition())

    act(() => {
      result.current.startRecording()
    })
    act(() => {
      result.current.stopRecording()
    })

    expect(result.current.recordingState).toBe('idle')
  })

  it('should update transcript when speech is recognized', () => {
    const { result } = renderHook(() => useSpeechRecognition())

    act(() => {
      result.current.startRecording()
    })

    act(() => {
      recognitionCallbacks.onresult?.({
        results: {
          length: 1,
          0: {
            isFinal: true,
            0: { transcript: 'Hello world' },
          },
        },
        resultIndex: 0,
      })
    })

    expect(result.current.transcript).toBe('Hello world')
  })

  it('should update interimTranscript for non-final results', () => {
    const { result } = renderHook(() => useSpeechRecognition())

    act(() => {
      result.current.startRecording()
    })

    act(() => {
      recognitionCallbacks.onresult?.({
        results: {
          length: 1,
          0: {
            isFinal: false,
            0: { transcript: 'Thinking...' },
          },
        },
        resultIndex: 0,
      })
    })

    expect(result.current.interimTranscript).toBe('Thinking...')
  })

  it('should reset transcript when resetTranscript is called', () => {
    const { result } = renderHook(() => useSpeechRecognition())

    act(() => {
      result.current.startRecording()
    })

    act(() => {
      recognitionCallbacks.onresult?.({
        results: {
          length: 1,
          0: {
            isFinal: true,
            0: { transcript: 'Hello' },
          },
        },
        resultIndex: 0,
      })
    })

    expect(result.current.transcript).toBe('Hello')

    act(() => {
      result.current.resetTranscript()
    })

    expect(result.current.transcript).toBe('')
    expect(result.current.interimTranscript).toBe('')
  })

  it('should handle onerror event', () => {
    const { result } = renderHook(() => useSpeechRecognition())

    act(() => {
      result.current.startRecording()
    })

    act(() => {
      recognitionCallbacks.onerror?.({ error: 'not-allowed' })
    })

    expect(result.current.error).toBe('not-allowed')
    expect(result.current.recordingState).toBe('idle')
  })

  it('should transition to idle when recognition ends', () => {
    const { result } = renderHook(() => useSpeechRecognition())

    act(() => {
      result.current.startRecording()
    })

    act(() => {
      recognitionCallbacks.onend?.()
    })

    expect(result.current.recordingState).toBe('idle')
  })

  it('should return isSupported as false when SpeechRecognition is not available', () => {
    const originalSpeechRecognition = window.SpeechRecognition
    const originalWebkitSpeechRecognition = window.webkitSpeechRecognition
    delete (window as any).SpeechRecognition
    delete (window as any).webkitSpeechRecognition

    const { result } = renderHook(() => useSpeechRecognition())

    expect(result.current.isSupported).toBe(false)

    if (originalSpeechRecognition) {
      window.SpeechRecognition = originalSpeechRecognition
    }
    if (originalWebkitSpeechRecognition) {
      window.webkitSpeechRecognition = originalWebkitSpeechRecognition
    }
  })
})