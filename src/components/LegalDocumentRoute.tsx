import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { ConstitutionReader } from './ConstitutionReader';
import { constitution1999Text } from '../data/constitution1999Text';
import { FEDERAL_LAWS } from '../data/lawsLibrary';
import { ruleBookById } from '../data/courtRules';

interface LegalDocumentRouteProps {
  kind: 'constitution' | 'document';
  documentId?: string;
  sectionId?: string;
}

const LegalDocumentRoute: React.FC<LegalDocumentRouteProps> = ({ kind, documentId, sectionId }) => {
  const law = kind === 'document' && documentId
    ? FEDERAL_LAWS.find((entry) => entry.id === documentId)
    : undefined;
  const book = kind === 'document' && documentId ? ruleBookById(documentId) : undefined;
  const initialText = kind === 'constitution'
    ? constitution1999Text
    : law?.documentText ?? book?.documentText ?? '';
  const documentTextLoader = law?.documentTextLoader ?? book?.documentTextLoader;
  const [documentText, setDocumentText] = useState(initialText);
  const [documentLoading, setDocumentLoading] = useState(Boolean(documentTextLoader && !initialText));

  useEffect(() => {
    let cancelled = false;

    if (kind === 'constitution' || initialText || !documentTextLoader) {
      setDocumentText(initialText);
      setDocumentLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setDocumentText('');
    setDocumentLoading(true);
    documentTextLoader()
      .then((text) => {
        if (!cancelled) setDocumentText(text);
      })
      .catch(() => {
        if (!cancelled) setDocumentText('');
      })
      .finally(() => {
        if (!cancelled) setDocumentLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [documentId, documentTextLoader, initialText, kind]);

  if (kind === 'constitution') {
    return (
      <ConstitutionReader
        documentText={documentText}
        documentPath="/documents/laws/constitution-1999-as-amended.pdf"
        pageCount={280}
        initialSectionId={sectionId ? `constitution-section-${sectionId.toLowerCase()}` : undefined}
      />
    );
  }

  if (documentLoading) {
    return (
      <div className="min-h-screen bg-white px-4 py-16 text-center text-sm font-semibold text-neutral-700">
        Loading the searchable source text…
      </div>
    );
  }

  if (law && documentText) {
    return (
      <ConstitutionReader
        documentText={documentText}
        title={law.title}
        documentLabel={`${law.citation} · ${law.year} · Official source text`}
        documentId={law.id}
        backPath="/nigerian-laws/federation"
        documentPath={law.documentPath}
        pageCount={law.documentPages}
        initialSectionId={sectionId ? `${law.id}-section-${sectionId.toLowerCase()}` : undefined}
      />
    );
  }

  if (book && documentText) {
    return (
      <ConstitutionReader
        documentText={documentText}
        title={book.edition}
        documentLabel={`${book.courtName}${book.year ? ` · ${book.year}` : ''} · Official source text`}
        documentId={`rules-${book.id}`}
        backPath={`/court-rules/${book.category}`}
        documentPath={book.documentPath}
        pageCount={book.documentPages}
        initialSectionId={sectionId ? `rules-${book.id}-section-${sectionId.toLowerCase()}` : undefined}
      />
    );
  }

  return <Navigate to="/nigerian-laws/federation" replace />;
};

export default LegalDocumentRoute;
