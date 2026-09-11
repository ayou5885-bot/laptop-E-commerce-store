import { useState, useEffect, type ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover' | 'fill';
  fallbackLabel?: string;
}

export default function OptimizedImage({
  src,
  alt,
  aspectRatio = '4/3',
  objectFit = 'contain',
  fallbackLabel,
  className = '',
  ...imgProps
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setErrored(false);
  }, [src]);

  const containerStyle: React.CSSProperties = { aspectRatio };
  const objectFitClass =
    objectFit === 'cover'
      ? 'object-cover'
      : objectFit === 'fill'
        ? 'object-fill'
        : 'object-contain';

  return (
    <div
      className={`relative overflow-hidden bg-gray-50 ${className}`}
      style={containerStyle}
    >
      {!loaded && !errored && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-100 to-gray-200" />
      )}
      {errored ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-100">
          <svg
            className="h-10 w-10 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {fallbackLabel && (
            <span className="text-xs font-medium text-gray-400">{fallbackLabel}</span>
          )}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`h-full w-full transition-opacity duration-300 ${objectFitClass} ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...imgProps}
        />
      )}
    </div>
  );
}
