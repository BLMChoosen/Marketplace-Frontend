'use client';

export function resolveImageUrl(value) {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;

  const cdnBase = (process.env.NEXT_PUBLIC_CDN_URL || '').replace(/\/+$/, '');
  const key = String(value).replace(/^\/+/, '');

  if (cdnBase) return `${cdnBase}/${key}`;
  return `/${key}`;
}
