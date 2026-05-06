export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  isLoading = false,
  ...props
}) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-bold transition-all duration-300 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A30015]/60 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden select-none';

  const variants = {
    primary:
      'bg-[#A30015] hover:bg-[rgb(122,0,16)] text-white shadow-[0_10px_30px_-12px_rgba(163,0,21,0.7)] hover:shadow-[0_14px_40px_-12px_rgba(163,0,21,0.9)] hover:-translate-y-0.5 border border-[rgba(163,0,21,0.6)]',
    secondary:
      'bg-[rgb(20,20,19)] hover:bg-[rgb(34,34,38)] text-white border border-[rgba(255,255,255,0.08)] hover:border-[rgba(163,0,21,0.5)]',
    accent:
      'bg-[rgb(122,0,16)] hover:bg-[#A30015] text-white shadow-[0_10px_30px_-12px_rgba(163,0,21,0.7)] hover:-translate-y-0.5',
    ghost:
      'bg-transparent hover:bg-[rgba(163,0,21,0.08)] text-[rgb(161,161,170)] hover:text-white border border-transparent hover:border-[rgba(163,0,21,0.3)]',
    outline:
      'bg-transparent text-white border border-[rgba(163,0,21,0.6)] hover:bg-[#A30015] hover:border-[#A30015]',
  };

  const sizes = {
    sm: 'text-sm px-4 py-2 min-h-9',
    md: 'text-base px-6 py-3 min-h-11',
    lg: 'text-lg px-8 py-4 min-h-[3.25rem]',
  };

  const sizeClass = sizes[size] || sizes.md;
  const variantClass = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
      disabled={isLoading || props.disabled}
      aria-busy={isLoading || undefined}
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
        <span className="relative z-10 inline-flex items-center justify-center gap-2">{children}</span>
      )}
    </button>
  );
}
