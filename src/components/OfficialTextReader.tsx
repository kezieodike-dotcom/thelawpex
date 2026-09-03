import React, { useMemo } from 'react';
import { ExternalLink, FileText } from 'lucide-react';

interface OfficialTextReaderProps {
  title: string;
  documentText: string;
  documentPath?: string;
  pageCount?: number;
  documentLabel?: string;
}

export const OfficialTextReader: React.FC<OfficialTextReaderProps> = ({
  title,
  documentText,
  documentPath,
  pageCount,
  documentLabel = 'Official Gazette',
}) => {
  const pages = useMemo(
    () =>
      documentText
        .split(/\n\n(?=## Page \d+\n\n?)/)
        .map((chunk) => {
          const match = chunk.match(/^## Page (\d+)\n\n?([\s\S]*)$/);
          return {
            pageNumber: match?.[1] ?? '',
            rawText: match?.[2] ?? chunk,
          };
        }),
    [documentText],
  );

  return (
    <section
      className="lawpex-no-reveal overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-sm"
      aria-label={`${title} text reader`}
    >
      <div className="flex flex-col gap-3 border-b border-neutral-200 bg-neutral-950 px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-400 text-neutral-950">
            <FileText className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{title}</p>
            <p className="text-xs text-neutral-300">
              Selectable text - {documentLabel}{pageCount ? ` - ${pageCount} pages` : ''}
            </p>
          </div>
        </div>

        {documentPath && (
          <a
            href={documentPath}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 text-sm font-bold text-neutral-950 transition hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-neutral-950 active:translate-y-px"
          >
            Official PDF
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      <div className="max-h-[72vh] overflow-y-auto bg-neutral-50 px-3 py-5 sm:max-h-[52rem] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-5">
          {pages.map((page, index) => (
            <article
              key={`${page.pageNumber || 'page'}-${index}`}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-5 text-neutral-900 sm:px-7 sm:py-8"
            >
              {page.pageNumber && (
                <p className="mb-4 border-b border-neutral-200 pb-2 text-[11px] font-black uppercase tracking-wider text-yellow-700">
                  Page {page.pageNumber}
                </p>
              )}
              <pre className="whitespace-pre-wrap break-words font-serif text-[15px] leading-8 text-neutral-800 sm:text-base">
                {page.rawText}
              </pre>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
