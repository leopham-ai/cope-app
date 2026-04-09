import { useState } from 'react';
import { Mic, Square, Copy, Trash2, WifiOff, RefreshCw, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useWhisperSTT } from '@/hooks/useWhisperSTT';
import { useGoogleCloudSTT } from '@/hooks/useGoogleCloudSTT';

type STTProvider = 'webspeech' | 'whisper' | 'googlecloud';

export function VoiceInput() {
  const [sttProvider, setSttProvider] = useState<STTProvider>('googlecloud');
  const [transcript, setTranscript] = useState('');
  const [copied, setCopied] = useState(false);

  // Web Speech API hook (browser native)
  const webSpeech = useSpeechRecognition();

  // Whisper STT hook (local, no server needed)
  const whisper = useWhisperSTT();

  // Google Cloud Speech-to-Text hook (API key required)
  const googleCloud = useGoogleCloudSTT();

  // Determine which provider is active
  const getActiveProvider = () => {
    switch (sttProvider) {
      case 'webspeech':
        return webSpeech;
      case 'whisper':
        return whisper;
      case 'googlecloud':
        return googleCloud;
    }
  };

  const activeProvider = getActiveProvider();
  
  const displayTranscript = sttProvider === 'webspeech' 
    ? (webSpeech.transcript || transcript)
    : sttProvider === 'whisper'
      ? (whisper.transcript || transcript)
      : (googleCloud.transcript || transcript);
  
  const isRecording = sttProvider === 'webspeech' 
    ? webSpeech.recordingState === 'recording'
    : sttProvider === 'whisper'
      ? whisper.status === 'recording'
      : googleCloud.recordingState === 'recording';
  
  const isProcessing = sttProvider === 'webspeech'
    ? webSpeech.recordingState === 'processing'
    : sttProvider === 'whisper'
      ? whisper.status === 'processing' || whisper.status === 'loading'
      : googleCloud.status === 'loading';
  
  const isDisabled = isProcessing || 
    (sttProvider === 'whisper' && whisper.status === 'loading') ||
    (sttProvider === 'googlecloud' && googleCloud.status === 'loading');
  
  const activeError = sttProvider === 'webspeech' 
    ? webSpeech.error 
    : sttProvider === 'whisper'
      ? whisper.error
      : googleCloud.error;

  // Check if we should show fallback options
  const showFallback = (sttProvider === 'webspeech' && webSpeech.error) ||
    (sttProvider === 'googlecloud' && googleCloud.error);

  const handleStartRecording = async () => {
    switch (sttProvider) {
      case 'webspeech':
        webSpeech.startRecording();
        break;
      case 'whisper':
        whisper.startRecording();
        break;
      case 'googlecloud':
        googleCloud.startRecording();
        break;
    }
  };

  const handleStopRecording = () => {
    switch (sttProvider) {
      case 'webspeech':
        webSpeech.stopRecording();
        break;
      case 'whisper':
        whisper.stopRecording();
        break;
      case 'googlecloud':
        googleCloud.stopRecording();
        break;
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayTranscript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    webSpeech.resetTranscript();
    whisper.resetTranscript();
    googleCloud.resetTranscript();
    setTranscript('');
  };

  // All not supported
  const anySupported = webSpeech.isSupported || whisper.isSupported || googleCloud.isSupported;
  if (!anySupported) {
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
            No speech recognition is supported in this browser. Please use Chrome or Edge.
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

      {/* Provider selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSttProvider('googlecloud')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            sttProvider === 'googlecloud'
              ? 'bg-purple-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Cloud className="w-4 h-4" />
          Google Cloud (Recommended)
        </button>
        <button
          onClick={() => setSttProvider('webspeech')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            sttProvider === 'webspeech'
              ? 'bg-purple-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Browser Speech
        </button>
        <button
          onClick={() => setSttProvider('whisper')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            sttProvider === 'whisper'
              ? 'bg-purple-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <WifiOff className="w-4 h-4" />
          Whisper AI (Local)
        </button>
      </div>

      {/* Loading/Ready indicators */}
      {sttProvider === 'whisper' && whisper.status === 'loading' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
          <p className="text-blue-700">
            Loading Whisper AI model (~75MB, downloaded once and cached)...
          </p>
        </div>
      )}

      {sttProvider === 'googlecloud' && googleCloud.status === 'loading' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
          <p className="text-blue-700">
            Connecting to Google Cloud Speech API...
          </p>
        </div>
      )}

      {sttProvider === 'googlecloud' && googleCloud.status === 'recording' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <Cloud className="w-5 h-5 text-green-500" />
          <p className="text-green-700">
            Connected to Google Cloud - Recording audio...
          </p>
        </div>
      )}

      {/* Error display */}
      {activeError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-700">{activeError}</p>
          {showFallback && (
            <p className="mt-2 text-sm text-slate-600">
              💡 Try switching to a different provider above.
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
                : sttProvider === 'whisper' && whisper.status === 'loading'
                  ? 'Loading model...'
                  : sttProvider === 'googlecloud' && googleCloud.status === 'loading'
                    ? 'Connecting...'
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
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={
            sttProvider === 'whisper' 
              ? "Your transcript will appear here after recording..." 
              : sttProvider === 'googlecloud'
                ? "Your transcript will appear here in real-time..."
                : "Your transcript will appear here..."
          }
          className="w-full min-h-[200px] p-4 border border-slate-200 rounded-lg resize-y focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          readOnly={isRecording}
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
