import  { forwardRef } from 'react';

const Input = forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div className="space-y-1 text-left">
      {label && (
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        {...props}
        className={`w-full p-3 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl border outline-none transition-all ${
          error
            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-gray-200 dark:border-slate-700 focus:border-red-500'
        }`}
      />
      {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;