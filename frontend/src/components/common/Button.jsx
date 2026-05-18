import clsx from 'clsx';
import Loader from './Loader';

const Button = ({ 
  children, 
  variant = 'primary', 
  className, 
  loading = false, 
  disabled, 
  fullWidth, 
  icon: Icon,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-accent text-white hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-md focus:ring-primary-accent",
    secondary: "bg-white text-text-primary border border-border-color hover:bg-slate-50 hover:shadow-sm focus:ring-slate-200",
    danger: "bg-danger/10 text-danger border border-danger/20 hover:bg-danger hover:text-white focus:ring-danger",
    ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-slate-100 focus:ring-slate-200"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes.md,
        fullWidth ? "w-full" : "",
        className
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <Loader size="sm" color={variant === 'primary' ? 'white' : 'primary'} className="mr-2" />
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
