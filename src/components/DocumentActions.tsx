import React, { useState } from 'react';
import { Copy, Check, FileDown } from 'lucide-react';
import { copyToWord, downloadAsWord } from '../lib/copyToWord';

interface DocumentActionsProps {
  /** Word-ready HTML for the block being copied. */
  html: string;
  /** File name used when downloading, without extension. */
  filename: string;
  /** Short line telling the user what the buttons do. */
  hint?: string;
  className?: string;
}

/**
 * Copy-to-Word and download controls shown beneath every principle, judgment,
 * rule and draft so the text can be taken straight into MS Word.
 */
export const DocumentActions: React.FC<DocumentActionsProps> = ({
  html,
  filename,
  hint = 'Copy to MS Word — formatting is preserved when you paste.',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToWord(html);
    setFailed(!ok);
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-[11px] px-3 py-1.5 rounded-lg transition"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? 'Copied to clipboard' : 'Copy to MS Word'}
      </button>

      <button
        onClick={() => downloadAsWord(html, filename)}
        className="inline-flex items-center gap-1.5 bg-white hover:bg-yellow-100 text-neutral-800 border border-neutral-200 hover:border-yellow-500/80 font-medium text-[11px] px-3 py-1.5 rounded-lg transition"
      >
        <FileDown className="w-3.5 h-3.5 text-yellow-700" />
        Download .doc
      </button>

      <span className={`text-[11px] ${failed ? 'text-red-600' : 'text-neutral-500'}`}>
        {failed ? 'Clipboard blocked by the browser — use Download .doc instead.' : hint}
      </span>
    </div>
  );
};
