import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { CaseAuthority } from '../lib/caseAuthorities';

export const CitedCasesList: React.FC<{ items: CaseAuthority[] }> = ({ items }) => (
  <ul className="space-y-5">
    {items.map((item, index) => <li key={`${item.text}-${index}`} className="min-w-0">
      {item.caseId ? <Link
        to={`/case-law/case/${encodeURIComponent(item.caseId)}`}
        className="flex min-w-0 items-start gap-3 rounded-lg border border-amber-200 bg-white p-5 text-base leading-8 text-neutral-800 transition-colors hover:border-amber-400 hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 sm:p-7 sm:text-[18px] sm:leading-9"
      >
        <span className="min-w-0 whitespace-pre-wrap break-words">{item.text}</span>
        <ArrowUpRight className="mt-1.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
      </Link> : <div className="min-w-0 rounded-lg border border-amber-100 bg-white p-5 text-base leading-8 text-neutral-800 sm:p-7 sm:text-[18px] sm:leading-9">
        <span className="whitespace-pre-wrap break-words">{item.text}</span>
      </div>}
    </li>)}
  </ul>
);
