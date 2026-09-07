import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  BookOpen,
  UserCheck,
  FileText,
} from 'lucide-react';
import {
  AFFIDAVITS,
  AFFIDAVIT_CATEGORIES,
  affidavitById,
  affidavitCategoryById,
  affidavitsInCategory,
  searchAffidavits,
} from '../../data/affidavits';
import { AffidavitTemplate, LegalDraft } from '../../types';
import { DocumentActions } from '../DocumentActions';
import { buildWordDraft, buildWordList } from '../../lib/copyToWord';

interface AffidavitsViewProps {
  onCustomizeDraft: (draft: LegalDraft) => void;
  /** Category taken from the URL (`/affidavits/:categoryId`). */
  categoryId?: string;
  /** Affidavit taken from the URL (`/affidavits/deposition/:affidavitId`). */
  affidavitId?: string;
}

const SAMPLE_AGREEMENTS: LegalDraft[] = [
  {
    id: 'agreement-mou-turve-anambra-tech',
    title: 'MOU Turve Anambra Tech',
    category: 'Commercial',
    areaOfLaw: 'Memorandum of Understanding',
    description: 'Original uploaded MOU document.',
    courtHeadingRequired: false,
    sampleText: '',
    variables: [],
    downloadCount: 0,
    isCustomizableWithAI: false,
    documentPath: '/documents/agreements/mou-turve-anambra-tech.docx',
  },
  {
    id: 'agreement-tenancy',
    title: 'Residential Tenancy Agreement',
    category: 'Property',
    areaOfLaw: 'Landlord and Tenant',
    description: 'A sample lease for residential premises covering rent, term, repairs, use, default and recovery of possession.',
    courtHeadingRequired: false,
    sampleText: `RESIDENTIAL TENANCY AGREEMENT

THIS AGREEMENT is made this [DAY] day of [MONTH], 20[__]

BETWEEN:
[LANDLORD NAME] of [ADDRESS] (the Landlord)

AND

[TENANT NAME] of [ADDRESS] (the Tenant)

1. The Landlord lets to the Tenant the premises known as [PROPERTY ADDRESS].
2. The tenancy shall be for [TERM] commencing on [DATE].
3. The rent shall be N[AMOUNT] per [MONTH/YEAR], payable [PAYMENT TERMS].
4. The Tenant shall use the premises for residential purposes only.
5. Either party may terminate this tenancy by the notice required by law.`,
    variables: ['landlord', 'tenant', 'propertyAddress', 'rent', 'term'],
    downloadCount: 1840,
    isCustomizableWithAI: true,
  },
  {
    id: 'agreement-sale-of-land',
    title: 'Sale of Land Agreement',
    category: 'Property',
    areaOfLaw: 'Real Estate Transactions',
    description: 'A sample agreement for sale of land with purchase price, completion, title documents and possession clauses.',
    courtHeadingRequired: false,
    sampleText: `AGREEMENT FOR SALE OF LAND

THIS AGREEMENT is made this [DAY] day of [MONTH], 20[__]

BETWEEN:
[VENDOR NAME] of [ADDRESS] (the Vendor)

AND

[PURCHASER NAME] of [ADDRESS] (the Purchaser)

1. The Vendor agrees to sell and the Purchaser agrees to purchase all that parcel of land at [PROPERTY DESCRIPTION].
2. The purchase price is N[AMOUNT].
3. Completion shall take place upon payment of the balance and delivery of title documents.
4. Possession shall be delivered to the Purchaser on completion.
5. The parties shall execute all instruments necessary to perfect title.`,
    variables: ['vendor', 'purchaser', 'propertyDescription', 'purchasePrice'],
    downloadCount: 1325,
    isCustomizableWithAI: true,
  },
  {
    id: 'agreement-service',
    title: 'Service Agreement',
    category: 'Commercial',
    areaOfLaw: 'Commercial Contracts',
    description: 'A sample services contract covering scope of work, fees, deliverables, confidentiality and termination.',
    courtHeadingRequired: false,
    sampleText: `SERVICE AGREEMENT

THIS AGREEMENT is made this [DAY] day of [MONTH], 20[__]

BETWEEN:
[CLIENT NAME] of [ADDRESS] (the Client)

AND

[SERVICE PROVIDER NAME] of [ADDRESS] (the Service Provider)

1. The Service Provider shall provide [DESCRIPTION OF SERVICES].
2. The Client shall pay N[AMOUNT] in accordance with [PAYMENT TERMS].
3. Each party shall keep confidential all non-public information received under this Agreement.
4. Either party may terminate this Agreement by [NOTICE PERIOD] written notice.
5. This Agreement shall be governed by the laws of the Federal Republic of Nigeria.`,
    variables: ['client', 'serviceProvider', 'services', 'fees', 'noticePeriod'],
    downloadCount: 1094,
    isCustomizableWithAI: true,
  },
  {
    id: 'agreement-partnership',
    title: 'Partnership Agreement',
    category: 'Commercial',
    areaOfLaw: 'Business Organisations',
    description: 'A sample partnership deed covering capital contribution, profit sharing, management and exit arrangements.',
    courtHeadingRequired: false,
    sampleText: `PARTNERSHIP AGREEMENT

THIS AGREEMENT is made this [DAY] day of [MONTH], 20[__]

BETWEEN:
[PARTNER ONE NAME]

AND

[PARTNER TWO NAME]

1. The parties agree to carry on business under the name [BUSINESS NAME].
2. Each partner shall contribute capital as set out in Schedule 1.
3. Profits and losses shall be shared in the ratio [RATIO].
4. Decisions shall be made by [DECISION PROCESS].
5. A partner may retire by giving [NOTICE PERIOD] written notice.`,
    variables: ['partners', 'businessName', 'capital', 'profitRatio'],
    downloadCount: 876,
    isCustomizableWithAI: true,
  },
];

export const AffidavitsView: React.FC<AffidavitsViewProps> = ({
  onCustomizeDraft,
  categoryId,
  affidavitId,
}) => {
  const affidavit = affidavitId ? affidavitById(affidavitId) : undefined;
  if (affidavit) return <AffidavitDetail affidavit={affidavit} onCustomizeDraft={onCustomizeDraft} />;

  const category = categoryId ? affidavitCategoryById(categoryId) : undefined;
  if (category) return <CategoryPage categoryId={category.id} />;

  return <AffidavitDirectory onCustomizeDraft={onCustomizeDraft} />;
};

// ---------------------------------------------------------------------------
// Level 1 — the search space and every category of affidavit
// ---------------------------------------------------------------------------

const AffidavitDirectory: React.FC<{ onCustomizeDraft: (draft: LegalDraft) => void }> = ({
  onCustomizeDraft,
}) => {
  const [query, setQuery] = useState('');
  const needle = query.trim();
  const matches = useMemo(() => searchAffidavits(needle), [needle]);
  const agreementMatches = useMemo(() => {
    const normalized = needle.toLowerCase();
    if (!normalized) return SAMPLE_AGREEMENTS;

    return SAMPLE_AGREEMENTS.filter((agreement) =>
      [agreement.title, agreement.description, agreement.areaOfLaw, agreement.sampleText]
        .join(' ')
        .toLowerCase()
        .includes(normalized),
    );
  }, [needle]);

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lawpex-module-hero bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            Module 6
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-neutral-900 mt-2">
            SAMPLE AGREEMENTS AND AFFIDAVITS
          </h1>
          <p className="text-xs sm:text-sm text-neutral-700 max-w-3xl mt-1 leading-relaxed">
            Sample agreements and sworn depositions for Nigerian practice. Open an agreement for a
            drafting sample or open an affidavit category for the full sworn text, statutory basis
            and practice notes.
          </p>

          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-700" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search agreements or affidavits e.g. 'tenancy', 'bail', 'sale of land', 'counter affidavit'..."
              className="w-full bg-white text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <p className="text-[11px] text-neutral-500 mt-3">
            {SAMPLE_AGREEMENTS.length} sample agreements and {AFFIDAVITS.length} affidavits across{' '}
            {AFFIDAVIT_CATEGORIES.length} affidavit categories.
          </p>
        </div>

        {needle ? (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-5">
            <DirectoryColumn
              title="Sample agreements"
              subtitle={`${agreementMatches.length} agreement${agreementMatches.length === 1 ? '' : 's'} matching "${needle}"`}
            >
              {agreementMatches.length === 0 ? (
                <EmptyDirectoryResult label="agreement" query={needle} />
              ) : (
                agreementMatches.map((agreement) => (
                  <AgreementCard
                    key={agreement.id}
                    agreement={agreement}
                    onCustomizeDraft={onCustomizeDraft}
                  />
                ))
              )}
            </DirectoryColumn>

            <DirectoryColumn
              title="Sample affidavits"
              subtitle={`${matches.length} affidavit${matches.length === 1 ? '' : 's'} matching "${needle}"`}
            >
              {matches.length === 0 ? (
                <EmptyDirectoryResult label="affidavit" query={needle} />
              ) : (
                matches.map((affidavit) => (
                  <AffidavitCard key={affidavit.id} affidavit={affidavit} />
                ))
              )}
            </DirectoryColumn>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-5">
            <DirectoryColumn
              title="Sample agreements"
              subtitle={`${SAMPLE_AGREEMENTS.length} editable agreement samples`}
            >
              {SAMPLE_AGREEMENTS.map((agreement) => (
                <AgreementCard
                  key={agreement.id}
                  agreement={agreement}
                  onCustomizeDraft={onCustomizeDraft}
                />
              ))}
            </DirectoryColumn>

            <DirectoryColumn
              title="Sample affidavits"
              subtitle={`${AFFIDAVIT_CATEGORIES.length} affidavit categories`}
            >
              {AFFIDAVIT_CATEGORIES.map((category) => {
                const count = affidavitsInCategory(category.id).length;

                return (
                  <Link
                    key={category.id}
                    to={`/affidavits/${category.id}`}
                    className="bg-yellow-100 border border-neutral-200 hover:border-yellow-500/50 rounded-xl p-4 transition shadow-sm group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-4 h-4 text-yellow-700" />
                        <span className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider">
                          Sworn under the Oaths Act
                        </span>
                      </div>
                      <h2 className="text-sm font-black font-serif text-neutral-900 group-hover:text-yellow-700 transition">
                        {category.label}
                      </h2>
                      <p className="text-[11px] text-neutral-600 mt-1.5 leading-relaxed">
                        {category.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-500">
                        {count} {count === 1 ? 'affidavit' : 'affidavits'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-yellow-700" />
                    </div>
                  </Link>
                );
              })}
            </DirectoryColumn>
          </div>
        )}
      </div>
    </div>
  );
};

const DirectoryColumn: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => (
  <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
    <div className="mb-4 flex items-start justify-between gap-3 border-b border-neutral-200 pb-3">
      <div>
        <h2 className="text-base font-black font-serif text-neutral-900">{title}</h2>
        <p className="mt-1 text-[11px] font-semibold text-neutral-500">{subtitle}</p>
      </div>
    </div>
    <div className="space-y-3">{children}</div>
  </section>
);

const EmptyDirectoryResult: React.FC<{ label: string; query: string }> = ({ label, query }) => (
  <p className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs leading-relaxed text-neutral-600">
    No sample {label} matches "{query}".
  </p>
);

const AgreementCard: React.FC<{
  agreement: LegalDraft;
  onCustomizeDraft: (draft: LegalDraft) => void;
}> = ({ agreement, onCustomizeDraft }) => (
  <article className="bg-yellow-100 border border-neutral-200 hover:border-yellow-500/50 rounded-xl p-4 transition shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-yellow-700" />
          <span className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider">
            Agreement sample
          </span>
        </div>
        <h3 className="mt-2 text-sm font-black font-serif text-neutral-900">{agreement.title}</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-600">
          {agreement.description}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-yellow-700 shrink-0 mt-1" />
    </div>

    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-neutral-200 pt-3">
      <span className="rounded bg-white px-2 py-0.5 text-[10px] text-neutral-600 border border-neutral-200">
        {agreement.areaOfLaw}
      </span>
      {agreement.documentPath ? (
        <a
          href={agreement.documentPath}
          download
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-yellow-400 px-3 py-1.5 text-[11px] font-black text-neutral-950 transition hover:bg-yellow-300 active:translate-y-px"
        >
          <FileText className="w-3.5 h-3.5" />
          Download original DOCX
        </a>
      ) : (
        <button
          type="button"
          onClick={() => onCustomizeDraft(agreement)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-yellow-400 px-3 py-1.5 text-[11px] font-black text-neutral-950 transition hover:bg-yellow-300 active:translate-y-px"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Customise
        </button>
      )}
    </div>
  </article>
);

const AffidavitCard: React.FC<{ affidavit: AffidavitTemplate }> = ({ affidavit }) => (
  <Link
    to={`/affidavits/deposition/${affidavit.id}`}
    className="bg-yellow-100 border border-neutral-200 hover:border-yellow-500/50 rounded-2xl p-5 transition shadow-lg group flex flex-col justify-between"
  >
    <div>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-black font-serif text-neutral-900 group-hover:text-yellow-700 transition">
          {affidavit.title}
        </h3>
        <ChevronRight className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
      </div>
      <p className="text-[11px] text-neutral-600 mt-1.5 leading-relaxed">{affidavit.description}</p>
    </div>

    <div className="mt-4 pt-3 border-t border-neutral-200 flex flex-wrap items-center gap-2">
      <span className="bg-white border border-neutral-200 text-neutral-600 text-[10px] px-2 py-0.5 rounded">
        {affidavit.courtHeadingRequired ? 'Filed under a court heading' : 'Standalone deposition'}
      </span>
      <span className="bg-white border border-neutral-200 text-neutral-600 text-[10px] px-2 py-0.5 rounded">
        Deponent: {affidavit.deponent}
      </span>
    </div>
  </Link>
);

// ---------------------------------------------------------------------------
// Level 2 — the affidavits inside a category
// ---------------------------------------------------------------------------

const CategoryPage: React.FC<{ categoryId: AffidavitTemplate['category'] }> = ({ categoryId }) => {
  const category = affidavitCategoryById(categoryId)!;
  const affidavits = affidavitsInCategory(categoryId);
  const [query, setQuery] = useState('');

  const needle = query.trim().toLowerCase();
  const visible = affidavits.filter(
    (affidavit) =>
      !needle ||
      [affidavit.title, affidavit.description, affidavit.whenToUse, ...affidavit.keywords]
        .join(' ')
        .toLowerCase()
        .includes(needle),
  );

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <Link
            to="/affidavits"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-yellow-700 hover:text-yellow-800 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All affidavits
          </Link>

          <h1 className="text-2xl sm:text-4xl font-black font-serif text-neutral-900 mt-2">
            {category.label}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-700 max-w-3xl mt-1 leading-relaxed">
            {category.description}
          </p>

          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-700" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find an affidavit in this category..."
              className="w-full bg-white text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="text-sm text-neutral-600">No affidavit here matches “{query}”.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visible.map((affidavit) => (
              <AffidavitCard key={affidavit.id} affidavit={affidavit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Level 3 — one affidavit: the sworn text and everything around it
// ---------------------------------------------------------------------------

const AffidavitDetail: React.FC<{
  affidavit: AffidavitTemplate;
  onCustomizeDraft: (draft: LegalDraft) => void;
}> = ({ affidavit, onCustomizeDraft }) => {
  const category = affidavitCategoryById(affidavit.category);

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl">
          <Link
            to={`/affidavits/${affidavit.category}`}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-yellow-700 hover:text-yellow-800 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {category?.label ?? 'All affidavits'}
          </Link>

          <h1 className="text-xl sm:text-3xl font-black font-serif text-neutral-900 mt-2 leading-snug">
            {affidavit.title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-700 mt-2 leading-relaxed">
            {affidavit.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-white border border-neutral-200 text-neutral-700 text-[11px] px-2.5 py-1 rounded-lg">
              {affidavit.courtHeadingRequired
                ? 'Filed under a court heading'
                : 'Standalone — no court heading'}
            </span>
            <span className="bg-white border border-neutral-200 text-neutral-700 text-[11px] px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-yellow-700" />
              {affidavit.deponent}
            </span>
          </div>
        </div>

        <div className="space-y-5">
          <Panel title="When you use it" subtitle="The situation this deposition answers.">
            <p className="text-xs text-neutral-700 leading-relaxed bg-white border border-neutral-200 rounded-xl p-4">
              {affidavit.whenToUse}
            </p>
          </Panel>

          <Panel
            title="Sworn under"
            subtitle="The law that authorises the deposition and any rule that requires it."
          >
            <ul className="space-y-2">
              {affidavit.statutoryBasis.map((basis, index) => (
                <li
                  key={index}
                  className="bg-white border border-neutral-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-neutral-800 leading-relaxed"
                >
                  <BookOpen className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
                  <span>{basis}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="Practice notes"
            subtitle="What gets affidavits of this kind struck out, and how to avoid it."
          >
            <ul className="space-y-2">
              {affidavit.practiceNotes.map((note, index) => (
                <li
                  key={index}
                  className="bg-white border border-neutral-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-neutral-700 leading-relaxed"
                >
                  <AlertTriangle className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>

            <DocumentActions
              className="mt-4"
              html={buildWordList('Practice notes', affidavit.title, affidavit.practiceNotes)}
              filename={`${affidavit.title} - practice notes`}
              hint="Copy the practice notes to MS Word."
            />
          </Panel>

          <Panel
            title="The sworn text"
            subtitle="Court-ready. Replace every bracketed placeholder before the affidavit is deposed to."
          >
            <pre className="bg-white border border-neutral-200 rounded-xl p-4 text-[11px] leading-relaxed text-neutral-800 whitespace-pre-wrap font-mono overflow-x-auto max-h-[45rem] overflow-y-auto">
              {affidavit.sampleText}
            </pre>

            <DocumentActions
              className="mt-4"
              html={buildWordDraft(
                affidavit.title,
                `LAWPEX — ${category?.label ?? 'Affidavit library'}`,
                affidavit.sampleText,
              )}
              filename={affidavit.title}
              hint="Copy the affidavit to MS Word — the layout of the deposition is preserved."
            />

            <button
              onClick={() =>
                onCustomizeDraft({
                  id: affidavit.id,
                  title: affidavit.title,
                  category: 'Affidavits',
                  areaOfLaw: category?.label ?? 'Affidavits',
                  description: affidavit.description,
                  courtHeadingRequired: affidavit.courtHeadingRequired,
                  sampleText: affidavit.sampleText,
                  variables: [],
                  downloadCount: 0,
                  isCustomizableWithAI: true,
                })
              }
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Customise this affidavit with AI
            </button>
          </Panel>
        </div>
      </div>
    </div>
  );
};

const Panel: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => (
  <div className="bg-yellow-100 border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xl">
    <div className="border-b border-neutral-200 pb-3 mb-4">
      <h2 className="text-lg font-black font-serif text-neutral-900">{title}</h2>
      <p className="text-[11px] text-neutral-600 mt-0.5">{subtitle}</p>
    </div>
    {children}
  </div>
);
