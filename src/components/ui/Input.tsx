import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = '', value, onChange, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        className={`w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
          disabled:bg-slate-100 disabled:cursor-not-allowed transition-colors ${className}`}
        value={value}
        onChange={onChange}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
