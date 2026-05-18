import { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(({ 
  label, 
  error, 
  icon: Icon, 
  className, 
  containerClassName,
  ...props 
}, ref) => {
  return (
    <div className={clsx("w-full", containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-text-secondary" />
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            "w-full bg-white border rounded-xl px-4 py-2.5 text-text-primary placeholder:text-slate-400 transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:border-transparent",
            error 
              ? "border-danger focus:ring-danger/20" 
              : "border-border-color focus:ring-primary-accent/20 focus:border-primary-accent",
            Icon && "pl-10",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-danger animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
