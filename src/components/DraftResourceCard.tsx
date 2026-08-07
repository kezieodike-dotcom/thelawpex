import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { AreaDraftResource } from '../types';
import { DocumentActions } from './DocumentActions';
import { buildWordDraft } from '../lib/copyToWord';

interface DraftResourceCardProps {
  draft: AreaDraftResource;
  /** Shown above the title, e.g. "Petitioner — Sample Process 1". */
  eyebrow?: string;
  /** Line printed under the title in the Word document. */
  wordSubtitle?: string;
  /** Whether the sample text starts open. */
  defaultOpen?: boolean;
}

/**
 * One sample court process: what it is, the full court-ready text, and the controls
 * that take it into MS Word.
 */
export const DraftResourceCard: React.FC<DraftResourceCardProps> = ({
  draft,
  eyebrow,
  wordSubtitle = '',
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-yellow-100 transition"
      >
        <div className="flex gap-3">
          <FileText className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
          <div>
            {eyebrow && (
              <span className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider block">
                {eyebrow}
              </span>
            )}
            <h4 className="text-sm font-bold font-serif text-neutral-900">{draft.title}</h4>
            <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">{draft.description}</p>
          </div>
        </div>

        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-yellow-700 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-neutral-200 p-4 space-y-3">
          <pre className="bg-white border border-neutral-200 rounded-xl p-4 text-[11px] leading-relaxed text-neutral-800 whitespace-pre-wrap font-mono overflow-x-auto max-h-[32rem] overflow-y-auto">
            {draft.sampleText}
          </pre>

          <DocumentActions
            html={buildWordDraft(draft.title, wordSubtitle, draft.sampleText)}
            filename={draft.title}
            hint="Copy this process to MS Word, then replace the bracketed placeholders."
          />
        </div>
      )}
    </div>
  );
};
