import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly string[] | string[];
  error?: string;
}

export function Select({ label, options, error, className = '', value, onChange, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <select
        className={`w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
          disabled:bg-slate-100 disabled:cursor-not-allowed transition-colors ${className}`}
        value={value}
        onChange={onChange}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
