export default function Input({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-300 ml-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-lg bg-secondary/50 border 
          backdrop-blur-sm transition-all duration-300
          text-white placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          ${error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : 'border-white/10 hover:border-white/20'}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-400 ml-1 animate-pulse">
          {error}
        </span>
      )}
    </div>
  );
}
