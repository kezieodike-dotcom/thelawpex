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

const CASE_PAGE_BG =
  'bg-[radial-gradient(circle_at_12%_0%,rgba(250,204,21,0.22),transparent_30rem),linear-gradient(180deg,#fffdf6,#ffffff_24rem)]';

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
  <div className={`${CASE_PAGE_BG} text-neutral-900 min-h-screen py-8 sm:py-12`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-amber-200 bg-white p-6 shadow-[0_26px_80px_-58px_rgba(24,20,17,0.72)] sm:p-8 lg:p-10">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[linear-gradient(135deg,rgba(250,204,21,0.22),transparent_58%)] lg:block" />
        <div className="relative max-w-4xl">
          <span className="inline-flex items-center rounded-full bg-[#facc15] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-neutral-950">
            Nigerian case-law library
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-neutral-950 sm:text-5xl">Case Laws</h1>
          <p className="mt-3 max-w-3xl text-base leading-8 text-neutral-700 sm:text-lg">
            Open a court to research judgments in a readable legal digest: summary, principles,
            ratio decidendi, authorities and the whole case, ready for MS Word.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        {CASE_LAW_COURTS.map((court) => {
          const count = casesForCourt(court.name).length;

          return (
            <Link
              key={court.slug}
              to={`/case-law/${court.slug}`}
              className="group flex min-h-[13rem] flex-col justify-between rounded-[1.5rem] border border-amber-200 bg-white p-5 shadow-[0_18px_55px_-44px_rgba(24,20,17,0.7)] transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-[0_28px_70px_-46px_rgba(180,126,18,0.76)] sm:p-6"
            >
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-300 bg-amber-50">
                  <Gavel className="w-5 h-5 text-yellow-700" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-neutral-950 transition group-hover:text-amber-700">
                    {court.name}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-neutral-600">{court.blurb}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-amber-100 pt-4">
                <span className="text-sm font-bold text-neutral-600">
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
    <div className={`${CASE_PAGE_BG} text-neutral-900 min-h-screen py-8 sm:py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-amber-200 bg-white p-6 shadow-[0_26px_80px_-58px_rgba(24,20,17,0.72)] sm:p-8">
          <Link
            to="/case-law"
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-amber-800 hover:bg-amber-100"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All courts
          </Link>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-neutral-950 sm:text-5xl">{court.name}</h1>
          <p className="mt-3 max-w-3xl text-base leading-8 text-neutral-700 sm:text-lg">
            {court.blurb}
          </p>

          <div className="relative mt-7">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-700" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search case law/principles..."
              className="w-full rounded-2xl border border-amber-200 bg-[#fffdf6] py-4 pl-12 pr-4 text-base font-semibold text-neutral-950 shadow-inner outline-none focus:border-amber-400 focus:bg-white"
            />
          </div>

          <p className="mt-3 text-sm leading-6 text-neutral-600">
            {cases.length} of {all.length} judgments - search runs across facts, ratio,
            principles, authorities and catchwords.
          </p>
        </div>

        {cases.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-amber-200 bg-white p-6 text-base text-neutral-700">
            No judgment of the {court.name} in the library matches "{query}".
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {cases.map((judgment) => (
              <Link
                key={judgment.id}
                to={`/case-law/case/${judgment.id}`}
                className="group flex min-h-[16rem] flex-col justify-between rounded-[1.5rem] border border-amber-200 bg-white p-5 shadow-[0_18px_55px_-44px_rgba(24,20,17,0.72)] transition hover:-translate-y-1 hover:border-amber-400 sm:p-6"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-black text-amber-800">
                      {judgment.year} - {judgment.areaOfLaw}
                    </span>
                    {judgment.isLandmark && (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#facc15] px-2.5 py-1 text-[11px] font-black text-neutral-950">
                        <Award className="w-3 h-3" /> Landmark
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-black leading-snug tracking-tight text-neutral-950 transition group-hover:text-amber-700">
                    {judgment.title}
                  </h2>

                  <p className="text-sm font-black text-amber-700">
                    {judgment.citation} - {judgment.suitNumber}
                  </p>

                  <p className="line-clamp-3 text-sm leading-7 text-neutral-600">
                    {judgment.subject}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-amber-100 pt-4">
                  <span className="text-sm font-bold text-neutral-600">
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
  const [tab, setTab] = useState<'ratio' | 'digest' | 'principles' | 'authorities' | 'whole'>('ratio');

  useEffect(() => {
    let isMounted = true;

    if (!judgment.hasFullJudgment || document) return undefined;
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
  }, [document, judgment.hasFullJudgment, judgment.id, tab]);

  const related = (judgment.relatedCaseIds ?? [])
    .map((id) => LANDMARK_CASES.find((item) => item.id === id))
    .filter((item): item is CaseLaw => Boolean(item));

  return (
    <div className={`lawpex-case-section ${CASE_PAGE_BG} min-h-screen py-8 text-neutral-900 sm:py-12`}>
      <div className="mx-auto max-w-[96rem] px-4 sm:px-6 2xl:px-8">
        <div className="relative overflow-hidden rounded-[1.35rem] border border-amber-200 bg-white p-4 shadow-[0_18px_55px_-44px_rgba(24,20,17,0.72)] sm:p-5">
          <div className="absolute inset-y-0 right-0 hidden w-32 bg-[linear-gradient(135deg,rgba(250,204,21,0.16),transparent_62%)] sm:block" />
          <Link
            to={court ? `/case-law/${court.slug}` : '/case-law'}
            className="relative inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.13em] text-amber-800 hover:bg-amber-100"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {judgment.court}
          </Link>

          <h1 className="relative mt-3 max-w-4xl text-xl font-black leading-tight tracking-tight text-neutral-950 sm:text-2xl">
            {judgment.title}
          </h1>
          <p className="relative mt-1.5 text-xs font-black text-amber-700">
            {judgment.citation} - {judgment.suitNumber} - {judgment.year}
          </p>

          <div className="relative mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
            <MetaCard icon={Landmark} label="Court" value={judgment.court} />
            <MetaCard icon={MapPin} label="Division" value={judgment.judicialDivision ?? 'Not supplied'} />
            <MetaCard icon={CalendarDays} label="Delivered" value={judgment.dateDelivered ?? String(judgment.year)} />
            <MetaCard
              icon={Users}
              label="Panel"
              value={`${judgment.presidingJudges.length} justice${judgment.presidingJudges.length === 1 ? '' : 's'}`}
            />
          </div>

          <div className="relative mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-neutral-700">
              {judgment.areaOfLaw}
            </span>
            <span className="rounded-full border border-amber-200 bg-white px-2.5 py-1 text-[11px] font-bold text-neutral-700">
              {judgment.subject}
            </span>
            {(judgment.catchwords ?? []).map((catchword) => (
              <span
                key={catchword}
                className="rounded-full border border-neutral-800 bg-neutral-950 px-2.5 py-1 text-[11px] font-bold text-yellow-200"
              >
                {catchword}
              </span>
            ))}
          </div>
        </div>

        <div className="my-6 grid gap-4 lg:grid-cols-[14rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
          <aside className="lg:sticky lg:top-[5rem]">
            <div className="rounded-2xl border border-amber-200 bg-white/94 p-2.5 shadow-[0_18px_50px_-42px_rgba(24,20,17,0.72)] backdrop-blur-xl">
              <p className="px-2 pb-2 text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">
                Case sections
              </p>
              <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
                <TabButton
                  active={tab === 'ratio'}
                  icon={Award}
                  label="1. Ratio decidendi"
                  onClick={() => setTab('ratio')}
                />
                <TabButton
                  active={tab === 'digest'}
                  icon={ClipboardList}
                  label="2. Case digest"
                  onClick={() => setTab('digest')}
                />
                <TabButton
                  active={tab === 'principles'}
                  icon={Scale}
                  label="3. Principles of law"
                  onClick={() => setTab('principles')}
                />
                <TabButton
                  active={tab === 'authorities'}
                  icon={Library}
                  label="4. Authorities & notes"
                  onClick={() => setTab('authorities')}
                />
                <TabButton
                  active={tab === 'whole'}
                  icon={BookOpen}
                  label="5. Read the whole case"
                  onClick={() => setTab('whole')}
                />
              </div>
            </div>
          </aside>

          <main className="min-w-0">
            {tab === 'ratio' && <RatioPanel judgment={judgment} />}
            {tab === 'digest' && <DigestPanel judgment={judgment} />}
            {tab === 'principles' && <PrinciplesPanel judgment={judgment} />}
            {tab === 'authorities' && <AuthoritiesPanel judgment={judgment} />}
            {tab === 'whole' && <WholeCasePanel judgment={fullJudgment} status={documentStatus} />}
          </main>
        </div>

        {related.length > 0 && (
          <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-white p-5 shadow-[0_18px_55px_-44px_rgba(24,20,17,0.72)] sm:p-6">
            <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-amber-700">
              Cases considered alongside this one
            </h3>
            <div className="space-y-2">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/case-law/case/${item.id}`}
                  className="block rounded-2xl border border-amber-100 bg-[#fffdf6] p-4 transition hover:border-amber-400"
                >
                  <p className="text-base font-black leading-snug text-neutral-950">{item.title}</p>
                  <p className="mt-1 text-sm font-bold text-amber-700">{item.citation}</p>
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

          <div className="space-y-4 rounded-2xl border border-amber-200 bg-white p-5">
            <MiniHeading icon={Users} label="Coram" />
            <ul className="space-y-2">
              {judgment.presidingJudges.map((judge) => (
                <li key={judge} className="text-sm text-neutral-700 leading-7 flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-yellow-500 shrink-0" />
                  {judge}
                </li>
              ))}
            </ul>

            {judgment.appearances && (
              <div className="border-t border-neutral-200 pt-4">
                <MiniHeading icon={FileText} label="Appearances" />
                <div className="mt-2 space-y-1.5 text-sm text-neutral-700 leading-7">
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
  const principles = getExactPrincipleItems(judgment);

  return (
    <div className="space-y-5">
      <Section
        title="Principles of law in this case"
        subtitle="Exact source principles from the report where supplied, preserved for citation."
      >
        <NumberedList items={principles} />

        <DocumentActions
          className="mt-4"
          html={buildWordList('Principles of law in this case', citation, principles)}
          filename={`${judgment.title} - principles of law`}
          hint="Copy these principles to MS Word."
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

const RatioPanel: React.FC<{ judgment: CaseLaw }> = ({ judgment }) => {
  const citation = `${judgment.title} ${judgment.citation}`;
  const ratioDecidendi = getExactRatioItems(judgment);

  return (
    <Section
      title="Ratio decidendi"
      subtitle="The judge's exact words. Kept as a standalone authority section for authentication, citation and argument."
    >
      <div className="rounded-2xl border border-amber-300 bg-[#fff9d7] p-4 sm:p-5">
        <NumberedList items={ratioDecidendi} italic />
      </div>

      <DocumentActions
        className="mt-4"
        html={buildWordList('Ratio decidendi', citation, ratioDecidendi)}
        filename={`${judgment.title} - ratio decidendi`}
        hint="Copy the ratio to MS Word."
      />
    </Section>
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
  const pages = getJudgmentBodyPages(judgment);
  const totalPages = pages.length ? pages.length + 1 : judgment.fullJudgmentText ? 2 : 1;

  if (judgment.verbatimWholeCase || judgment.preserveSourceFormatting) {
    const bodyText = getSourceCaseBodyText(judgment.fullJudgmentText ?? '');
    if (!bodyText) return '';

    return [getCaseOpeningText(judgment, totalPages), `page (2) of (${totalPages})`, bodyText].join('\n\n');
  }

  const hasSourceLabels = usesSourceParagraphLabels(pages);
  const openingText = getCaseOpeningText(judgment, totalPages);

  if (!pages.length) {
    if (!judgment.fullJudgmentText) return '';

    return [
      openingText,
      `page (2) of (${totalPages})`,
      judgment.fullJudgmentText,
    ].join('\n\n');
  }

  const bodyText = pages
    .map((page, pageIndex) => [
      `page (${pageIndex + 2}) of (${totalPages})`,
      ...page.paragraphs.map((paragraph, index) =>
        hasSourceLabels ? paragraph : `${paragraphLabel(index)} ${paragraph}`,
      ),
    ].join('\n\n'))
    .join('\n\n');

  return [openingText, bodyText].join('\n\n');
};

const getCaseOpeningText = (judgment: CaseLaw, totalPages: number) => {
  const parties = getFormalCaseParties(judgment);

  return [
    formatCourtHeading(judgment.court),
    judgment.judicialDivision ? formatDivision(judgment.judicialDivision) : '',
    judgment.dateDelivered ? formatDeliveredDate(judgment.dateDelivered) : '',
    `Suit No: ${judgment.suitNumber}`,
    'Before Their Lordship',
    ...judgment.presidingJudges.map((judge) => `${cleanJudgeName(judge)} | ${judgeRole(judgment.court)}`),
    'BETWEEN',
    `${parties.appellants.join('\n')} | APPELLANT(S)`,
    'And',
    `${parties.respondents.join('\n')} | RESPONDENT(S)`,
    `page (1) of (${totalPages})`,
  ].filter(Boolean).join('\n\n');
};

const getDisplayJudgmentPages = (judgment: CaseLaw): NonNullable<CaseLaw['judgmentPages']> =>
  judgment.judgmentPages?.filter((page) => page.page.toLowerCase() !== 'headnote') ?? [];

const getJudgmentBodyPages = (judgment: CaseLaw): NonNullable<CaseLaw['judgmentPages']> => {
  const pages = getDisplayJudgmentPages(judgment);
  if (!pages.length) return [];

  return pages
    .map((page, pageIndex) => {
      if (pageIndex !== 0) return page;

      const firstBodyIndex = page.paragraphs.findIndex((paragraph) =>
        /^(summary of judgment|introduction:|facts:|issues:|judgment|leading judgment|ratio decidendi)/i.test(
          paragraph.trim(),
        ),
      );

      return {
        ...page,
        paragraphs: firstBodyIndex > -1 ? page.paragraphs.slice(firstBodyIndex) : page.paragraphs,
      };
    })
    .filter((page) => page.paragraphs.length > 0);
};

const PARAGRAPH_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const paragraphLabel = (index: number) => PARAGRAPH_LABELS[index % PARAGRAPH_LABELS.length];

const SOURCE_PARAGRAPH_LABEL = /^([A-G])\t(.+)/i;

const parseSourceParagraph = (paragraph: string) => {
  const match = paragraph.match(SOURCE_PARAGRAPH_LABEL);
  if (!match) return { text: paragraph };

  return {
    label: match[1].toUpperCase(),
    text: match[2],
  };
};

const usesSourceParagraphLabels = (pages: NonNullable<CaseLaw['judgmentPages']>) =>
  pages.some((page) => page.paragraphs.some((paragraph) => SOURCE_PARAGRAPH_LABEL.test(paragraph)));

const formatCourtHeading = (court: CaseLaw['court']) => {
  if (court === 'Supreme Court of Nigeria') return 'In The Supreme Court Of Nigeria';
  if (court === 'Court of Appeal') return 'In The Court Of Appeal';
  return `In The ${court}`;
};

const formatDivision = (division?: string) => {
  if (!division) return '';
  const clean = division.replace(/\s*judicial division\s*$/i, '').trim();
  return `(${clean.toUpperCase()} JUDICIAL DIVISION)`;
};

const ordinal = (day: number) => {
  const mod100 = day % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${day}th`;
  if (day % 10 === 1) return `${day}st`;
  if (day % 10 === 2) return `${day}nd`;
  if (day % 10 === 3) return `${day}rd`;
  return `${day}th`;
};

const formatDeliveredDate = (date?: string) => {
  if (!date) return '';
  const match = date.match(/^([^,]+),\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (!match) return `On ${date}`;
  return `On ${match[1]}, the ${ordinal(Number(match[2]))} day of ${match[3]}, ${match[4]}`;
};

const judgeRole = (court: CaseLaw['court']) => {
  if (court === 'Supreme Court of Nigeria') return 'Justice of the Supreme Court';
  if (court === 'Court of Appeal') return 'Justice of the Court Of Appeal';
  return 'Judge';
};

const cleanJudgeName = (judge: string) =>
  judge
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/,\s*(CJN|JSC|JCA|CJ|J)\.?$/i, '')
    .trim()
    .toUpperCase();

const caseParties = (title: string) => {
  const [appellant, respondent] = title.split(/\s+v\.?\s+/i);
  return {
    appellant: (appellant || 'APPELLANT').trim().toUpperCase(),
    respondent: (respondent || 'RESPONDENT').trim().toUpperCase(),
  };
};

const cleanPartyLine = (line: string) =>
  line
    .replace(/\b(APPELLANTS?|RESPONDENTS?)\b(?:\(\s*S\s*\))?/gi, '')
    .replace(/\b(APPELLANT|RESPONDENT)\(\s*S\s*\)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

const getFormalCaseParties = (judgment: CaseLaw) => {
  const fallback = caseParties(judgment.title);
  const source = judgment.fullJudgmentText ?? '';
  const afterReadMarker = source.split(/\(READ FULL JUDGMENT\)/i).pop() ?? source;
  const lines = afterReadMarker
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const betweenIndex = lines.findIndex((line) => /^between$/i.test(line));
  const andIndex =
    betweenIndex > -1
      ? lines.findIndex((line, index) => index > betweenIndex && /^and$/i.test(line))
      : -1;

  if (betweenIndex === -1 || andIndex === -1) {
    return {
      appellants: [fallback.appellant],
      respondents: [fallback.respondent],
    };
  }

  const stopPattern = /^(summary of judgment|ratio decidendi|law principles|issues:|introduction:|facts:)/i;
  const appellantLines = lines.slice(betweenIndex + 1, andIndex).map(cleanPartyLine).filter(Boolean);
  const respondents: string[] = [];

  for (let index = andIndex + 1; index < lines.length; index += 1) {
    if (stopPattern.test(lines[index])) break;
    const cleaned = cleanPartyLine(lines[index]);
    if (cleaned) respondents.push(cleaned);
  }

  return {
    appellants: appellantLines.length ? appellantLines : [fallback.appellant],
    respondents: respondents.length ? respondents : [fallback.respondent],
  };
};

const getSourceCaseBodyText = (text: string) => {
  if (!text.trim()) return '';

  let working = text.trim();
  const readMarkerParts = working.split(/\(READ FULL JUDGMENT\)/i);
  if (readMarkerParts.length > 1) {
    working = readMarkerParts[readMarkerParts.length - 1].trim();
  }

  const courtIndex = working.search(/\bIn The (?:Supreme Court Of Nigeria|Court Of Appeal)\b/i);
  const candidate = courtIndex > -1 ? working.slice(courtIndex) : working;
  const summaryIndex = candidate.search(/\bSUMMARY OF JUDGMENT\b/i);
  if (summaryIndex > -1) return candidate.slice(summaryIndex).trim();

  const leadingJudgmentMatch = candidate.match(
    /[A-Z][A-Z\s.'-]+,\s+J\.?\s*(?:S\.?\s*C|C\.?\s*A)\.?\s*(?:\([\s\S]{0,120}?Judgment\))?\s*:/,
  );
  if (leadingJudgmentMatch?.index !== undefined) return candidate.slice(leadingJudgmentMatch.index).trim();

  return candidate.trim();
};

const exactSectionStops = [
  /^\(?READ FULL JUDGMENT\)?$/i,
  /^IN THE\b/i,
  /^In The (?:Supreme Court Of Nigeria|Court Of Appeal)\b/i,
  /^In The Court Of Appeal\b/i,
  /^SUMMARY OF JUDGMENT$/i,
  /^JUDGMENT$/i,
  /^Before Their Lordships?$/i,
  /^BETWEEN$/i,
  /^[A-Z][A-Z\s.'-]+,\s+J\.?\s*(?:S\.?\s*C|C\.?\s*A)\.?\s*(?:\([\s\S]{0,120}?Judgment\))?\s*:/i,
];

const splitExactSectionBlocks = (section: string) =>
  section
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

const extractExactSourceSection = (text: string, headingPatterns: RegExp[], extraStops: RegExp[] = []) => {
  if (!text.trim()) return [];

  const lines = text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd());

  const headingIndex = lines.findIndex((line) => {
    const trimmed = line.trim();
    return headingPatterns.some((pattern) => pattern.test(trimmed));
  });

  if (headingIndex === -1) return [];

  const stops = [...extraStops, ...exactSectionStops];
  const captured: string[] = [];

  for (let index = headingIndex + 1; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    if (trimmed && captured.some((line) => line.trim()) && stops.some((pattern) => pattern.test(trimmed))) break;
    captured.push(lines[index]);
  }

  return splitExactSectionBlocks(captured.join('\n'));
};

const getSourcePrincipleItems = (judgment: CaseLaw) =>
  extractExactSourceSection(judgment.fullJudgmentText ?? '', [
    /^Law principles in this case$/i,
    /^Principles of law in this case$/i,
  ]);

const getSourceRatioItems = (judgment: CaseLaw) =>
  extractExactSourceSection(judgment.fullJudgmentText ?? '', [/^RATIO DECIDENDI$/i, /^Ratio Decidendi$/i]);

const getExactPrincipleItems = (judgment: CaseLaw) => {
  const sourcePrinciples = getSourcePrincipleItems(judgment);
  if (sourcePrinciples.length) return sourcePrinciples;

  const sourceRatio = getSourceRatioItems(judgment);
  if (sourceRatio.length) return sourceRatio;

  return judgment.keyPrinciples ?? [];
};

const getExactRatioItems = (judgment: CaseLaw) => {
  const sourceRatio = getSourceRatioItems(judgment);
  if (sourceRatio.length) return sourceRatio;

  const sourcePrinciples = getSourcePrincipleItems(judgment);
  if (sourcePrinciples.length) return sourcePrinciples;

  return judgment.ratioDecidendi ?? [];
};

const WholeCasePanel: React.FC<{
  judgment: CaseLaw;
  status?: 'idle' | 'loading' | 'ready' | 'error';
}> = ({ judgment, status = 'ready' }) => {
  const citation = `${judgment.title} ${judgment.citation}`;
  const judgmentText = getJudgmentTextForCopy(judgment);
  const isLoading = status === 'idle' || status === 'loading';
  const bodyPages = getJudgmentBodyPages(judgment);
  const totalPages = bodyPages.length ? bodyPages.length + 1 : judgment.fullJudgmentText ? 2 : 1;
  const hasSourceLabels = usesSourceParagraphLabels(bodyPages);
  const sourceCaseBodyText = getSourceCaseBodyText(judgment.fullJudgmentText ?? '');

  return (
    <div className="space-y-5">
      <Section
        title="The whole case"
        subtitle="The judgment as delivered, paragraphed and page-numbered where the report provides it."
      >
        {isLoading ? (
          <div className="rounded-2xl border border-amber-200 bg-white p-6 text-base font-semibold text-neutral-700">
            Loading the full judgment...
          </div>
        ) : status === 'error' ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-base font-semibold text-red-800">
            The full judgment could not be loaded. Please refresh and try again.
          </div>
        ) : (judgment.verbatimWholeCase || judgment.preserveSourceFormatting) && judgment.fullJudgmentText ? (
          <div className="overflow-hidden rounded-[1.5rem] border border-amber-200 bg-white shadow-inner">
            <CaseCoatOfArmsHeader />
            <CaseOpeningPage judgment={judgment} totalPages={totalPages} />
            <article className="w-full border-b border-amber-100 bg-white p-5 last:border-b-0 sm:p-7 lg:px-8 lg:py-8 xl:px-10">
              <div className="mb-5 inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 font-mono text-[9px] font-bold text-amber-700">
                page (2) of ({totalPages})
              </div>
              <SourceJudgmentText text={sourceCaseBodyText} />
            </article>
          </div>
        ) : bodyPages.length ? (
          <div className="overflow-hidden rounded-[1.5rem] border border-amber-200 bg-white shadow-inner">
            <CaseCoatOfArmsHeader />
            <CaseOpeningPage judgment={judgment} totalPages={totalPages} />
            {bodyPages.map((page, pageIndex) => (
              <article key={page.page} className="w-full border-b border-amber-100 p-5 last:border-b-0 sm:p-8 lg:px-8 lg:py-8 xl:px-10">
                <div className="mb-5 inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 font-mono text-[9px] font-bold text-amber-700">
                  page ({pageIndex + 2}) of ({totalPages})
                </div>
                <div className="space-y-5 text-sm leading-7 text-neutral-800">
                  {page.paragraphs.map((paragraph, index) => {
                    const sourceParagraph = parseSourceParagraph(paragraph);
                    const label = hasSourceLabels ? sourceParagraph.label : paragraphLabel(index);
                    const text = hasSourceLabels ? sourceParagraph.text : paragraph;

                    return (
                      <p key={`${page.page}-${index}`} className="grid grid-cols-[2.75rem_1fr] gap-3 sm:grid-cols-[3.5rem_1fr]">
                        <span className="font-mono text-sm font-black leading-7 text-amber-700">
                          {label ?? ''}
                        </span>
                        <span>{text}</span>
                      </p>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-[1.5rem] border border-amber-200 bg-white shadow-inner">
            <CaseCoatOfArmsHeader />
            <CaseOpeningPage judgment={judgment} totalPages={totalPages} />
            {judgment.fullJudgmentText ? (
              <article className="border-b border-amber-100 p-5 last:border-b-0 sm:p-8 lg:px-10 lg:py-9">
                <div className="mb-5 inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 font-mono text-[9px] font-bold text-amber-700">
                  page (2) of ({totalPages})
                </div>
                <pre className="block w-full max-w-none whitespace-pre-wrap font-mono text-sm leading-7 text-neutral-800">
                  {judgment.fullJudgmentText}
                </pre>
              </article>
            ) : (
              <div className="p-5 text-sm font-semibold leading-7 text-neutral-700 sm:p-8 lg:px-10 lg:py-9">
                Full judgment text is not available yet.
              </div>
            )}
          </div>
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

    </div>
  );
};

const CaseCoatOfArmsHeader: React.FC = () => (
  <div className="border-b border-amber-100 bg-[#fffdf6] px-5 py-5 text-center sm:px-8">
    <img src="/nigeria-coat-of-arms.svg" alt="Nigeria coat of arms" className="mx-auto h-16 w-16 sm:h-20 sm:w-20" />
    <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">
      Judgment of the court
    </p>
  </div>
);

const SourceJudgmentText: React.FC<{ text: string }> = ({ text }) => {
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => block.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim());

  return (
    <div className="w-full max-w-none space-y-4 text-sm leading-7 text-neutral-900 sm:text-base">
      {blocks.map((block, index) => {
        const isHeading =
          block.length < 96 &&
          (/^[A-Z][A-Z0-9\s.,'():;/&-]+$/.test(block) ||
            /^(SUMMARY OF JUDGMENT|INTRODUCTION:|FACTS:?|ISSUES:?|DECISION\/HELD:|RATIO DECIDENDI)$/i.test(block));
        const sourceLabel = block.match(/^([A-G])\s+(.+)/);

        if (sourceLabel) {
          return (
            <p key={`${block.slice(0, 28)}-${index}`} className="grid w-full grid-cols-[2.5rem_minmax(0,1fr)] gap-3">
              <span className="font-semibold text-amber-700">{sourceLabel[1]}</span>
              <span>{sourceLabel[2]}</span>
            </p>
          );
        }

        return (
          <p
            key={`${block.slice(0, 28)}-${index}`}
            className={isHeading ? 'font-semibold uppercase tracking-[0.04em] text-neutral-950' : undefined}
          >
            {block}
          </p>
        );
      })}
    </div>
  );
};

const CaseOpeningPage: React.FC<{ judgment: CaseLaw; totalPages: number }> = ({ judgment, totalPages }) => {
  const parties = getFormalCaseParties(judgment);
  const role = judgeRole(judgment.court);

  return (
    <article className="w-full border-b border-amber-100 bg-white px-5 py-9 font-[Georgia,ui-serif,serif] text-neutral-950 sm:px-10 sm:py-12 lg:px-12 xl:px-16">
      <div className="mx-auto w-full max-w-[76rem]">
        <header className="text-center text-sm leading-7 sm:text-base">
          <p className="font-black">{formatCourtHeading(judgment.court)}</p>
          {judgment.judicialDivision && (
            <p className="mt-1 font-semibold">{formatDivision(judgment.judicialDivision)}</p>
          )}
          {judgment.dateDelivered && <p className="mt-5">{formatDeliveredDate(judgment.dateDelivered)}</p>}
          <p className="mt-3">Suit No: {judgment.suitNumber}</p>
          <p className="mt-5">Before Their Lordship</p>
        </header>

        <div className="mt-8 space-y-9 sm:mt-10">
          {judgment.presidingJudges.map((judge) => (
            <div key={judge} className="grid gap-3 sm:grid-cols-[1.05fr_0.95fr] sm:gap-16">
              <p className="font-black leading-6">{cleanJudgeName(judge)}</p>
              <p className="font-black leading-6">{role}</p>
            </div>
          ))}
        </div>

        <div className="mt-11 space-y-9 text-sm sm:mt-12">
          <p>BETWEEN</p>

          <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto] sm:gap-16">
            <div className="space-y-1 text-center leading-6 sm:pl-24">
              {parties.appellants.map((party) => (
                <p key={party}>{party}</p>
              ))}
            </div>
            <p className="font-semibold">APPELLANT(S)</p>
          </div>

          <p>And</p>

          <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto] sm:gap-16">
            <div className="space-y-1 text-center leading-6 sm:pl-24">
              {parties.respondents.map((party) => (
                <p key={party}>{party}</p>
              ))}
            </div>
            <p className="font-semibold">RESPONDENT(S)</p>
          </div>
        </div>

        <p className="mt-12 text-right font-mono text-[9px] font-bold text-neutral-500">
          page (1) of ({totalPages})
        </p>
      </div>
    </article>
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
    className={`flex min-w-max shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-left text-xs font-black transition active:scale-[0.99] lg:w-full ${
      active
        ? 'bg-[#facc15] text-neutral-950 shadow-[0_12px_30px_-20px_rgba(180,126,18,0.9)]'
        : 'border border-amber-200 bg-white text-neutral-700 hover:border-amber-400 hover:bg-amber-50'
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
  <div className="min-h-0 rounded-lg border border-amber-100 bg-[#fffdf6] px-2.5 py-2">
    <div className="flex min-w-0 items-center gap-2 text-yellow-700">
      <Icon className="h-3 w-3 shrink-0" />
      <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wider">{label}</span>
      <span className="min-w-0 truncate text-[11px] font-semibold leading-snug text-neutral-950">{value}</span>
    </div>
  </div>
);

const MiniHeading: React.FC<{ icon: React.ElementType; label: string }> = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 text-amber-700">
    <Icon className="w-4 h-4" />
    <span className="text-[11px] font-black uppercase tracking-[0.14em]">{label}</span>
  </div>
);

const DigestBlock: React.FC<{ title: string; body: string; tone?: 'strong' }> = ({ title, body, tone }) => (
  <div
    className={`rounded-2xl border p-5 ${
      tone === 'strong' ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-amber-100 text-neutral-800'
    }`}
  >
    <h3 className={`text-[10px] font-black uppercase tracking-wider ${tone === 'strong' ? 'text-yellow-300' : 'text-yellow-700'}`}>
      {title}
    </h3>
    <p className={`mt-3 text-sm leading-7 ${tone === 'strong' ? 'text-neutral-100' : 'text-neutral-700'}`}>
      {body}
    </p>
  </div>
);

const NumberedList: React.FC<{ items: string[]; italic?: boolean }> = ({ items, italic }) => (
  <ol className="space-y-3">
    {items.map((item, index) => (
      <li
        key={`${item}-${index}`}
        className={`flex gap-3 rounded-2xl border border-amber-100 bg-white p-4 text-sm leading-7 text-neutral-800 sm:p-5 ${
          italic ? 'italic' : ''
        }`}
      >
        <span className="shrink-0 font-black text-amber-700 not-italic">{index + 1}.</span>
        <span className="whitespace-pre-wrap">{item}</span>
      </li>
    ))}
  </ol>
);

const SimpleList: React.FC<{ items: string[]; italic?: boolean }> = ({ items, italic }) => (
  <ul className="space-y-3">
    {items.map((item, index) => (
      <li
        key={`${item}-${index}`}
        className={`rounded-2xl border border-amber-100 bg-white p-4 text-sm leading-7 text-neutral-800 sm:p-5 ${
          italic ? 'italic' : ''
        }`}
      >
        <span className="whitespace-pre-wrap">{item}</span>
      </li>
    ))}
  </ul>
);

const Section: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => (
  <div className="rounded-[1.5rem] border border-amber-200 bg-[#fffdf6] p-5 shadow-[0_18px_55px_-44px_rgba(24,20,17,0.72)] lg:p-6">
    <div className="mb-5 border-b border-amber-100 pb-4">
      <h2 className="text-lg font-black tracking-tight text-neutral-950 sm:text-xl">{title}</h2>
      <p className="mt-1.5 max-w-3xl text-xs leading-6 text-neutral-600 sm:text-sm">{subtitle}</p>
    </div>
    {children}
  </div>
);
