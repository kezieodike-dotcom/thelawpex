import React, { useMemo } from 'react';
import { ExternalLink, FileText } from 'lucide-react';

interface OfficialTextReaderProps {
  title: string;
  documentText: string;
  documentPath?: string;
  pageCount?: number;
  documentLabel?: string;
}

const legalDocumentFont =
  '"Book Antiqua", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif';

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
      className="lawpex-no-reveal overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-sm"
      aria-label={`${title} text reader`}
    >
      <div className="flex flex-col gap-3 border-b border-neutral-200 bg-neutral-950 px-4 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-5">
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

      <div className="max-h-[72vh] overflow-y-auto bg-neutral-100 px-2 py-4 sm:max-h-[52rem] sm:px-6 sm:py-7 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {pages.map((page, index) => (
            <article
              key={`${page.pageNumber || 'page'}-${index}`}
              className="rounded-md border border-neutral-200 bg-white px-4 py-6 text-neutral-900 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)] sm:px-8 sm:py-9 lg:px-12"
            >
              {page.pageNumber && (
                <p className="mb-5 border-b border-neutral-200 pb-3 text-[11px] font-black uppercase tracking-wider text-yellow-700">
                  Page {page.pageNumber}
                </p>
              )}
              <pre
                className="whitespace-pre-wrap break-words text-[16px] leading-[1.9] text-neutral-900 sm:text-[17px]"
                style={{ fontFamily: legalDocumentFont }}
              >
                {page.rawText}
              </pre>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
