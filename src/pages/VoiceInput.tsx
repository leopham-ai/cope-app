import { useState, useEffect } from 'react';
import { Mic, Square, Copy, Trash2, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useAssemblyAITranscription } from '@/hooks/useAssemblyAIRest';

interface VoiceInputProps {
  onTranscriptChange?: (transcript: string) => void;
}

export function VoiceInput({ onTranscriptChange }: VoiceInputProps) {
  const [manualTranscript, setManualTranscript] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const recorder = useAudioRecorder();
  const assemblyAI = useAssemblyAITranscription();
  
  const isRecording = recorder.recordingState === 'recording';
  const isProcessing = recorder.recordingState === 'processing' || isUploading || assemblyAI.isTranscribing;
  
  const displayTranscript = assemblyAI.transcript || manualTranscript;

  // Notify parent whenever displayTranscript changes (from typing, pasting, or transcription)
  useEffect(() => {
    if (onTranscriptChange) {
      onTranscriptChange(displayTranscript);
    }
  }, [displayTranscript, onTranscriptChange]);

  const currentError = recorder.error || assemblyAI.error;

  const handleStartRecording = () => {
    console.log('[VoiceInput] Starting recording');
    recorder.startRecording();
  };

  const handleStopRecording = async () => {
    console.log('[VoiceInput] Stopping recording');
    recorder.stopRecording();
    
    setTimeout(async () => {
      if (recorder.audioBlob) {
        console.log('[VoiceInput] Audio recorded, transcribing with AssemblyAI');
        setIsUploading(true);
        await assemblyAI.transcribe(recorder.audioBlob);
        setIsUploading(false);
      }
    }, 500);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayTranscript);
  };

  const handleClear = () => {
    recorder.resetRecording();
    assemblyAI.transcript && (assemblyAI.transcript = null);
    setManualTranscript('');
  };

  const handleDownloadAudio = () => {
    if (!recorder.audioBlob || !recorder.audioUrl) return;
    
    const a = document.createElement('a');
    a.href = recorder.audioUrl;
    a.download = `recording-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReTranscribe = async () => {
    if (!recorder.audioBlob) return;
    setIsUploading(true);
    await assemblyAI.transcribe(recorder.audioBlob);
    setIsUploading(false);
  };

  const handleTranscriptInput = (value: string) => {
    setManualTranscript(value);
  };

  if (!recorder.isSupported) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Voice Input</h2>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">
            Hands-free data entry using speech recognition.
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 sm:p-8 text-center">
          <p className="text-red-700">
            Audio recording is not supported in this browser. Please use Chrome or Edge.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">Voice Input</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm sm:text-base">
          Record audio and transcribe using AssemblyAI, or type/paste your transcript.
        </p>
      </div>

      {/* Processing indicator */}
      {isProcessing && (
        <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <p className="text-blue-700 dark:text-blue-300 text-sm sm:text-base">
            {assemblyAI.isTranscribing 
              ? 'Transcribing with AssemblyAI...' 
              : 'Processing audio...'}
          </p>
        </div>
      )}

      {/* Error display */}
      {currentError && (
        <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <p className="text-red-700 dark:text-red-300 text-sm sm:text-base">{currentError}</p>
          {currentError?.includes('API key') && (
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              💡 Add <code>VITE_ASSEMBLYAI_API_KEY</code> to your <code>.env</code> file.
            </p>
          )}
        </div>
      )}

      {/* Recording UI */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 mb-4 sm:mb-6">
        <div className="flex flex-col items-center">
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={isProcessing}
            className={`
              w-24 h-24 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all
              ${isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-purple-500 hover:bg-purple-600'}
              ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
              text-white shadow-lg touch-manipulation
            `}
          >
            {isRecording ? (
              <Square className="w-9 h-9 sm:w-8 sm:h-8 fill-current" />
            ) : (
              <Mic className="w-9 h-9 sm:w-8 sm:h-8" />
            )}
          </button>
          <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base">
            {isRecording
              ? 'Recording...'
              : isProcessing 
                ? 'Processing...' 
                : 'Click to start recording'}
          </p>
          {isRecording && (
            <div className="flex items-center gap-2 mt-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Speak now</span>
            </div>
          )}
        </div>
      </div>

      {/* Audio file info */}
      {recorder.audioBlob && !isRecording && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Recording ready</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {(recorder.audioBlob.size / 1024).toFixed(1)} KB • WebM
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleDownloadAudio}
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
              >
                <Download className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Download</span>
                <span className="sm:hidden">DL</span>
              </Button>
              {!assemblyAI.transcript && !assemblyAI.isTranscribing && (
                <Button
                  onClick={handleReTranscribe}
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  <Upload className="w-4 h-4 mr-1 sm:mr-2" />
                  Transcribe
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Transcript display */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Transcript
          {assemblyAI.isTranscribing && (
            <span className="ml-2 text-xs text-blue-500">(transcribing...)</span>
          )}
        </label>
        <textarea
          value={displayTranscript}
          onChange={(e) => handleTranscriptInput(e.target.value)}
          placeholder="Your transcript will appear here after recording, or type/paste text here..."
          className="w-full min-h-[150px] sm:min-h-[200px] p-3 sm:p-4 border border-slate-200 dark:border-slate-700 rounded-lg resize-y focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 text-sm sm:text-base bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
        />
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
          <Button
            onClick={handleCopy}
            disabled={!displayTranscript}
            variant="outline"
            className="text-sm"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy to Clipboard
          </Button>
          {displayTranscript && (
            <button
              onClick={handleClear}
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 px-2">
        <p>Audio is uploaded to AssemblyAI for transcription, or type/paste directly.</p>
        <p className="mt-1">Requires <code>VITE_ASSEMBLYAI_API_KEY</code> for voice transcription.</p>
      </div>
    </main>
  );
}
