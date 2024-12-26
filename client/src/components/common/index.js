export const Card = ({ children, className = '' }) => (
  <div className={`bg-background-secondary rounded-xl p-6 shadow-lg ${className}`}>
    {children}
  </div>
);

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-300';
  const variants = {
    primary: 'bg-accent-primary hover:bg-accent-primary/90 text-white',
    secondary: 'bg-accent-secondary hover:bg-accent-secondary/90 text-white',
    outline: 'border-2 border-accent-primary hover:bg-accent-primary/10',
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full px-4 py-2 bg-background-tertiary border border-gray-700 
                rounded-lg focus:outline-none focus:border-accent-primary 
                transition-all duration-300 ${className}`}
    {...props}
  />
); 