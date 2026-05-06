export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold uppercase text-[rgb(161,161,170)] ml-0.5">
          {label}
        </label>
      )}
      <input
        className={`
          bm-field px-4 py-3
          ${error
            ? 'border-[#A30015] focus:ring-[#A30015]/60 focus:border-[#A30015]'
            : 'border-[rgba(255,255,255,0.06)] hover:border-[rgba(163,0,21,0.35)]'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-[#A30015] ml-1">
          {error}
        </span>
      )}
    </div>
  );
}
