import { ClipboardList } from 'lucide-react';

export function ProviderView() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Provider View</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Detailed clinical interface for healthcare providers.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Coming Soon</h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            The Provider View interface is under development. This view will include 
            detailed clinical notes, advanced prognosis tools, and provider collaboration features.
          </p>
        </div>
      </div>
    </main>
  );
}