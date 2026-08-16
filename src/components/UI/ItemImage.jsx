import { useState } from 'react';

export function ItemImage({
  src,
  alt,
  className = '',
  fallbackLabel = 'Нет фото',
  loading = 'lazy',
}) {
  const [failedSrc, setFailedSrc] = useState(null);
  const canShowImage = Boolean(src) && failedSrc !== src;

  if (canShowImage) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        onError={() => setFailedSrc(src)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={src ? `${alt}: изображение недоступно` : fallbackLabel}
      className={`flex items-center justify-center border border-dashed border-slate-700 text-center text-xs text-slate-500 ${className}`}
    >
      {src ? 'Фото недоступно' : fallbackLabel}
    </div>
  );
}
