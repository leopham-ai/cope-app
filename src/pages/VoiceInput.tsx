import { useState, useEffect } from 'react';
import { Mic, Square, Copy, Trash2, Upload, Download, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useAssemblyAITranscription } from '@/hooks/useAssemblyAIRest';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

type TranscriptionMode = 'assemblyai' | 'browser';

export function VoiceInput() {
  const [mode, setMode] = useState<TranscriptionMode>('assemblyai');
  const [manualTranscript, setManualTranscript] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [browserTranscript, setBrowserTranscript] = useState('');
  
  const recorder = useAudioRecorder();
  const assemblyAI = useAssemblyAITranscription();
  const speechRecognition = useSpeechRecognition();

  const isRecording = recorder.recordingState === 'recording';
  const isProcessing = recorder.recordingState === 'processing' || isUploading || assemblyAI.isTranscribing || speechRecognition.recordingState === 'processing';
  
  const displayTranscript = mode === 'assemblyai' 
    ? (assemblyAI.transcript || manualTranscript)
    : (speechRecognition.transcript || browserTranscript || manualTranscript);
  
  const currentError = recorder.error || assemblyAI.error || (mode === 'browser' ? speechRecognition.error : null);

  // When browser mode, start speech recognition when recording starts
  useEffect(() => {
    if (mode === 'browser' && isRecording && speechRecognition.recordingState === 'idle') {
      console.log('[VoiceInput] Browser mode - starting speech recognition');
      speechRecognition.startRecording();
    }
  }, [isRecording, mode]);

  // When recording stops in browser mode, stop speech recognition too
  useEffect(() => {
    if (mode === 'browser' && !isRecording && speechRecognition.recordingState === 'recording') {
      console.log('[VoiceInput] Browser mode - stopping speech recognition');
      speechRecognition.stopRecording();
    }
  }, [isRecording, mode]);

  const handleStartRecording = () => {
    console.log('[VoiceInput] Starting recording in', mode, 'mode');
    
    if (mode === 'browser') {
      // Browser mode - use Web Speech API directly
      speechRecognition.startRecording();
    }
    
    // Also start audio recording for download
    recorder.startRecording();
  };

  const handleStopRecording = async () => {
    console.log('[VoiceInput] Stopping recording');
    
    // Stop audio recording
    recorder.stopRecording();
    
    if (mode === 'browser') {
      // Stop speech recognition
      speechRecognition.stopRecording();
      // Use the speech recognition transcript
      setBrowserTranscript(speechRecognition.transcript || '');
    } else {
      // AssemblyAI mode - transcribe the recorded audio
      setTimeout(async () => {
        if (recorder.audioBlob) {
          console.log('[VoiceInput] Audio recorded, transcribing with AssemblyAI');
          setIsUploading(true);
          await assemblyAI.transcribe(recorder.audioBlob);
          setIsUploading(false);
        }
      }, 500);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayTranscript);
  };

  const handleClear = () => {
    recorder.resetRecording();
    assemblyAI.transcript && (assemblyAI.transcript = null);
    speechRecognition.resetTranscript();
    setBrowserTranscript('');
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
    if (!recorder.audioBlob || mode === 'browser') return;
    setIsUploading(true);
    await assemblyAI.transcribe(recorder.audioBlob);
    setIsUploading(false);
  };

  if (!recorder.isSupported && !speechRecognition.isSupported) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Voice Input</h2>
          <p className="text-slate-600 mt-1">
            Hands-free data entry using speech recognition.
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-700">
            Audio recording and speech recognition are not supported in this browser. Please use Chrome or Edge.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Voice Input</h2>
        <p className="text-slate-600 mt-1">
          Record audio and transcribe using speech recognition.
        </p>
      </div>

      {/* Mode selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setMode('assemblyai')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            mode === 'assemblyai'
              ? 'bg-purple-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          AssemblyAI
          <span className="text-xs opacity-75">(Cloud)</span>
        </button>
        <button
          onClick={() => setMode('browser')}
          disabled={!speechRecognition.isSupported}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            mode === 'browser'
              ? 'bg-purple-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          } ${!speechRecognition.isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Globe className="w-4 h-4" />
          Browser Speech
          <span className="text-xs opacity-75">(No API)</span>
        </button>
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <p className="text-green-700">
            {mode === 'browser' 
              ? 'Recording with Browser Speech...' 
              : 'Recording audio for AssemblyAI...'}
          </p>
          {mode === 'browser' && speechRecognition.transcript && (
            <span className="ml-auto text-sm text-slate-500">
              "{speechRecognition.transcript.substring(0, 50)}..."
            </span>
          )}
        </div>
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-blue-700">
            {assemblyAI.isTranscribing 
              ? 'Transcribing with AssemblyAI...' 
              : speechRecognition.recordingState === 'processing'
                ? 'Processing speech...'
                : 'Processing audio...'}
          </p>
        </div>
      )}

      {/* Error display */}
      {currentError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-700">{currentError}</p>
          {mode === 'browser' && currentError?.includes('network') && (
            <p className="mt-2 text-sm text-slate-600">
              💡 Browser speech uses Google's servers. If blocked, try AssemblyAI (cloud).
            </p>
          )}
          {mode === 'assemblyai' && currentError?.includes('API key') && (
            <p className="mt-2 text-sm text-slate-600">
              💡 Add <code>VITE_ASSEMBLYAI_API_KEY</code> to your <code>.env</code> file.
            </p>
          )}
        </div>
      )}

      {/* Recording UI */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 mb-6">
        <div className="flex flex-col items-center">
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={isProcessing}
            className={`
              w-20 h-20 rounded-full flex items-center justify-center transition-all
              ${isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-purple-500 hover:bg-purple-600'}
              ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
              text-white shadow-lg
            `}
          >
            {isRecording ? (
              <Square className="w-8 h-8 fill-current" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
          <p className="mt-4 text-slate-600 font-medium">
            {isRecording 
              ? 'Recording...' 
              : isProcessing 
                ? 'Processing...' 
                : 'Click to start recording'}
          </p>
          {isRecording && (
            <div className="flex items-center gap-2 mt-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm text-slate-500">Speak now</span>
            </div>
          )}
        </div>
      </div>

      {/* Audio file info */}
      {recorder.audioBlob && !isRecording && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Recording ready</p>
              <p className="text-xs text-slate-500">
                {(recorder.audioBlob.size / 1024).toFixed(1)} KB • WebM
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleDownloadAudio}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              {mode === 'assemblyai' && !assemblyAI.transcript && !assemblyAI.isTranscribing && (
                <Button
                  onClick={handleReTranscribe}
                  variant="outline"
                  size="sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Transcribe
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Transcript display */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Transcript
          {assemblyAI.isTranscribing && (
            <span className="ml-2 text-xs text-blue-500">(transcribing...)</span>
          )}
          {mode === 'browser' && speechRecognition.recordingState === 'recording' && (
            <span className="ml-2 text-xs text-green-500">(listening...)</span>
          )}
        </label>
        <textarea
          value={displayTranscript}
          onChange={(e) => setManualTranscript(e.target.value)}
          placeholder={
            mode === 'browser' 
              ? "Your speech will appear here in real-time..."
              : "Your transcript will appear here after recording..."
          }
          className="w-full min-h-[200px] p-4 border border-slate-200 rounded-lg resize-y focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
        <div className="flex gap-3 mt-4">
          <Button
            onClick={handleCopy}
            disabled={!displayTranscript}
            variant="outline"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy to Clipboard
          </Button>
          {displayTranscript && (
            <button
              onClick={handleClear}
              className="inline-flex items-center justify-center px-4 py-2.5 text-base font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Mode info */}
      <div className="mt-6 text-center text-sm text-slate-500">
        {mode === 'assemblyai' ? (
          <>
            <p>Audio is uploaded to AssemblyAI for transcription.</p>
            <p className="mt-1">Requires <code>VITE_ASSEMBLYAI_API_KEY</code> in environment.</p>
          </>
        ) : (
          <>
            <p>Speech recognition uses your browser's built-in Web Speech API.</p>
            <p className="mt-1">No API key needed, but may not work in all regions.</p>
          </>
        )}
      </div>
    </main>
  );
}
