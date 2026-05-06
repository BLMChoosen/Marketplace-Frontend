export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading = false,
  ...props 
}) {
  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";
  
  const variants = {
    primary: "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5",
    secondary: "bg-secondary hover:bg-secondary-hover text-white border border-white/10 hover:border-white/20",
    accent: "bg-accent hover:bg-accent-hover text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5",
    ghost: "bg-transparent hover:bg-white/5 text-gray-300 hover:text-white"
  };

  const sizes = {
    sm: "text-sm px-4 py-2",
    md: "text-base px-6 py-3",
    lg: "text-lg px-8 py-4"
  };

  const sizeClass = sizes[props.size || 'md'];
  const variantClass = variants[variant];

  return (
    <button 
      className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processando...
        </span>
      ) : (
        <span className="relative z-10">{children}</span>
      )}
      
      {/* Ripple/Shine effect on hover */}
      {!isLoading && !props.disabled && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />
      )}
    </button>
  );
}
