import React from 'react';

/**
 * The LAWPEX logo (`public/logo.svg`) — a balance in near-black on the brand yellow.
 *
 * It is vector artwork carrying its own background plate, so the mark is drawn
 * edge to edge and stays crisp at every size the site renders it.
 *
 * Replacing it with commissioned artwork is a matter of dropping the file in and
 * pointing `LOGO_SRC` at it; nothing else needs to change.
 */
export const LOGO_SRC = '/logo.svg';

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
  alt = '',
}) => (
  <span className={`flex items-center justify-center overflow-hidden shrink-0 ${className}`}>
    <img
      src={LOGO_SRC}
      alt={alt}
      width={64}
      height={64}
      decoding="async"
      className="w-full h-full object-contain"
    />
  </span>
);
