import React, { useEffect, useRef, useState } from 'react';
import { FileText } from 'lucide-react';
import { renderAsync } from 'docx-preview';

interface DocxPreviewProps {
  src: string;
  onHtmlReady?: (html: string) => void;
}

/** Renders an uploaded Word file in the reader before export actions are offered. */
export const DocxPreview: React.FC<DocxPreviewProps> = ({ src, onHtmlReady }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return undefined;

    container.replaceChildren();
    setStatus('loading');

    fetch(src)
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load ${src}`);
        return response.arrayBuffer();
      })
      .then((buffer) => renderAsync(buffer, container, undefined, { inWrapper: false }))
      .then(() => {
        if (cancelled) return;
        setStatus('ready');
        onHtmlReady?.(container.innerHTML);
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [onHtmlReady, src]);

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-100 p-3 sm:p-6">
      {status === 'loading' && (
        <div className="flex min-h-40 items-center justify-center gap-2 text-sm font-semibold text-neutral-600">
          <FileText className="h-4 w-4 text-yellow-700" /> Preparing the Word document preview…
        </div>
      )}
      {status === 'error' && (
        <div className="min-h-40 rounded-lg bg-white p-5 text-sm leading-7 text-red-800">
          The Word document preview could not be loaded. The original file is available below.
        </div>
      )}
      <div ref={containerRef} className={status === 'ready' ? 'docx-preview-surface' : 'hidden'} />
    </div>
  );
};
