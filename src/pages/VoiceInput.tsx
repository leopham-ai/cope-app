import { Mic } from 'lucide-react';

export function VoiceInput() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Voice Input</h2>
        <p className="text-slate-600 mt-1">
          Hands-free data entry using speech recognition.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-12">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
            <Mic className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Coming Soon</h3>
          <p className="text-slate-600 max-w-md mx-auto">
            Voice input functionality is under development. This feature will allow 
            providers to dictate patient information directly into the form using 
            speech recognition technology.
          </p>
        </div>
      </div>
    </main>
  );
}