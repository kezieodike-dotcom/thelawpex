import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';

interface OfficialPdfReaderProps {
  title: string;
  documentPath: string;
  pageCount?: number;
  documentLabel?: string;
}

export const OfficialPdfReader: React.FC<OfficialPdfReaderProps> = ({
  title,
  documentPath,
  pageCount,
  documentLabel = 'Official Gazette',
}) => (
  <section
    className="overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-sm"
    aria-label={`${title} document reader`}
  >
    <div className="flex flex-col gap-3 border-b border-neutral-200 bg-neutral-950 px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-400 text-neutral-950">
          <FileText className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{title}</p>
          <p className="text-xs text-neutral-300">
            Official PDF · {documentLabel}{pageCount ? ` · ${pageCount} pages` : ''}
          </p>
        </div>
      </div>

      <a
        href={documentPath}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 text-sm font-bold text-neutral-950 transition hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-neutral-950"
      >
        Open full screen
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>

    <iframe
      src={`${documentPath}#view=FitH`}
      title={`${title} official PDF`}
      loading="lazy"
      className="h-[72vh] min-h-[36rem] w-full bg-neutral-100 sm:min-h-[44rem] lg:h-[52rem]"
    />
  </section>
);
