import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = '', value, onChange, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <input
        className={`w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
          disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors
          placeholder:text-slate-400 dark:placeholder:text-slate-500 ${className}`}
        value={value}
        onChange={onChange}
        {...props}
      />
      {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
}
