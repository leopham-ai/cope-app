import { useState } from 'react';
import { Mic, Square, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

export function VoiceInput() {
  const [localTranscript, setLocalTranscript] = useState('');
  const [copied, setCopied] = useState(false);

  // Browser-native Web Speech API hook
  const webSpeech = useSpeechRecognition();
  
  const displayTranscript = webSpeech.transcript || localTranscript;
  const isRecording = webSpeech.recordingState === 'recording';
  const isProcessing = webSpeech.recordingState === 'processing';
  const isDisabled = isProcessing;
  const activeError = webSpeech.error;

  const handleStartRecording = () => {
    console.log('[VoiceInput] Starting recording with browser Web Speech API');
    webSpeech.startRecording();
  };

  const handleStopRecording = () => {
    console.log('[VoiceInput] Stopping recording');
    webSpeech.stopRecording();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayTranscript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    webSpeech.resetTranscript();
    setLocalTranscript('');
  };

  // Browser not supported
  if (!webSpeech.isSupported) {
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
            Speech recognition is not supported in this browser. Please use Chrome or Edge.
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
          Hands-free data entry using speech recognition.
        </p>
      </div>

      {/* Error display */}
      {activeError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-700">{activeError}</p>
          {activeError.includes('network') && (
            <p className="mt-2 text-sm text-slate-600">
              💡 Browser speech requires internet access to Google's servers. 
              Try a different network or use a VPN.
            </p>
          )}
        </div>
      )}

      {/* Recording UI */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 mb-6">
        <div className="flex flex-col items-center">
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={isDisabled}
            className={`
              w-20 h-20 rounded-full flex items-center justify-center transition-all
              ${isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-purple-500 hover:bg-purple-600'}
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
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

      {/* Transcript display */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Transcript
        </label>
        <textarea
          value={displayTranscript}
          onChange={(e) => setLocalTranscript(e.target.value)}
          placeholder="Your transcript will appear here in real-time..."
          className="w-full min-h-[200px] p-4 border border-slate-200 rounded-lg resize-y focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
        <div className="flex gap-3 mt-4">
          <Button
            onClick={handleCopy}
            disabled={!displayTranscript}
            variant="outline"
          >
            <Copy className="w-4 h-4 mr-2" />
            {copied ? 'Copied!' : 'Copy to Clipboard'}
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
    </main>
  );
}
