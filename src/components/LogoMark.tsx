import React from 'react';

/**
 * The official LAWPEX logo supplied by the product team.
 *
 * The image is kept local so the brand remains available offline and in the
 * production build.
 *
 * Replacing it with commissioned artwork is a matter of dropping the file in and
 * pointing `LOGO_SRC` at it; nothing else needs to change.
 */
export const LOGO_SRC = '/lawpex-official-logo.jpg';

interface LogoMarkProps {
  /**
   * Utilities for the frame — size, corner radius and shadow, e.g.
   * `"w-10 h-10 rounded-lg shadow-lg shadow-yellow-500/25"`.
   */
  className?: string;
  /**
   * Leave empty where a visible "LAWPEX" wordmark sits beside the mark, so screen
   * readers do not announce the brand twice.
   */
  alt?: string;
}

/** The LAWPEX logo in its brand frame. */
export const LogoMark: React.FC<LogoMarkProps> = ({
  className = 'w-10 h-10 rounded-lg',
  alt = 'LAWPEX official logo',
}) => (
  <span className={`flex items-center justify-center overflow-hidden shrink-0 ${className}`}>
    <img
      src={LOGO_SRC}
      alt={alt}
      width={64}
      height={64}
      decoding="async"
      className="h-full w-full scale-[1.1] object-cover object-center"
    />
  </span>
);
