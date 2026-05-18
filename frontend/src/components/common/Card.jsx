import clsx from 'clsx';

const Card = ({ children, className, noPadding = false }) => {
  return (
    <div 
      className={clsx(
        "bg-card-bg border border-border-color shadow-soft rounded-2xl overflow-hidden transition-all duration-300",
        !noPadding && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
