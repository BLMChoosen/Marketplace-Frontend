import Image from 'next/image';

const sizes = {
  sm: 'w-9 h-9',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export default function BrandMark({
  size = 'md',
  alt = 'Bloodmoon Marketplace',
  className = '',
  priority = false,
}) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-black border border-[#A30015] text-[#A30015] shadow-[0_0_22px_-6px_rgba(163,0,21,0.7)] ${sizes[size] || sizes.md} ${className}`}
    >
      <Image
        src="/logo.png"
        alt={alt}
        fill
        sizes="48px"
        priority={priority}
        className="object-contain scale-[4.15]"
      />
    </span>
  );
}
