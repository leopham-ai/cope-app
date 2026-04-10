import type { InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        className="w-5 h-5 rounded border-slate-300 dark:border-slate-500 text-teal-600 dark:text-teal-500 focus:ring-teal-500 cursor-pointer bg-white dark:bg-slate-700"
        {...props}
      />
      <span className="text-slate-700 dark:text-slate-300">{label}</span>
    </label>
  );
}
