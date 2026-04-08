import { useState } from 'react';
import { PatientForm } from '@/components/PatientForm/PatientForm';
import { FileCheck } from 'lucide-react';

export function PatientView() {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showSuccess ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <FileCheck className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Report Downloaded</h2>
          <p className="text-slate-600 mb-6">
            The patient-friendly PDF report has been generated and downloaded.
          </p>
          <button
            onClick={() => setShowSuccess(false)}
            className="px-6 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
          >
            Create Another Report
          </button>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">New Patient Report</h2>
            <p className="text-slate-600 mt-1">
              Complete the form below to generate a personalized prognosis document.
            </p>
          </div>
          <PatientForm onComplete={() => setShowSuccess(true)} />
        </>
      )}
    </main>
  );
}