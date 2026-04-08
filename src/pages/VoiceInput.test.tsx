// @ts-nocheck
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { VoiceInput } from './VoiceInput';

// Mock useSpeechRecognition at module level
vi.mock('../hooks/useSpeechRecognition', () => ({
  useSpeechRecognition: vi.fn()
}));

import * as useSpeechRecognitionModule from '../hooks/useSpeechRecognition';

describe('VoiceInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSpeechRecognitionModule.useSpeechRecognition.mockReturnValue({
      recordingState: 'idle',
      transcript: '',
      interimTranscript: '',
      startRecording: vi.fn(),
      stopRecording: vi.fn(),
      resetTranscript: vi.fn(),
      isSupported: true,
      error: null,
    });
  });

  it('should show start recording prompt when idle', () => {
    render(<VoiceInput />);
    expect(screen.getByText('Click to start recording')).toBeInTheDocument();
  });

  it('should show recording state when recording', () => {
    useSpeechRecognitionModule.useSpeechRecognition.mockReturnValue({
      recordingState: 'recording',
      transcript: '',
      interimTranscript: '',
      startRecording: vi.fn(),
      stopRecording: vi.fn(),
      resetTranscript: vi.fn(),
      isSupported: true,
      error: null,
    });
    render(<VoiceInput />);
    expect(screen.getByText('Recording...')).toBeInTheDocument();
  });

  it('should call startRecording when button is clicked', () => {
    const startRecording = vi.fn();
    useSpeechRecognitionModule.useSpeechRecognition.mockReturnValue({
      recordingState: 'idle',
      transcript: '',
      interimTranscript: '',
      startRecording,
      stopRecording: vi.fn(),
      resetTranscript: vi.fn(),
      isSupported: true,
      error: null,
    });
    render(<VoiceInput />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(startRecording).toHaveBeenCalled();
  });

  it('should call stopRecording when stop button is clicked', () => {
    const stopRecording = vi.fn();
    useSpeechRecognitionModule.useSpeechRecognition.mockReturnValue({
      recordingState: 'recording',
      transcript: '',
      interimTranscript: '',
      startRecording: vi.fn(),
      stopRecording,
      resetTranscript: vi.fn(),
      isSupported: true,
      error: null,
    });
    render(<VoiceInput />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(stopRecording).toHaveBeenCalled();
  });

  it('should display transcript when available', () => {
    useSpeechRecognitionModule.useSpeechRecognition.mockReturnValue({
      recordingState: 'idle',
      transcript: 'This is a test transcript',
      interimTranscript: '',
      startRecording: vi.fn(),
      stopRecording: vi.fn(),
      resetTranscript: vi.fn(),
      isSupported: true,
      error: null,
    });
    render(<VoiceInput />);
    expect(screen.getByDisplayValue('This is a test transcript')).toBeInTheDocument();
  });

  it('should show Copy to Clipboard button when transcript exists', () => {
    useSpeechRecognitionModule.useSpeechRecognition.mockReturnValue({
      recordingState: 'idle',
      transcript: 'Some transcript',
      interimTranscript: '',
      startRecording: vi.fn(),
      stopRecording: vi.fn(),
      resetTranscript: vi.fn(),
      isSupported: true,
      error: null,
    });
    render(<VoiceInput />);
    expect(screen.getByRole('button', { name: /copy to clipboard/i })).toBeInTheDocument();
  });

  it('should copy transcript to clipboard when Copy button is clicked', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    useSpeechRecognitionModule.useSpeechRecognition.mockReturnValue({
      recordingState: 'idle',
      transcript: 'Copy me',
      interimTranscript: '',
      startRecording: vi.fn(),
      stopRecording: vi.fn(),
      resetTranscript: vi.fn(),
      isSupported: true,
      error: null,
    });
    render(<VoiceInput />);
    fireEvent.click(screen.getByRole('button', { name: /copy to clipboard/i }));
    
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('Copy me');
    });
  });

  it('should show error message when error occurs', () => {
    useSpeechRecognitionModule.useSpeechRecognition.mockReturnValue({
      recordingState: 'idle',
      transcript: '',
      interimTranscript: '',
      startRecording: vi.fn(),
      stopRecording: vi.fn(),
      resetTranscript: vi.fn(),
      isSupported: true,
      error: 'Microphone access denied',
    });
    render(<VoiceInput />);
    expect(screen.getByText('Microphone access denied')).toBeInTheDocument();
  });

  it('should show unsupported message when browser does not support Web Speech API', () => {
    useSpeechRecognitionModule.useSpeechRecognition.mockReturnValue({
      recordingState: 'idle',
      transcript: '',
      interimTranscript: '',
      startRecording: vi.fn(),
      stopRecording: vi.fn(),
      resetTranscript: vi.fn(),
      isSupported: false,
      error: null,
    });
    render(<VoiceInput />);
    expect(screen.getByText(/not supported in this browser/i)).toBeInTheDocument();
  });
});