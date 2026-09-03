import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  FileText,
  Landmark,
} from 'lucide-react';
import {
  FEDERAL_LAWS,
  FEDERAL_LAW_CATEGORIES,
  FederalLawEntry,
  STATE_LAW_BOOKS,
  StateLawBook,
  federalLawFullText,
  stateLawBookBySlug,
} from '../../data/lawsLibrary';
import { DocumentActions } from '../DocumentActions';
import { OfficialPdfReader } from '../OfficialPdfReader';
import { OfficialTextReader } from '../OfficialTextReader';
import { buildWordSection } from '../../lib/copyToWord';

interface NigerianLawsViewProps {
  /** `federation` or `states`, taken from `/nigerian-laws/:libraryId`. */
  libraryId?: string;
  /** State slug taken from `/nigerian-laws/states/:stateSlug`. */
  stateSlugParam?: string;
}

export const NigerianLawsView: React.FC<NigerianLawsViewProps> = ({ libraryId, stateSlugParam }) => {
  if (libraryId === 'states') {
    const book = stateSlugParam ? stateLawBookBySlug(stateSlugParam) : undefined;
    return book ? <StateLawPage book={book} /> : <StateDirectory />;
  }

  if (libraryId === 'federation') return <FederationLibrary />;

  return <LibraryDirectory />;
};

// ---------------------------------------------------------------------------
// Level 1 — the two libraries
// ---------------------------------------------------------------------------

const LibraryDirectory: React.FC = () => (
  <div className="bg-white text-neutral-900 min-h-screen py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
        <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
          Module 3
        </span>
        <h1 className="text-2xl sm:text-4xl font-black font-serif text-neutral-900 mt-2">
          Nigerian Laws & Statutes
        </h1>
        <p className="text-xs sm:text-sm text-neutral-700 max-w-3xl mt-1 leading-relaxed">
          The Laws of the Federation of Nigeria, and the laws of the 36 states and the Federal
          Capital Territory.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link
          to="/nigerian-laws/federation"
          className="bg-yellow-100 border border-neutral-200 hover:border-yellow-500/50 rounded-2xl p-6 transition shadow-lg group"
        >
          <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/70 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-yellow-700" />
          </div>
          <h2 className="text-base font-black font-serif text-neutral-900 group-hover:text-yellow-700 transition mt-3">
            Laws of the Federation of Nigeria
          </h2>
          <p className="text-[11px] text-neutral-600 mt-1.5 leading-relaxed">
            The federal Acts — the 1999 Constitution, CAMA 2020, the Evidence Act 2011, ACJA 2015,
            the Land Use Act, the Electoral Act 2026 and the rest of the statute book.
          </p>
          <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
            <span className="text-[11px] text-neutral-500">{FEDERAL_LAWS.length} federal laws</span>
            <ChevronRight className="w-4 h-4 text-yellow-700" />
          </div>
        </Link>

        <Link
          to="/nigerian-laws/states"
          className="bg-yellow-100 border border-neutral-200 hover:border-yellow-500/50 rounded-2xl p-6 transition shadow-lg group"
        >
          <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/70 flex items-center justify-center">
            <Landmark className="w-5 h-5 text-yellow-700" />
          </div>
          <h2 className="text-base font-black font-serif text-neutral-900 group-hover:text-yellow-700 transition mt-3">
            Laws of the 36 states of Nigeria
          </h2>
          <p className="text-[11px] text-neutral-600 mt-1.5 leading-relaxed">
            The High Court and Magistrates’ Courts Laws, administration of criminal justice, land
            registration, tenancy, the child, revenue and the environment — state by state.
          </p>
          <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
            <span className="text-[11px] text-neutral-500">
              {STATE_LAW_BOOKS.length} jurisdictions
            </span>
            <ChevronRight className="w-4 h-4 text-yellow-700" />
          </div>
        </Link>
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// The federal statute book
// ---------------------------------------------------------------------------

const FederationLibrary: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [openLawId, setOpenLawId] = useState<string | null>(null);

  const needle = query.trim().toLowerCase();
  const laws = useMemo(
    () =>
      FEDERAL_LAWS.filter((law) => {
        const matchesCategory = category === 'all' || law.category === category;
        const matchesQuery =
          !needle ||
          law.title.toLowerCase().includes(needle) ||
          law.shortTitle.toLowerCase().includes(needle) ||
          law.citation.toLowerCase().includes(needle) ||
          law.description.toLowerCase().includes(needle);
        return matchesCategory && matchesQuery;
      }),
    [needle, category],
  );

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <Link
            to="/nigerian-laws"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-yellow-700 hover:text-yellow-800 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Nigerian laws
          </Link>

          <h1 className="text-2xl sm:text-4xl font-black font-serif text-neutral-900 mt-2">
            Laws of the Federation of Nigeria
          </h1>
          <p className="text-xs sm:text-sm text-neutral-700 max-w-3xl mt-1 leading-relaxed">
            The federal statute book, grouped by subject. Laws marked “full text” open section by
            section.
          </p>

          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-700" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the Laws of the Federation e.g. 'CAMA', 'Evidence Act', 'Section 84', 'land'..."
              className="w-full bg-white text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-neutral-200">
            {['all', ...FEDERAL_LAW_CATEGORIES].map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                  category === item
                    ? 'bg-yellow-400 text-neutral-950 shadow-md shadow-yellow-500/25'
                    : 'bg-white text-neutral-700 hover:bg-yellow-100 border border-neutral-200'
                }`}
              >
                {item === 'all' ? 'All subjects' : item}
              </button>
            ))}
          </div>
        </div>

        {laws.length === 0 ? (
          <p className="text-sm text-neutral-600">No federal law matches “{query}”.</p>
        ) : (
          <div className="space-y-3">
            {laws.map((law) => (
              <FederalLawCard
                key={law.id}
                law={law}
                isOpen={openLawId === law.id}
                onToggle={() => setOpenLawId(openLawId === law.id ? null : law.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FederalLawCard: React.FC<{
  law: FederalLawEntry;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ law, isOpen, onToggle }) => {
  const fullText = federalLawFullText(law);
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <div className="bg-yellow-100 border border-neutral-200 rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left p-5 flex items-start justify-between gap-3 hover:bg-yellow-100 transition"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-yellow-400/20 text-yellow-700 border border-yellow-400/60 text-[10px] font-bold px-2 py-0.5 rounded">
              {law.category}
            </span>
            {fullText && (
              <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                Full text — {fullText.sections.length} sections
              </span>
            )}
            {law.documentPath && (
              <span className="inline-flex items-center gap-1 bg-white text-neutral-800 border border-yellow-400/70 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                <FileText className="h-3 w-3 text-yellow-700" />
                Official PDF
              </span>
            )}
          </div>
          <h2 className="text-base font-black font-serif text-neutral-900 mt-1.5">{law.title}</h2>
          <p className="text-[11px] text-neutral-500 font-mono mt-0.5">{law.citation}</p>
          <p className="text-[11px] text-neutral-600 mt-1.5 leading-relaxed">{law.description}</p>
        </div>

        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-yellow-700 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-neutral-200 p-5 space-y-3">
          {law.documentText ? (
            <OfficialTextReader
              title={law.title}
              documentText={law.documentText}
              documentPath={law.documentPath}
              pageCount={law.documentPages}
              documentLabel={law.citation}
            />
          ) : law.documentPath ? (
            <OfficialPdfReader
              title={law.title}
              documentPath={law.documentPath}
              pageCount={law.documentPages}
            />
          ) : null}

          {fullText ? (
            <>
              {fullText.sections.map((section) => {
                const sectionOpen = openSection === section.sectionNumber;
                return (
                  <div
                    key={section.sectionNumber}
                    className="bg-white border border-neutral-200 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenSection(sectionOpen ? null : section.sectionNumber)}
                      className="w-full p-4 flex justify-between items-center text-left hover:bg-yellow-100 transition"
                    >
                      <span className="text-xs">
                        <span className="font-bold text-yellow-700">
                          Section {section.sectionNumber}:
                        </span>
                        <span className="font-bold text-neutral-900 ml-2">{section.heading}</span>
                      </span>
                      {sectionOpen ? (
                        <ChevronUp className="w-4 h-4 text-yellow-700 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                      )}
                    </button>

                    {sectionOpen && (
                      <div className="p-4 border-t border-neutral-200 space-y-3">
                        <p className="text-xs text-neutral-700 leading-relaxed font-serif">
                          {section.content}
                        </p>
                        <DocumentActions
                          html={buildWordSection(
                            `Section ${section.sectionNumber} — ${section.heading}`,
                            `${law.title} (${law.citation})`,
                            [section.content],
                          )}
                          filename={`${law.shortTitle} s${section.sectionNumber}`}
                          hint="Copy this section to MS Word."
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : !law.documentPath ? (
            <p className="text-xs text-neutral-600 leading-relaxed bg-white border border-neutral-200 rounded-xl p-4">
              The sectioned text of this Act is being loaded into the statute database. The summary
              above states its scope and the matters it governs; cite the Act by its short title and
              citation, {law.citation}.
            </p>
          ) : null}

          <DocumentActions
            html={buildWordSection(law.title, law.citation, [law.description])}
            filename={law.shortTitle}
            hint="Copy the citation and scope of this Act to MS Word."
          />
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// The state statute books
// ---------------------------------------------------------------------------

const StateDirectory: React.FC = () => {
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();
  const books = STATE_LAW_BOOKS.filter((book) => !needle || book.state.toLowerCase().includes(needle));

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <Link
            to="/nigerian-laws"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-yellow-700 hover:text-yellow-800 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Nigerian laws
          </Link>

          <h1 className="text-2xl sm:text-4xl font-black font-serif text-neutral-900 mt-2">
            Laws of the 36 states of Nigeria
          </h1>
          <p className="text-xs sm:text-sm text-neutral-700 max-w-3xl mt-1 leading-relaxed">
            Choose a state to see the laws that govern practice there — the courts, criminal justice,
            land, tenancy, the child, revenue and the environment.
          </p>

          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-700" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find a state e.g. Enugu, Kaduna, Ogun, Federal Capital Territory..."
              className="w-full bg-white text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <Link
              key={book.slug}
              to={`/nigerian-laws/states/${book.slug}`}
              className="bg-yellow-100 border border-neutral-200 hover:border-yellow-500/50 rounded-xl p-4 transition group flex items-center justify-between gap-3"
            >
              <div>
                <h2 className="text-sm font-bold font-serif text-neutral-900 group-hover:text-yellow-700 transition">
                  {book.state}
                </h2>
                <p className="text-[11px] text-neutral-500 mt-0.5">{book.laws.length} laws</p>
              </div>
              <ChevronRight className="w-4 h-4 text-yellow-700 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const StateLawPage: React.FC<{ book: StateLawBook }> = ({ book }) => {
  const [query, setQuery] = useState('');
  const [openLawId, setOpenLawId] = useState<string | null>(book.laws[0]?.id ?? null);

  const needle = query.trim().toLowerCase();
  const laws = book.laws.filter(
    (law) =>
      !needle ||
      law.title.toLowerCase().includes(needle) ||
      law.subject.toLowerCase().includes(needle) ||
      law.description.toLowerCase().includes(needle) ||
      law.keyProvisions.some(
        (provision) =>
          provision.heading.toLowerCase().includes(needle) ||
          provision.content.toLowerCase().includes(needle),
      ),
  );

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <Link
            to="/nigerian-laws/states"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-yellow-700 hover:text-yellow-800 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All states
          </Link>

          <h1 className="text-2xl sm:text-4xl font-black font-serif text-neutral-900 mt-2">{book.state}</h1>
          <p className="text-[11px] text-yellow-700 font-mono mt-1">{book.citation}</p>

          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-700" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search this state's laws e.g. 'tenancy', 'notice to quit', 'bail', 'consent'..."
              className="w-full bg-white text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <p className="text-[11px] text-neutral-500 mt-4">
            Titles and years differ between states — confirm the current short title and edition
            against the State gazette before citing a section.
          </p>
        </div>

        <div className="space-y-3">
          {laws.map((law) => {
            const isOpen = openLawId === law.id;
            return (
              <div key={law.id} className="bg-yellow-100 border border-neutral-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenLawId(isOpen ? null : law.id)}
                  className="w-full text-left p-5 flex items-start justify-between gap-3 hover:bg-yellow-100 transition"
                >
                  <div>
                    <span className="bg-yellow-400/20 text-yellow-700 border border-yellow-400/60 text-[10px] font-bold px-2 py-0.5 rounded">
                      {law.subject}
                    </span>
                    <h2 className="text-base font-black font-serif text-neutral-900 mt-1.5">{law.title}</h2>
                    <p className="text-[11px] text-neutral-600 mt-1.5 leading-relaxed">
                      {law.description}
                    </p>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-yellow-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-neutral-200 p-5 space-y-3">
                    {law.keyProvisions.map((provision) => (
                      <div
                        key={provision.heading}
                        className="bg-white border border-neutral-200 rounded-xl p-4"
                      >
                        <h3 className="text-xs font-bold text-yellow-700">{provision.heading}</h3>
                        <p className="text-xs text-neutral-700 leading-relaxed mt-1.5">
                          {provision.content}
                        </p>
                      </div>
                    ))}

                    <DocumentActions
                      html={buildWordSection(
                        law.title,
                        book.citation,
                        law.keyProvisions.map(
                          (provision) => `<strong>${provision.heading}</strong> — ${provision.content}`,
                        ),
                      )}
                      filename={law.title}
                      hint="Copy this law to MS Word."
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {laws.length === 0 && (
          <p className="text-sm text-neutral-600">No law of {book.state} matches “{query}”.</p>
        )}
      </div>
    </div>
  );
};
