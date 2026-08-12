import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ChevronRight,
  ArrowLeft,
  Gavel,
  Award,
  Scale,
  BookOpen,
  ClipboardList,
  Library,
  CalendarDays,
  Users,
  MapPin,
  FileText,
  Landmark,
} from 'lucide-react';
import { LANDMARK_CASES } from '../../data/legalData';
import { CaseJudgmentDocument, loadCaseJudgmentDocument, mergeCaseJudgmentDocument } from '../../data/judgmentLoader';
import { CaseLaw } from '../../types';
import { DocumentActions } from '../DocumentActions';
import { buildWordDraft, buildWordList, buildWordSection } from '../../lib/copyToWord';

interface CaseLawViewProps {
  /** Court taken from the URL (`/case-law/:courtSlug`). */
  courtSlug?: string;
  /** Judgment taken from the URL (`/case-law/case/:caseId`). */
  caseId?: string;
}

/** The court tiers the library is organised by, in order of precedence. */
export const CASE_LAW_COURTS: { slug: string; name: CaseLaw['court']; blurb: string }[] = [
  {
    slug: 'supreme-court',
    name: 'Supreme Court of Nigeria',
    blurb:
      'Judgments of the apex court. Binding on every other court in the Federation and the final word on the interpretation of the Constitution.',
  },
  {
    slug: 'court-of-appeal',
    name: 'Court of Appeal',
    blurb:
      'Judgments of the penultimate court, binding on the High Courts, the Federal High Court, the National Industrial Court and all courts below.',
  },
  {
    slug: 'federal-high-court',
    name: 'Federal High Court',
    blurb: 'Decisions in revenue, admiralty, companies, banking and federal agency matters.',
  },
  {
    slug: 'national-industrial-court',
    name: 'National Industrial Court',
    blurb: 'Decisions in labour, employment, trade union and workplace matters.',
  },
  {
    slug: 'state-high-court',
    name: 'State High Court',
    blurb: 'Decisions of the High Courts of the states and the Federal Capital Territory.',
  },
];

const courtBySlug = (slug: string) => CASE_LAW_COURTS.find((court) => court.slug === slug);

export const casesForCourt = (name: CaseLaw['court']): CaseLaw[] =>
  LANDMARK_CASES.filter((judgment) => judgment.court === name);

export const CaseLawView: React.FC<CaseLawViewProps> = ({ courtSlug, caseId }) => {
  if (caseId) {
    const judgment = LANDMARK_CASES.find((item) => item.id === caseId);
    if (judgment) return <CaseDetail judgment={judgment} />;
  }

  const court = courtSlug ? courtBySlug(courtSlug) : undefined;
  if (court) return <CourtCaseList court={court} />;

  return <CourtDirectory />;
};

const CourtDirectory: React.FC = () => (
  <div className="bg-white text-neutral-900 min-h-screen py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
        <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
          Module 4
        </span>
        <h1 className="text-2xl sm:text-4xl font-black font-serif text-neutral-900 mt-2">Case Laws</h1>
        <p className="text-xs sm:text-sm text-neutral-700 max-w-3xl mt-1 leading-relaxed">
          Open a court to see its judgments. Every report opens like a proper legal digest:
          summary, principles, authorities and the whole case, ready for MS Word.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CASE_LAW_COURTS.map((court) => {
          const count = casesForCourt(court.name).length;

          return (
            <Link
              key={court.slug}
              to={`/case-law/${court.slug}`}
              className="bg-yellow-100 border border-neutral-200 hover:border-yellow-500/50 rounded-2xl p-6 transition shadow-lg group flex flex-col justify-between"
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/70 flex items-center justify-center shrink-0">
                  <Gavel className="w-5 h-5 text-yellow-700" />
                </div>
                <div>
                  <h2 className="text-base font-black font-serif text-neutral-900 group-hover:text-yellow-700 transition">
                    {court.name}
                  </h2>
                  <p className="text-[11px] text-neutral-600 mt-1.5 leading-relaxed">{court.blurb}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
                <span className="text-[11px] text-neutral-500">
                  {count} {count === 1 ? 'judgment' : 'judgments'} in the library
                </span>
                <ChevronRight className="w-4 h-4 text-yellow-700" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  </div>
);

const CourtCaseList: React.FC<{ court: (typeof CASE_LAW_COURTS)[number] }> = ({ court }) => {
  const [query, setQuery] = useState('');
  const all = useMemo(() => casesForCourt(court.name), [court.name]);

  const needle = query.trim().toLowerCase();
  const cases = useMemo(
    () =>
      all.filter(
        (judgment) =>
          !needle ||
          judgment.title.toLowerCase().includes(needle) ||
          judgment.citation.toLowerCase().includes(needle) ||
          judgment.suitNumber.toLowerCase().includes(needle) ||
          judgment.subject.toLowerCase().includes(needle) ||
          judgment.areaOfLaw.toLowerCase().includes(needle) ||
          judgment.factsSummary.toLowerCase().includes(needle) ||
          judgment.catchwords?.some((catchword) => catchword.toLowerCase().includes(needle)) ||
          judgment.authoritiesCited?.some((authority) => authority.toLowerCase().includes(needle)) ||
          judgment.statutesConsidered?.some((statute) => statute.toLowerCase().includes(needle)) ||
          judgment.keyPrinciples.some((principle) => principle.toLowerCase().includes(needle)) ||
          judgment.ratioDecidendi.some((ratio) => ratio.toLowerCase().includes(needle)),
      ),
    [all, needle],
  );

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <Link
            to="/case-law"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-yellow-700 hover:text-yellow-800 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All courts
          </Link>

          <h1 className="text-2xl sm:text-4xl font-black font-serif text-neutral-900 mt-2">{court.name}</h1>
          <p className="text-xs sm:text-sm text-neutral-700 max-w-3xl mt-1 leading-relaxed">
            {court.blurb}
          </p>

          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-700" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search case law/principles..."
              className="w-full bg-white text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <p className="text-[11px] text-neutral-500 mt-3">
            {cases.length} of {all.length} judgments - search runs across facts, ratio,
            principles, authorities and catchwords.
          </p>
        </div>

        {cases.length === 0 ? (
          <p className="text-sm text-neutral-600">
            No judgment of the {court.name} in the library matches "{query}".
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {cases.map((judgment) => (
              <Link
                key={judgment.id}
                to={`/case-law/case/${judgment.id}`}
                className="bg-yellow-100 border border-neutral-200 hover:border-yellow-500/50 p-6 rounded-2xl transition shadow-xl flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="bg-yellow-400/20 text-yellow-700 border border-yellow-400/70 text-[10px] font-bold px-2.5 py-0.5 rounded">
                      {judgment.year} - {judgment.areaOfLaw}
                    </span>
                    {judgment.isLandmark && (
                      <span className="bg-amber-500 text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                        <Award className="w-3 h-3" /> Landmark
                      </span>
                    )}
                  </div>

                  <h2 className="text-base font-black font-serif text-neutral-900 group-hover:text-yellow-700 transition leading-snug">
                    {judgment.title}
                  </h2>

                  <p className="text-[11px] text-yellow-700 font-mono font-bold">
                    {judgment.citation} - {judgment.suitNumber}
                  </p>

                  <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                    {judgment.subject}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500">
                    {judgment.keyPrinciples.length} principles of law
                  </span>
                  <ChevronRight className="w-4 h-4 text-yellow-700" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CaseDetail: React.FC<{ judgment: CaseLaw }> = ({ judgment }) => {
  const [document, setDocument] = useState<CaseJudgmentDocument | null>(null);
  const [documentStatus, setDocumentStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    judgment.hasFullJudgment ? 'idle' : 'ready',
  );
  const fullJudgment = useMemo(() => mergeCaseJudgmentDocument(judgment, document), [document, judgment]);
  const court = CASE_LAW_COURTS.find((item) => item.name === judgment.court);
  const hasAuthorities =
    Boolean(judgment.authoritiesCited?.length) ||
    Boolean(judgment.statutesConsidered?.length) ||
    Boolean(judgment.practiceNotes?.length) ||
    Boolean(judgment.appearances);
  const [tab, setTab] = useState<'digest' | 'principles' | 'authorities' | 'whole'>('digest');

  useEffect(() => {
    let isMounted = true;

    if (!judgment.hasFullJudgment || document || documentStatus === 'loading') return undefined;
    if (tab !== 'whole') return undefined;

    setDocumentStatus('loading');
    loadCaseJudgmentDocument(judgment.id)
      .then((loaded) => {
        if (!isMounted) return;
        setDocument(loaded);
        setDocumentStatus(loaded ? 'ready' : 'error');
      })
      .catch(() => {
        if (isMounted) setDocumentStatus('error');
      });

    return () => {
      isMounted = false;
    };
  }, [document, documentStatus, judgment.hasFullJudgment, judgment.id, tab]);

  const related = (judgment.relatedCaseIds ?? [])
    .map((id) => LANDMARK_CASES.find((item) => item.id === id))
    .filter((item): item is CaseLaw => Boolean(item));

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl">
          <Link
            to={court ? `/case-law/${court.slug}` : '/case-law'}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-yellow-700 hover:text-yellow-800 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {judgment.court}
          </Link>

          <h1 className="text-xl sm:text-3xl font-black font-serif text-neutral-900 mt-2 leading-snug">
            {judgment.title}
          </h1>
          <p className="text-xs text-yellow-700 font-mono font-bold mt-1.5">
            {judgment.citation} - {judgment.suitNumber} - {judgment.year}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetaCard icon={Landmark} label="Court" value={judgment.court} />
            <MetaCard icon={MapPin} label="Division" value={judgment.judicialDivision ?? 'Not supplied'} />
            <MetaCard icon={CalendarDays} label="Delivered" value={judgment.dateDelivered ?? String(judgment.year)} />
            <MetaCard
              icon={Users}
              label="Panel"
              value={`${judgment.presidingJudges.length} justice${judgment.presidingJudges.length === 1 ? '' : 's'}`}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-white border border-neutral-200 text-neutral-700 text-[11px] px-2.5 py-1 rounded-lg">
              {judgment.areaOfLaw}
            </span>
            <span className="bg-white border border-neutral-200 text-neutral-700 text-[11px] px-2.5 py-1 rounded-lg">
              {judgment.subject}
            </span>
            {(judgment.catchwords ?? []).map((catchword) => (
              <span
                key={catchword}
                className="bg-neutral-950 text-yellow-200 border border-neutral-800 text-[11px] px-2.5 py-1 rounded-lg"
              >
                {catchword}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <TabButton
            active={tab === 'digest'}
            icon={ClipboardList}
            label="1. Case digest"
            onClick={() => setTab('digest')}
          />
          <TabButton
            active={tab === 'principles'}
            icon={Scale}
            label="2. Principles of law in this case"
            onClick={() => setTab('principles')}
          />
          {hasAuthorities && (
            <TabButton
              active={tab === 'authorities'}
              icon={Library}
              label="3. Authorities & notes"
              onClick={() => setTab('authorities')}
            />
          )}
          <TabButton
            active={tab === 'whole'}
            icon={BookOpen}
            label={`${hasAuthorities ? '4' : '3'}. Read the whole case`}
            onClick={() => setTab('whole')}
          />
        </div>

        {tab === 'digest' && <DigestPanel judgment={judgment} />}
        {tab === 'principles' && <PrinciplesPanel judgment={judgment} />}
        {tab === 'authorities' && <AuthoritiesPanel judgment={judgment} />}
        {tab === 'whole' && <WholeCasePanel judgment={fullJudgment} status={documentStatus} />}

        {related.length > 0 && (
          <div className="mt-6 bg-yellow-100 border border-neutral-200 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-3">
              Cases considered alongside this one
            </h3>
            <div className="space-y-2">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/case-law/case/${item.id}`}
                  className="block bg-white border border-neutral-200 hover:border-yellow-500/80 rounded-xl p-3 transition"
                >
                  <p className="text-xs font-bold font-serif text-neutral-900">{item.title}</p>
                  <p className="text-[11px] text-neutral-500 font-mono">{item.citation}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DigestPanel: React.FC<{ judgment: CaseLaw }> = ({ judgment }) => {
  const citation = `${judgment.title} ${judgment.citation}`;

  return (
    <div className="space-y-5">
      <Section
        title="Summary of judgment"
        subtitle="The fast brief: court, posture, facts, issues, decision and orders."
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-4">
          <div className="space-y-4">
            {judgment.proceduralHistory && (
              <DigestBlock title="Procedural history" body={judgment.proceduralHistory} />
            )}
            <DigestBlock title="Facts" body={judgment.factsSummary} />
            <DigestBlock title="Decision / held" body={judgment.decisionSummary} tone="strong" />
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-4">
            <MiniHeading icon={Users} label="Coram" />
            <ul className="space-y-2">
              {judgment.presidingJudges.map((judge) => (
                <li key={judge} className="text-xs text-neutral-700 leading-relaxed flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-yellow-500 shrink-0" />
                  {judge}
                </li>
              ))}
            </ul>

            {judgment.appearances && (
              <div className="border-t border-neutral-200 pt-4">
                <MiniHeading icon={FileText} label="Appearances" />
                <div className="mt-2 space-y-1.5 text-xs text-neutral-700">
                  {judgment.appearances.appellant && <p>Appellant: {judgment.appearances.appellant}</p>}
                  {judgment.appearances.respondent && <p>Respondent: {judgment.appearances.respondent}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        <DocumentActions
          className="mt-4"
          html={[
            buildWordSection('Procedural history', citation, judgment.proceduralHistory ? [judgment.proceduralHistory] : []),
            buildWordSection('Facts', '', [judgment.factsSummary]),
            buildWordList('Issues for determination', '', judgment.issuesForDetermination),
            buildWordSection('Decision / held', '', [judgment.decisionSummary]),
            buildWordList('Orders made', '', judgment.ordersMade ?? []),
          ].join('')}
          filename={`${judgment.title} - case digest`}
          hint="Copy the structured digest to MS Word."
        />
      </Section>

      <Section title="Issues for determination" subtitle="The questions the court answered.">
        <NumberedList items={judgment.issuesForDetermination} />
      </Section>

      {judgment.reliefsClaimed && (
        <Section title="Reliefs claimed" subtitle="What the claimant or appellant asked the court to grant.">
          <NumberedList items={judgment.reliefsClaimed} />
        </Section>
      )}

      {judgment.ordersMade && (
        <Section title="Orders made" subtitle="The operative result of the judgment.">
          <NumberedList items={judgment.ordersMade} />
        </Section>
      )}
    </div>
  );
};

const PrinciplesPanel: React.FC<{ judgment: CaseLaw }> = ({ judgment }) => {
  const citation = `${judgment.title} ${judgment.citation}`;

  return (
    <div className="space-y-5">
      <Section
        title="Principles of law in this case"
        subtitle="The propositions this judgment stands for, in the form you would cite them in a written address."
      >
        <NumberedList items={judgment.keyPrinciples} />

        <DocumentActions
          className="mt-4"
          html={buildWordList('Principles of law in this case', citation, judgment.keyPrinciples)}
          filename={`${judgment.title} - principles of law`}
          hint="Copy these principles to MS Word."
        />
      </Section>

      <Section title="Ratio decidendi" subtitle="Quoted in the Justice's own words for authentication, citation and argument.">
        <NumberedList items={judgment.ratioDecidendi} italic />

        <DocumentActions
          className="mt-4"
          html={buildWordList('Ratio decidendi', citation, judgment.ratioDecidendi)}
          filename={`${judgment.title} - ratio decidendi`}
          hint="Copy the ratio to MS Word."
        />
      </Section>

      {judgment.obiterDicta && judgment.obiterDicta.length > 0 && (
        <Section title="Obiter dicta" subtitle="Said in passing and persuasive only; useful, but not binding.">
          <SimpleList items={judgment.obiterDicta} italic />

          <DocumentActions
            className="mt-4"
            html={buildWordList('Obiter dicta', citation, judgment.obiterDicta)}
            filename={`${judgment.title} - obiter dicta`}
            hint="Copy the obiter to MS Word."
          />
        </Section>
      )}
    </div>
  );
};

const AuthoritiesPanel: React.FC<{ judgment: CaseLaw }> = ({ judgment }) => {
  const citation = `${judgment.title} ${judgment.citation}`;

  return (
    <div className="space-y-5">
      {judgment.authoritiesCited && (
        <Section title="Cases cited" subtitle="Authorities referred to or useful alongside this report.">
          <SimpleList items={judgment.authoritiesCited} />
        </Section>
      )}

      {judgment.statutesConsidered && (
        <Section title="Statutes considered" subtitle="Legislation and statutory provisions connected to the reasoning.">
          <SimpleList items={judgment.statutesConsidered} />
        </Section>
      )}

      {judgment.practiceNotes && (
        <Section title="Practice notes" subtitle="How a practitioner can use the case in research, drafting or argument.">
          <NumberedList items={judgment.practiceNotes} />

          <DocumentActions
            className="mt-4"
            html={[
              buildWordList('Cases cited', citation, judgment.authoritiesCited ?? []),
              buildWordList('Statutes considered', '', judgment.statutesConsidered ?? []),
              buildWordList('Practice notes', '', judgment.practiceNotes),
            ].join('')}
            filename={`${judgment.title} - authorities and notes`}
            hint="Copy authorities and practice notes to MS Word."
          />
        </Section>
      )}
    </div>
  );
};

const getJudgmentTextForCopy = (judgment: CaseLaw): string => {
  if (!judgment.judgmentPages?.length) return judgment.fullJudgmentText ?? '';

  return judgment.judgmentPages
    .map((page) => [
      `PAGE ${page.page}`,
      ...page.paragraphs.map((paragraph, index) => `[${index + 1}] ${paragraph}`),
    ].join('\n\n'))
    .join('\n\n');
};

const WholeCasePanel: React.FC<{
  judgment: CaseLaw;
  status?: 'idle' | 'loading' | 'ready' | 'error';
}> = ({ judgment, status = 'ready' }) => {
  const citation = `${judgment.title} ${judgment.citation}`;
  const judgmentText = getJudgmentTextForCopy(judgment);
  const isLoading = status === 'idle' || status === 'loading';

  return (
    <div className="space-y-5">
      <Section title="Facts" subtitle="How the dispute arose and reached this court.">
        <p className="text-xs text-neutral-700 leading-relaxed bg-white border border-neutral-200 rounded-xl p-4">
          {judgment.factsSummary}
        </p>
      </Section>

      <Section title="Issues for determination" subtitle="The questions the court set itself to answer.">
        <NumberedList items={judgment.issuesForDetermination} />
      </Section>

      <Section title="Decision" subtitle="What the court held, and the order it made.">
        <p className="text-xs text-neutral-700 leading-relaxed bg-white border border-neutral-200 rounded-xl p-4">
          {judgment.decisionSummary}
        </p>
      </Section>

      <Section
        title="The whole case"
        subtitle="The judgment as delivered, paragraphed and page-numbered where the report provides it."
      >
        {isLoading ? (
          <div className="rounded-xl border border-amber-200 bg-white p-5 text-xs font-semibold text-neutral-700">
            Loading the full judgment...
          </div>
        ) : status === 'error' ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-xs font-semibold text-red-800">
            The full judgment could not be loaded. Please refresh and try again.
          </div>
        ) : judgment.judgmentPages?.length ? (
          <div className="max-h-[40rem] overflow-y-auto rounded-xl border border-amber-200 bg-white">
            {judgment.judgmentPages.map((page) => (
              <article key={page.page} className="border-b border-amber-100 last:border-b-0 p-4 sm:p-5">
                <div className="mb-4 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-800">
                  Page {page.page}
                </div>
                <div className="space-y-3 text-xs leading-relaxed text-neutral-800">
                  {page.paragraphs.map((paragraph, index) => (
                    <p key={`${page.page}-${index}`} className="grid grid-cols-[2rem_1fr] gap-2">
                      <span className="font-mono text-[10px] font-bold text-amber-700">[{index + 1}]</span>
                      <span>{paragraph}</span>
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <pre className="bg-white border border-neutral-200 rounded-xl p-4 text-[11px] leading-relaxed text-neutral-800 whitespace-pre-wrap font-mono overflow-x-auto max-h-[40rem] overflow-y-auto">
            {judgment.fullJudgmentText ?? 'Full judgment text is not available yet.'}
          </pre>
        )}

        {judgmentText && (
          <DocumentActions
            className="mt-4"
            html={buildWordDraft('Judgment', citation, judgmentText)}
            filename={`${judgment.title} - full judgment`}
            hint="Copy the whole case to MS Word."
          />
        )}
      </Section>

      <Section title="The case in one document" subtitle="Facts, issues, decision, ratio and principles together.">
        <DocumentActions
          html={[
            buildWordSection('Facts', citation, [judgment.factsSummary]),
            buildWordList('Reliefs claimed', '', judgment.reliefsClaimed ?? []),
            buildWordList('Issues for determination', '', judgment.issuesForDetermination),
            buildWordSection('Decision', '', [judgment.decisionSummary]),
            buildWordList('Orders made', '', judgment.ordersMade ?? []),
            buildWordList('Ratio decidendi', '', judgment.ratioDecidendi),
            buildWordList('Principles of law', '', judgment.keyPrinciples),
            buildWordList('Cases cited', '', judgment.authoritiesCited ?? []),
            buildWordList('Statutes considered', '', judgment.statutesConsidered ?? []),
          ].join('')}
          filename={`${judgment.title} - case note`}
          hint="Copy the full case note to MS Word."
        />
      </Section>
    </div>
  );
};

const TabButton: React.FC<{
  active: boolean;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}> = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
      active
        ? 'bg-yellow-400 text-neutral-950 shadow-lg shadow-yellow-500/25'
        : 'bg-yellow-100 text-neutral-700 border border-neutral-200 hover:border-yellow-500/80'
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

const MetaCard: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="bg-white border border-neutral-200 rounded-xl p-3 min-h-[5.25rem]">
    <div className="flex items-center gap-2 text-yellow-700">
      <Icon className="w-4 h-4" />
      <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
    </div>
    <p className="mt-1.5 text-xs font-bold text-neutral-900 leading-snug">{value}</p>
  </div>
);

const MiniHeading: React.FC<{ icon: React.ElementType; label: string }> = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 text-yellow-700">
    <Icon className="w-4 h-4" />
    <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
  </div>
);

const DigestBlock: React.FC<{ title: string; body: string; tone?: 'strong' }> = ({ title, body, tone }) => (
  <div
    className={`border rounded-xl p-4 ${
      tone === 'strong' ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-800'
    }`}
  >
    <h3 className={`text-[10px] font-black uppercase tracking-wider ${tone === 'strong' ? 'text-yellow-300' : 'text-yellow-700'}`}>
      {title}
    </h3>
    <p className={`mt-2 text-xs leading-relaxed ${tone === 'strong' ? 'text-neutral-100' : 'text-neutral-700'}`}>
      {body}
    </p>
  </div>
);

const NumberedList: React.FC<{ items: string[]; italic?: boolean }> = ({ items, italic }) => (
  <ol className="space-y-2.5">
    {items.map((item, index) => (
      <li
        key={`${item}-${index}`}
        className={`bg-white border border-neutral-200 rounded-xl p-4 flex gap-3 text-xs text-neutral-800 leading-relaxed ${
          italic ? 'italic' : ''
        }`}
      >
        <span className="text-yellow-700 font-black shrink-0 not-italic">{index + 1}.</span>
        <span>{item}</span>
      </li>
    ))}
  </ol>
);

const SimpleList: React.FC<{ items: string[]; italic?: boolean }> = ({ items, italic }) => (
  <ul className="space-y-2.5">
    {items.map((item, index) => (
      <li
        key={`${item}-${index}`}
        className={`bg-white border border-neutral-200 rounded-xl p-4 text-xs text-neutral-700 leading-relaxed ${
          italic ? 'italic' : ''
        }`}
      >
        {item}
      </li>
    ))}
  </ul>
);

const Section: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({
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
