import clsx from 'clsx';

const Loader = ({ size = 'md', color = 'primary', className }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };

  const colors = {
    primary: 'border-primary-accent border-t-transparent',
    white: 'border-white border-t-transparent',
    dark: 'border-primary-dark border-t-transparent'
  };

  return (
    <div 
      className={clsx(
        "animate-spin rounded-full",
        sizes[size],
        colors[color],
        className
      )}
    />
  );
};

export default Loader;
