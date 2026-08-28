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
      'Judgments of the penultimate court, organised for appellate research with digest, principles, ratio decidendi and full judgment text.',
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
      <div className="lawpex-case-motion relative overflow-hidden rounded-[2rem] border border-amber-200 bg-white p-6 shadow-[0_26px_80px_-58px_rgba(24,20,17,0.72)] sm:p-8 lg:p-10">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[linear-gradient(135deg,rgba(250,204,21,0.22),transparent_58%)] lg:block" />
        <div className="relative max-w-4xl">
          <span className="inline-flex items-center rounded-full bg-[#facc15] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-neutral-950">
            Nigerian case laws library
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-neutral-950 sm:text-5xl">Case Laws</h1>
          <p className="mt-3 max-w-3xl text-base leading-8 text-neutral-700 sm:text-lg">
            Open a court to research judgments in a readable legal digest: summary, principles,
            ratio decidendi, authorities and the whole case, ready for MS Word.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        {CASE_LAW_COURTS.map((court, index) => {
          const count = casesForCourt(court.name).length;

          return (
            <Link
              key={court.slug}
              to={`/case-law/${court.slug}`}
              className="lawpex-case-motion group flex min-h-[13rem] flex-col justify-between rounded-[1.5rem] border border-amber-200 bg-white p-5 shadow-[0_18px_55px_-44px_rgba(24,20,17,0.7)] transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-[0_28px_70px_-46px_rgba(180,126,18,0.76)] sm:p-6"
              style={{ '--case-delay': `${120 + index * 85}ms` } as React.CSSProperties}
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
              placeholder="Search case laws/principles..."
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

type CaseDetailTab = 'ratio' | 'digest' | 'principles' | 'authorities' | 'whole';

const CaseDetail: React.FC<{ judgment: CaseLaw }> = ({ judgment }) => {
  const [document, setDocument] = useState<CaseJudgmentDocument | null>(null);
  const [documentStatus, setDocumentStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    judgment.hasFullJudgment ? 'idle' : 'ready',
  );
  const fullJudgment = useMemo(() => mergeCaseJudgmentDocument(judgment, document), [document, judgment]);
  const court = CASE_LAW_COURTS.find((item) => item.name === judgment.court);
  const [tab, setTab] = useState<CaseDetailTab>('ratio');

  useEffect(() => {
    let isMounted = true;

    if (!judgment.hasFullJudgment || document) return undefined;
    if (!['ratio', 'principles', 'whole'].includes(tab)) return undefined;

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

  const caseSectionTabs: { id: CaseDetailTab; icon: React.ElementType; label: string; kicker: string }[] = [
    { id: 'ratio', icon: Award, label: 'Ratio decidendi', kicker: 'Binding reasons' },
    { id: 'digest', icon: ClipboardList, label: 'Case digest', kicker: 'Facts and decision' },
    { id: 'principles', icon: Scale, label: 'Principles of law', kicker: 'Legal propositions' },
    { id: 'authorities', icon: Library, label: 'Authorities & notes', kicker: 'Cases, statutes, practice' },
    { id: 'whole', icon: BookOpen, label: 'Read the whole case', kicker: 'Full judgment' },
  ];
  const selectCaseSection = (nextTab: CaseDetailTab) => {
    setTab(nextTab);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  return (
    <div className={`lawpex-case-section ${CASE_PAGE_BG} min-h-screen py-4 text-neutral-900 sm:py-12`}>
      <div className="mx-auto max-w-[112rem] px-3 sm:px-6 2xl:px-10">
        <div className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[19.5rem_minmax(0,1fr)] lg:items-start">
          <aside className="sticky top-0 z-20 -mx-3 bg-[#fffdf6]/96 px-3 py-2 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:top-4 lg:z-auto lg:mx-0 lg:bg-transparent lg:px-0 lg:py-0">
            <div className="overflow-hidden rounded-[1.15rem] border border-amber-200 bg-white/96 shadow-[0_20px_60px_-48px_rgba(24,20,17,0.8)] backdrop-blur-xl">
              <div className="border-b border-amber-100 bg-[#fff8dc] px-4 py-4">
                <Link
                  to={court ? `/case-law/${court.slug}` : '/case-law'}
                  className="lawpex-focus-ring inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.13em] text-amber-800 hover:bg-amber-50"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {judgment.court}
                </Link>
                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">
                  Case sections
                </p>
                <h2 className="mt-1.5 text-lg font-black leading-tight tracking-tight text-neutral-950">
                  {judgment.title}
                </h2>
                <p className="mt-1 text-xs font-black leading-5 text-amber-800">{judgment.citation}</p>
              </div>

              <nav className="lawpex-scrollbar-hide flex snap-x gap-2 overflow-x-auto p-2 lg:flex-col lg:overflow-visible" aria-label="Case sections">
                {caseSectionTabs.map((item, index) => (
                  <TabButton
                    key={item.id}
                    active={tab === item.id}
                    icon={item.icon}
                    label={`${index + 1}. ${item.label}`}
                    description={item.kicker}
                    onClick={() => selectCaseSection(item.id)}
                  />
                ))}
              </nav>

            </div>
          </aside>

          <main className="min-w-0 space-y-4 xl:max-w-none">
            <div className="relative overflow-hidden rounded-[1.1rem] border border-amber-200 bg-white p-4 shadow-[0_18px_55px_-44px_rgba(24,20,17,0.72)] sm:rounded-[1.35rem] sm:p-6 lg:p-7">
              <div className="absolute inset-y-0 right-0 hidden w-40 bg-[linear-gradient(135deg,rgba(250,204,21,0.18),transparent_62%)] sm:block" />
              <h1 className="relative max-w-5xl text-2xl font-black leading-tight tracking-tight text-neutral-950 sm:text-3xl">
                {judgment.title}
              </h1>
              <p className="relative mt-2 max-w-5xl break-words text-sm font-black leading-6 text-amber-700 sm:text-base">
                {judgment.citation}
              </p>

              <div className="relative mt-4 grid grid-cols-2 gap-2 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
                <MetaCard icon={Landmark} label="Court" value={judgment.court} />
                <MetaCard icon={MapPin} label="Division" value={judgment.judicialDivision ?? 'Not supplied'} />
                <MetaCard icon={CalendarDays} label="Delivered" value={judgment.dateDelivered ?? String(judgment.year)} />
                <MetaCard
                  icon={Users}
                  label="Panel"
                  value={`${judgment.presidingJudges.length} justice${judgment.presidingJudges.length === 1 ? '' : 's'}`}
                />
              </div>

              <div className="relative mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold leading-4 text-neutral-700 sm:text-[11px]">
                  {judgment.areaOfLaw}
                </span>
                <span className="rounded-full border border-amber-200 bg-white px-2.5 py-1 text-[10px] font-bold leading-4 text-neutral-700 sm:text-[11px]">
                  {judgment.subject}
                </span>
                {(judgment.catchwords ?? []).map((catchword) => (
                  <span
                    key={catchword}
                    className="rounded-full border border-neutral-800 bg-neutral-950 px-2.5 py-1 text-[10px] font-bold leading-4 text-yellow-200 sm:text-[11px]"
                  >
                    {catchword}
                  </span>
                ))}
              </div>
            </div>

            <section className="min-w-0" aria-live="polite">
              {tab === 'ratio' && <RatioPanel judgment={fullJudgment} onReadFullJudgment={() => selectCaseSection('whole')} />}
              {tab === 'digest' && <DigestPanel judgment={judgment} />}
              {tab === 'principles' && <PrinciplesPanel judgment={judgment} />}
              {tab === 'authorities' && <AuthoritiesPanel judgment={judgment} />}
              {tab === 'whole' && <WholeCasePanel judgment={fullJudgment} status={documentStatus} />}
            </section>
          </main>
        </div>

      </div>
    </div>
  );
};

const DigestPanel: React.FC<{ judgment: CaseLaw }> = ({ judgment }) => {
  const citation = `${judgment.title} ${judgment.citation}`;

  return (
    <div className="space-y-6">
      <Section
        title="Summary of judgment"
        subtitle="The fast brief: court, posture, facts, issues, decision and orders."
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.75fr_0.7fr] xl:items-start">
          <div className="space-y-6">
            {judgment.proceduralHistory && (
              <DigestBlock title="Procedural history" body={judgment.proceduralHistory} />
            )}
            <DigestBlock title="Facts" body={judgment.factsSummary} />
            <DigestBlock title="Decision / held" body={judgment.decisionSummary} tone="strong" />
          </div>

          <div className="space-y-5 rounded-2xl border border-amber-200 bg-white p-6 sm:p-7 xl:sticky xl:top-28">
            <MiniHeading icon={Users} label="Coram" />
            <ul className="space-y-2">
              {judgment.presidingJudges.map((judge) => (
                <li key={judge} className="flex gap-2 text-base leading-8 text-neutral-700 sm:text-[17px]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-yellow-500 shrink-0" />
                  {judge}
                </li>
              ))}
            </ul>

            {judgment.appearances && (
              <div className="border-t border-neutral-200 pt-4">
                <MiniHeading icon={FileText} label="Appearances" />
                <div className="mt-2 space-y-1.5 text-base leading-8 text-neutral-700 sm:text-[17px]">
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
  const principles = withCurrentReportCitations(judgment, getExactPrincipleItems(judgment));

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

const RatioPanel: React.FC<{ judgment: CaseLaw; onReadFullJudgment: () => void }> = ({
  judgment,
  onReadFullJudgment,
}) => {
  const [activeRatioIndex, setActiveRatioIndex] = useState<number | null>(null);
  const citation = `${judgment.title} ${judgment.citation}`;
  const ratioPoints = useMemo(
    () => getExactRatioPoints(judgment).map((point) => withCurrentRatioCitation(judgment, point)),
    [judgment],
  );
  const ratioDecidendi = ratioPoints.map((point) => point.fullText);
  const activeRatio = activeRatioIndex === null ? undefined : ratioPoints[activeRatioIndex];
  const openRatio = (index: number) => {
    setActiveRatioIndex(index);
    window.requestAnimationFrame(() => {
      document.getElementById('ratio-decidendi-reader')?.scrollIntoView({ block: 'start' });
    });
  };

  return (
    <Section
      title="Ratio decidendi"
      subtitle="Each ratio is listed by its legal proposition. Open any item to read the judge's exact words without summary."
    >
      {ratioPoints.length > 0 && !activeRatio ? (
        <div className="min-h-[68vh] divide-y divide-amber-100 rounded-2xl border border-amber-200 bg-white">
            {ratioPoints.map((point, index) => (
              <button
                key={`${point.heading}-${index}`}
                type="button"
                onClick={() => openRatio(index)}
                className="group flex min-h-[10.5rem] w-full gap-4 p-5 text-left text-neutral-800 transition hover:bg-amber-50/80 active:scale-[0.995] sm:min-h-[12rem] sm:gap-5 sm:p-7 lg:p-8"
              >
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#facc15] text-base font-black text-neutral-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] sm:h-12 sm:w-12 sm:text-lg">
                  {index + 1}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-3">
                  <span className="inline-flex w-fit max-w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-black uppercase leading-6 text-amber-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] sm:px-4 sm:py-2 sm:text-base sm:leading-7">
                    {judgment.title}
                  </span>
                  <RatioHeadingText heading={point.heading} />
                  {point.body && (
                    <span className="line-clamp-1 max-w-5xl font-[Georgia,ui-serif,serif] text-sm leading-7 text-neutral-500 sm:text-base">
                      {point.body}
                    </span>
                  )}
                  <span className="mt-auto inline-flex items-center justify-end text-amber-700">
                    <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
                  </span>
                </span>
              </button>
            ))}
        </div>
      ) : activeRatio ? (
        <div id="ratio-decidendi-reader" className="scroll-mt-24 min-h-[70vh]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setActiveRatioIndex(null)}
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-black text-amber-800 transition hover:border-amber-400 hover:bg-amber-50 active:scale-[0.99]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              type="button"
              onClick={onReadFullJudgment}
              className="inline-flex min-h-11 w-fit items-center justify-center rounded-full bg-neutral-950 px-4 py-2 text-sm font-black text-yellow-200 transition hover:bg-neutral-800 active:scale-[0.99] sm:ml-auto"
            >
              Read full judgment
            </button>
          </div>

          <article className="mt-5 w-full rounded-2xl border border-amber-300 bg-[#fff9d7] p-5 sm:p-8 lg:p-10 xl:p-12">
            <p className="text-lg font-black leading-8 tracking-tight text-neutral-950 sm:text-2xl">
              {judgment.title}
            </p>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-800">
              Ratio {activeRatioIndex + 1} of {ratioPoints.length}
            </p>
            <h3 className="mt-4 max-w-6xl text-2xl font-black leading-tight tracking-tight text-neutral-950 sm:text-3xl sm:leading-tight">
              {activeRatio.heading}
            </h3>
            {activeRatio.body && (
              <blockquote className="mt-8 max-w-7xl whitespace-pre-wrap border-l-4 border-amber-500 pl-5 font-[Georgia,ui-serif,serif] text-[17px] leading-9 text-neutral-900 sm:pl-7 sm:text-xl sm:leading-10">
                {activeRatio.body}
              </blockquote>
            )}
            {activeRatio.attribution && (
              <p className="mt-8 text-base font-black leading-7 text-amber-800 sm:text-lg">
                {activeRatio.attribution}
              </p>
            )}
          </article>

          <DocumentActions
            className="mt-4"
            html={buildWordList('Ratio decidendi', citation, [activeRatio.fullText])}
            filename={`${judgment.title} - ratio ${activeRatioIndex + 1}`}
            hint="Copy this ratio to MS Word."
          />
        </div>
      ) : (
        <div className="w-full rounded-2xl border border-amber-300 bg-[#fff9d7] p-4 sm:p-6 lg:p-7">
          <NumberedList items={ratioDecidendi} italic />
        </div>
      )}
    </Section>
  );
};

const RatioHeadingText: React.FC<{ heading: string }> = ({ heading }) => {
  const parts = heading.split(RATIO_HEADING_SEPARATOR).map((part) => part.trim()).filter(Boolean);

  if (parts.length < 2) {
    return (
      <span className="min-w-0 text-sm font-black leading-7 tracking-[0.02em] text-neutral-950 sm:text-base sm:leading-8">
        {heading}
      </span>
    );
  }

  const category = parts.slice(0, -1).join(' - ');
  const issue = parts[parts.length - 1];

  return (
    <span className="min-w-0 text-sm font-black leading-7 tracking-[0.02em] sm:text-base sm:leading-8">
      <span className="text-amber-700">{category}</span>
      <span className="text-amber-700"> - </span>
      <span className="text-neutral-950">{issue}</span>
    </span>
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

  if (judgment.verbatimWholeCase || judgment.preserveSourceFormatting) {
    const bodyText = getSourceCaseBodyText(judgment.fullJudgmentText ?? '');
    const sourcePages = paginateJudgmentSourceText(judgment, bodyText);
    const sourcePagesWithCurrentCitations = withCurrentSourcePageCitations(judgment, sourcePages);
    const totalPages = sourcePages.length ? sourcePages.length + 1 : 1;
    if (!bodyText) return '';

    return [
      getCaseOpeningText(judgment, totalPages),
      ...sourcePagesWithCurrentCitations.map((page, pageIndex) => [
        page.blocks.map((block) => block.text).join('\n\n'),
        `page (${pageIndex + 2}) of (${totalPages})`,
      ].join('\n\n')),
    ].join('\n\n');
  }

  const totalPages = pages.length ? pages.length + 1 : judgment.fullJudgmentText ? 2 : 1;
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
      ...withCurrentReportCitations(judgment, page.paragraphs),
      `page (${pageIndex + 2}) of (${totalPages})`,
    ].join('\n\n'))
    .join('\n\n');

  return [openingText, bodyText].join('\n\n');
};

const getCaseOpeningText = (judgment: CaseLaw, totalPages: number) => {
  const parties = getFormalCaseParties(judgment);

  return [
    judgment.title.toUpperCase(),
    judgment.citation.replace(/\bpt\b/i, 'Pt.'),
    formatCourtHeading(judgment.court),
    judgment.judicialDivision ? formatDivision(judgment.judicialDivision) : '',
    judgment.dateDelivered ?? '',
    `Suit No: ${judgment.suitNumber}`,
    'BEFORE THEIR LORDSHIPS',
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

const JUDGE_JUDGMENT_HEADING =
  String.raw`(?:[A-Z][A-Z\s.'-]+,\s+J\.?\s*(?:S\.?\s*C|C\.?\s*A)\.?(?:\s*\([^)]*(?:Leading\s+)?Judgment[^)]*\))?\s*:)`;
const LEADING_JUDGMENT_HEADING = new RegExp(String.raw`^(?:[A-G]\s+)?${JUDGE_JUDGMENT_HEADING}`, 'i');
const INLINE_LEADING_JUDGMENT_HEADING = new RegExp(String.raw`(\s+)((?:[A-G]\s+)?${JUDGE_JUDGMENT_HEADING})`, 'gi');

const isLeadingJudgmentStart = (text: string) => LEADING_JUDGMENT_HEADING.test(text.trim());

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
    .flatMap((page) => {
      const leadIndex = page.paragraphs.findIndex((paragraph) => {
        const trimmed = paragraph.trim();
        const sourceLabel = trimmed.match(/^([A-G])\s+(.+)/);
        return isLeadingJudgmentStart(sourceLabel?.[2] ?? trimmed);
      });
      if (leadIndex < 1) return [page];

      return [
        { ...page, paragraphs: page.paragraphs.slice(0, leadIndex) },
        { ...page, page: `${page.page}-lead`, paragraphs: page.paragraphs.slice(leadIndex) },
      ];
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

  const leadingJudgmentMatch = candidate.match(new RegExp(JUDGE_JUDGMENT_HEADING, 'i'));
  if (leadingJudgmentMatch?.index !== undefined) return candidate.slice(leadingJudgmentMatch.index).trim();

  return candidate.trim();
};

type SourceJudgmentBlock = {
  text: string;
  isHeading: boolean;
  isRatioHeading: boolean;
  startsLeadingJudgment: boolean;
  sourceLabel?: string;
  sourceText?: string;
};

const normalizeSourceJudgmentMarkers = (text: string) =>
  text
    .replace(
      /(\(\s*Delivering)\s*\n+\s*(the\s+Leading\s+Judgment\)\s*:)/gi,
      '$1 $2',
    )
    .replace(
      /([A-Z][A-Z\s.'-]+,\s+J\.?\s*(?:S\.?\s*C|C\.?\s*A)\.?\s*\(\s*Delivering)\s*\n+\s*[A-G]\s+the\s+Leading\s+Judgment\)\s*:/gi,
      '$1 the Leading Judgment):',
    );

const getSourceJudgmentBlocks = (text: string): SourceJudgmentBlock[] =>
  normalizeSourceJudgmentMarkers(text)
    .replace(INLINE_LEADING_JUDGMENT_HEADING, '\n\n$2')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => block.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim())
    .map((block) => {
      const isHeading =
        block.length < 96 &&
        (/^[A-Z][A-Z0-9\s.,'():;/&-]+$/.test(block) ||
          /^(SUMMARY OF JUDGMENT|INTRODUCTION:|FACTS:?|ISSUES:?|DECISION\/HELD:|RATIO DECIDENDI)$/i.test(block));
      const sourceLabel = block.match(/^([A-G])\s+(.+)/);

      return {
        text: block,
        isHeading,
        isRatioHeading: /^RATIO DECIDENDI$/i.test(block),
        startsLeadingJudgment: isLeadingJudgmentStart(sourceLabel?.[2] ?? block),
        sourceLabel: sourceLabel?.[1],
        sourceText: sourceLabel?.[2],
      };
    });

const paginateSourceJudgmentText = (text: string, sourceLinePadding = 90) => {
  const blocks = getSourceJudgmentBlocks(text);
  const pages: { blocks: SourceJudgmentBlock[] }[] = [];
  let current: SourceJudgmentBlock[] = [];
  let pageSize = 0;
  let hasForcedLeadingJudgmentPage = false;
  const targetCharactersPerPage = 5000;

  blocks.forEach((block) => {
    const weightedSize = block.text.length + (block.isHeading ? 220 : sourceLinePadding);
    const shouldForceLeadPage =
      current.length > 0 &&
      !hasForcedLeadingJudgmentPage &&
      block.startsLeadingJudgment;

    if (shouldForceLeadPage) {
      pages.push({ blocks: current });
      current = [];
      pageSize = 0;
      hasForcedLeadingJudgmentPage = true;
    }

    const shouldStartNewPage =
      current.length > 0 && pageSize + weightedSize > targetCharactersPerPage && !block.isHeading;

    if (shouldStartNewPage) {
      pages.push({ blocks: current });
      current = [];
      pageSize = 0;
    }

    current.push(block);
    pageSize += weightedSize;
  });

  if (current.length) pages.push({ blocks: current });

  return pages;
};

const denseSourceJudgmentIds = new Set(['case-003', 'case-004']);

const paginateJudgmentSourceText = (judgment: CaseLaw, text: string) =>
  paginateSourceJudgmentText(text, denseSourceJudgmentIds.has(judgment.id) ? 0 : 90);

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

type RatioPoint = {
  heading: string;
  body: string;
  attribution?: string;
  fullText: string;
};

const RATIO_HEADING_SEPARATOR = /\s+(?:-|\u2014|\u2013|\u00e2\u20ac\u201d|\u00e2\u20ac\u201c)\s+/;

const isRatioPointHeading = (block: string) => {
  const clean = block.trim();
  if (
    !clean ||
    /^Per\b/i.test(clean) ||
    clean.startsWith('"') ||
    clean.startsWith('\u201c') ||
    clean.startsWith('\u00e2\u20ac\u0153')
  ) return false;
  const parts = clean.split(RATIO_HEADING_SEPARATOR).map((part) => part.trim()).filter(Boolean);
  return parts.length >= 3 && /^[A-Z0-9]/.test(parts[0]);
};

const stripSourceParagraphLead = (line: string) => line.replace(/^([A-G])\s+/, '').trim();

const getSourceRatioBlocks = (judgment: CaseLaw) => {
  const text = normalizeSourceJudgmentMarkers(
    (judgment.fullJudgmentText ?? '').replace(/\r\n/g, '\n'),
  );
  if (!text.trim()) return [];

  const lines = text.split('\n');
  const headingIndex = lines.findIndex((line) => /^RATIO DECIDENDI$/i.test(line.trim()));
  if (headingIndex === -1) return [];

  const captured: string[] = [];

  for (let index = headingIndex + 1; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    const withoutSourceLabel = stripSourceParagraphLead(trimmed);

    if (trimmed && captured.some((line) => line.trim()) && isLeadingJudgmentStart(withoutSourceLabel)) break;
    captured.push(lines[index]);
  }

  return splitExactSectionBlocks(captured.join('\n'));
};

const ratioPointFromText = (text: string): RatioPoint => {
  const clean = text.trim();
  const headingMatch = clean.match(/^([\s\S]{16,260}?(?:-|\u2014|\u2013|\u00e2\u20ac\u201d|\u00e2\u20ac\u201c)\s+(?:Whether|Ingredients)[\s\S]*?)(?=\n+["\u201c\u00e2\u20ac\u0153])/i);
  const heading = headingMatch?.[1]?.replace(/\s+/g, ' ').trim() || clean.replace(/\s+/g, ' ').slice(0, 180);
  const body = headingMatch ? clean.slice(headingMatch[0].length).trim() : clean;

  return {
    heading,
    body,
    fullText: clean,
  };
};

const getSourceRatioPoints = (judgment: CaseLaw): RatioPoint[] => {
  const blocks = getSourceRatioBlocks(judgment);
  const points: RatioPoint[] = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const heading = blocks[index].replace(/\s+/g, ' ').trim();
    if (!isRatioPointHeading(heading)) continue;

    const bodyParts: string[] = [];
    let attribution: string | undefined;
    let cursor = index + 1;

    while (cursor < blocks.length && !isRatioPointHeading(blocks[cursor])) {
      const block = blocks[cursor].trim();
      if (/^Per\b/i.test(block)) {
        attribution = block.replace(/\s+/g, ' ').trim();
      } else if (block) {
        bodyParts.push(block);
      }
      cursor += 1;
    }

    const body = bodyParts.join('\n\n').trim();
    const fullText = [heading, body, attribution].filter(Boolean).join('\n\n');
    points.push({ heading, body, attribution, fullText });
    index = cursor - 1;
  }

  return points;
};

const getExactRatioPoints = (judgment: CaseLaw): RatioPoint[] => {
  const sourcePoints = getSourceRatioPoints(judgment);
  if (sourcePoints.length) return sourcePoints;

  return getExactRatioItems(judgment).map(ratioPointFromText);
};

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

type ReportCitationTarget = {
  pageNumber: number;
  label?: string;
  text: string;
};

type ReportCitationSpan = {
  start: ReportCitationTarget;
  end: ReportCitationTarget;
};

type ReportParagraph = {
  label: string;
  text: string;
};

const PAGE_CITATION_PATTERN = /\((?:Pp?\.|Pages?)\s*[^)]*?paras?\.?\s*[^)]*?\)/gi;

const normalizeCitationText = (text: string) =>
  text
    .replace(PAGE_CITATION_PATTERN, '')
    .replace(/[“”"]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const normalizeCitationLookupText = (text: string) =>
  text
    .replace(PAGE_CITATION_PATTERN, '')
    .replace(/[â€œâ€“”"']/g, '')
    .replace(/^\s*(?:\.{3}|…)\s*/, '')
    .replace(/[^a-z0-9]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const excerptNeedle = (text: string, start: number, length = 140) =>
  text
    .slice(start, start + length)
    .replace(start > 0 ? /^\S*\s+/ : /^/, '')
    .replace(/\s+\S*$/, '')
    .trim();

const relevantLookupNeedles = (text: string) => {
  const normalized = normalizeCitationLookupText(text);
  if (!normalized) return [];
  if (normalized.length <= 140) return [normalized];

  return [
    excerptNeedle(normalized, 0),
    excerptNeedle(normalized, Math.max(0, normalized.length - 170)),
    excerptNeedle(normalized, Math.max(0, Math.floor(normalized.length / 2) - 70)),
  ].filter((needle, index, needles) => needle.length > 32 && needles.indexOf(needle) === index);
};

const paragraphCitationText = (start?: string, end?: string) => {
  if (!start) return '';
  if (!end || start === end) return `para. ${start}`;
  return `paras. ${start}-${end}`;
};

const reportCitationText = ({ start, end }: ReportCitationSpan) => {
  const samePage = start.pageNumber === end.pageNumber;
  const paragraphText = paragraphCitationText(start.label, end.label);

  if (samePage) {
    return paragraphText ? `(P. ${start.pageNumber}, ${paragraphText})` : `(P. ${start.pageNumber})`;
  }

  return paragraphText
    ? `(Pp. ${start.pageNumber}-${end.pageNumber}, ${paragraphText})`
    : `(Pp. ${start.pageNumber}-${end.pageNumber})`;
};

const normalizeRawReportCitationGrammar = (text: string) =>
  text.replace(
    /\((Pp?\.\s*[^)]*?),\s*paras?\.?\s*([A-G])\s*-\s*\2\)/gi,
    '($1, para. $2)',
  );

const manualRatioCitation = (judgment: CaseLaw, point: RatioPoint) => {
  const headingParts = point.heading.split(RATIO_HEADING_SEPARATOR).map((part) => part.trim());

  if (
    judgment.id === 'case-001' &&
    /^EVIDENCE$/i.test(headingParts[0] ?? '') &&
    /^WRONGFUL ADMISSION\/REJECTION OF EVIDENCE$/i.test(headingParts[1] ?? '') &&
    /^Whether a wrongfully admitted\/excluded evidence could constitute a ground/i.test(
      headingParts[2] ?? '',
    )
  ) {
    return '(P. 10, para. F)';
  }

  if (
    judgment.id === 'case-001' &&
    /^EVIDENCE$/i.test(headingParts[0] ?? '') &&
    /^PROOF OF TITLE TO LAND$/i.test(headingParts[1] ?? '') &&
    /^Ways of proving title\/ownership of land/i.test(headingParts[2] ?? '')
  ) {
    return '(Pp. 11-12, paras. A-A)';
  }

  if (
    judgment.id === 'case-002' &&
    /^APPEAL$/i.test(headingParts[0] ?? '') &&
    /^INTERFERENCE WITH FINDING\(S\) OF FACT\(S\)$/i.test(headingParts[1] ?? '') &&
    /^Attitude of appellate Courts to findings of fact made by a trial Court/i.test(
      headingParts[2] ?? '',
    )
  ) {
    return '(Pp. 8-9, paras. F-A)';
  }

  if (judgment.id === 'case-003') {
    if (
      /^EVIDENCE\s+-\s+BURDEN OF PROOF\/ONUS OF PROOF\s+-\s+Whether a plaintiff can rely on the weakness/i.test(
        point.heading,
      )
    ) {
      return '(P. 7, paras. C-D)';
    }

    if (
      /^EVIDENCE\s+-\s+PROOF OF TITLE TO LAND\s+-\s+Ways by which ownership\/title to land may be proved/i.test(
        point.heading,
      )
    ) {
      return '(P. 7, paras. D-E)';
    }

    if (
      /^EVIDENCE\s+-\s+STANDARD OF PROOF\s+-\s+When is the burden of proof on a plaintiff/i.test(
        point.heading,
      )
    ) {
      return '(P. 8, para. C)';
    }

    if (
      /^EVIDENCE\s+-\s+STANDARD OF PROOF\s+-\s+Standard of proof in civil cases/i.test(
        point.heading,
      )
    ) {
      return '(P. 8, paras. C-D)';
    }

    if (
      /^EVIDENCE\s+-\s+PROOF OF TITLE TO LAND\s+-\s+Whether a mere production of a deed of grant/i.test(
        point.heading,
      )
    ) {
      return '(P. 9, paras. B-C)';
    }
  }

  if (judgment.id === 'case-004') {
    if (
      /^CRIMINAL LAW AND PROCEDURE\s+-\s+DEFENCE OF ACCIDENT\s+-\s+The test for the defence of accident/i.test(
        point.heading,
      )
    ) {
      return '(P. 7, paras. A-B)';
    }

    if (
      /^CRIMINAL LAW AND PROCEDURE\s+-\s+DEFENCE OF ACCIDENT\s+-\s+What constitutes an event which occurs by accident/i.test(
        point.heading,
      )
    ) {
      return '(P. 7, paras. B-C)';
    }

    if (
      /^CRIMINAL LAW AND PROCEDURE\s+-\s+OFFENCE OF MURDER\s+-\s+Essential ingredients that must be proved/i.test(
        point.heading,
      )
    ) {
      return '(Pp. 7-8, paras. B-A)';
    }

    if (
      /^CRIMINAL LAW AND PROCEDURE\s+-\s+OFFENCE OF MURDER\s+-\s+The nature of evidence which can establish\/prove a charge of murder/i.test(
        point.heading,
      )
    ) {
      return '(P. 8, para. A)';
    }

    if (
      /^EVIDENCE\s+-\s+BURDEN OF PROOF\/ONUS OF PROOF\s+-\s+Whether the onus of proof on the prosecution does shift/i.test(
        point.heading,
      )
    ) {
      return '(P. 8, para. B)';
    }

    if (
      /^EVIDENCE\s+-\s+CIRCUMSTANTIAL EVIDENCE\s+-\s+Conditions that must be met/i.test(point.heading)
    ) {
      return '(P. 8, paras. B-C)';
    }

    if (
      /^EVIDENCE\s+-\s+CAUSE OF DEATH\s+-\s+Circumstances where medical evidence would be dispensed/i.test(
        point.heading,
      )
    ) {
      return '(P. 8, paras. E-F)';
    }

    if (
      /^APPEAL\s+-\s+INTERFERENCE WITH CONCURRENT FINDING\(S\) OF FACT\(S\)\s+-\s+Attitude of the appellate Court/i.test(
        point.heading,
      )
    ) {
      return '(Pp. 8-9, paras. C-B)';
    }

    if (
      /^EVIDENCE\s+-\s+CAUSE OF DEATH\s+-\s+Effect of failure of the prosecution to establish the cause of death/i.test(
        point.heading,
      )
    ) {
      return '(P. 10, paras. B-C)';
    }

    if (
      /^LEGAL PRACTITIONER\s+-\s+DUTY OF COUNSEL\s+-\s+Duty of Counsel to promptly take objection/i.test(
        point.heading,
      )
    ) {
      return '(P. 10, paras. G-A)';
    }

    if (
      /^CONSTITUTIONAL LAW\s+-\s+RIGHT TO SILENCE\s+-\s+What the constitutional right to silence/i.test(
        point.heading,
      )
    ) {
      return '(P. 11, paras. E-F)';
    }

    if (
      /^EVIDENCE\s+-\s+PROOF BEYOND REASONABLE DOUBT\s+-\s+Position of the law where an accused person asserts/i.test(
        point.heading,
      )
    ) {
      return '(P. 11, paras. G-A)';
    }

    if (
      /^CRIMINAL LAW AND PROCEDURE\s+-\s+ACCUSED PERSON RESTING HIS CASE ON THE PROSECUTIONS CASE\s+-\s+Whether an accused person/i.test(
        point.heading,
      )
    ) {
      return '(P. 11, para. A)';
    }

    if (
      /^CRIMINAL LAW AND PROCEDURE\s+-\s+DEFENCE OF ACCIDENT\s+-\s+Whether an accused person can raise a defence of accident/i.test(
        point.heading,
      )
    ) {
      return '(P. 12, paras. F-A)';
    }
  }

  if (
    judgment.id === 'case-005' &&
    /^EVIDENCE$/i.test(headingParts[0] ?? '') &&
    /^CREDIBILITY OF WITNESS$/i.test(headingParts[1] ?? '') &&
    /^Whether the assessment of credibility of witnesses/i.test(headingParts[2] ?? '')
  ) {
    return '(P. 5, para. B)';
  }

  if (
    judgment.id === 'case-005' &&
    /^CRIMINAL LAW AND PROCEDURE$/i.test(headingParts[0] ?? '') &&
    /^OFFENCE OF CULPABLE HOMICIDE PUNISHABLE WITH DEATH$/i.test(headingParts[1] ?? '') &&
    /^Ingredients that must be proved/i.test(headingParts[2] ?? '')
  ) {
    return '(P. 5, para. C-D)';
  }

  if (
    judgment.id === 'case-005' &&
    /^CRIMINAL LAW AND PROCEDURE$/i.test(headingParts[0] ?? '') &&
    /^CONVICTION FOR LESSER OFFENCE$/i.test(headingParts[1] ?? '') &&
    /^Whether a court can convict an accused person of a lesser offence/i.test(headingParts[2] ?? '')
  ) {
    return '(P. 7, paras. A-C)';
  }

  if (
    judgment.id === 'case-005' &&
    /^CRIMINAL LAW AND PROCEDURE$/i.test(headingParts[0] ?? '') &&
    /^OFFENCE OF CULPABLE HOMICIDE PUNISHABLE WITH DEATH$/i.test(headingParts[1] ?? '') &&
    /^Ingredients that must co-exist before conviction/i.test(headingParts[2] ?? '')
  ) {
    return '(P. 7, paras. E-F)';
  }

  if (judgment.id === 'case-006') {
    if (
      /^PRACTICE AND PROCEDURE\s+-\s+ISSUE OF JURISDICTION\s+-\s+Importance of resolving the issue of jurisdiction once it is raised/i.test(
        point.heading,
      )
    ) {
      return '(P. 17, paras. D-G)';
    }

    if (
      /^CRIMINAL LAW AND PROCEDURE\s+-\s+POWER OF THE ATTORNEY-GENERAL\s+-\s+Whether the Attorney General of a state has power to prosecute offences under a federal law/i.test(
        point.heading,
      )
    ) {
      return '(P. 18, paras. A-G)';
    }

    if (
      /^CRIMINAL LAW AND PROCEDURE\s+-\s+LEAVE TO PREFER A CHARGE\s+-\s+What a Judge should consider in exercising power to grant leave/i.test(
        point.heading,
      )
    ) {
      return '(Pp. 19-21, paras. A-D)';
    }

    if (
      /^EVIDENCE\s+-\s+EVIDENCE IN PREVIOUS PROCEEDINGS\s+-\s+Conditions for the admissibility of evidence given in previous proceedings/i.test(
        point.heading,
      )
    ) {
      return '(Pp. 21-22, paras. E-C)';
    }

    if (
      /^EVIDENCE\s+-\s+DOCUMENTARY EVIDENCE\s+-\s+Effect of the failure of a party to object to the reception of a document/i.test(
        point.heading,
      )
    ) {
      return '(P. 22, paras. C-G)';
    }

    if (
      /^EVIDENCE\s+-\s+CONTRADICTION IN EVIDENCE\s+-\s+Position of the law as regards contradictions in evidence/i.test(
        point.heading,
      )
    ) {
      return '(P. 23, paras. A-E)';
    }

    if (
      /^EVIDENCE\s+-\s+CONFESSIONAL STATEMENT\s+-\s+Meaning of confession\/confessional statement/i.test(
        point.heading,
      )
    ) {
      return '(Pp. 23-24, paras. E-C)';
    }

    if (
      /^CONSTITUTIONAL LAW\s+-\s+RIGHT TO FAIR HEARING\s+-\s+Principles of fair hearing/i.test(
        point.heading,
      )
    ) {
      return '(Pp. 24-25, paras. C-D)';
    }

    if (
      /^CONSTITUTIONAL LAW\s+-\s+RIGHT TO FAIR HEARING\s+-\s+Whether a party who had an opportunity of being heard/i.test(
        point.heading,
      )
    ) {
      return '(Pp. 25-26, paras. E-E)';
    }

    if (
      /^CONSTITUTIONAL LAW\s+-\s+RIGHT TO FAIR HEARING\s+-\s+Whether exercise of right to fair hearing must be within a reasonable time/i.test(
        point.heading,
      )
    ) {
      return '(Pp. 26-27, paras. E-C)';
    }

    if (
      /^CRIMINAL LAW AND PROCEDURE\s+-\s+SENTENCING\s+-\s+Whether the Court has discretion to determine the sentence/i.test(
        point.heading,
      )
    ) {
      return '(Pp. 27-28, paras. C-D)';
    }
  }

  if (judgment.id === 'case-007') {
    if (
      /^EVIDENCE\s+-\s+CALLING OF EVIDENCE\s+-\s+Whether in a criminal trial, a host of witnesses is required/i.test(
        point.heading,
      )
    ) {
      return '(P. 9, para. A)';
    }

    if (
      /^EVIDENCE\s+-\s+EVALUATION OF EVIDENCE\s+-\s+Duty of the trial Court as regards perception, evaluation and findings of fact/i.test(
        point.heading,
      )
    ) {
      return '(P. 9, para. B)';
    }
  }

  return undefined;
};

const LEADING_JUDGMENT_TEXT = new RegExp(String.raw`^${JUDGE_JUDGMENT_HEADING}\s*`, 'i');

const extractLeadingJudgmentHeading = (text: string) => text.match(LEADING_JUDGMENT_TEXT)?.[0]?.trim();

const stripLeadingJudgmentHeading = (text: string) => text.replace(LEADING_JUDGMENT_TEXT, '').trim();

const normalizeReportParagraphText = (text: string) =>
  isLeadingJudgmentStart(text) ? stripLeadingJudgmentHeading(text) : text;

const splitIntoSentences = (text: string) => {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return [];

  return normalized.match(/[^.!?]+(?:[.!?]+["')\]]*|$)/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [
    normalized,
  ];
};

const splitLongReportText = (text: string, targetCharacters: number) => {
  const words = text.split(' ').filter(Boolean);
  const chunks: string[] = [];
  let current = '';

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (current && next.length > targetCharacters) {
      chunks.push(current);
      current = word;
      return;
    }

    current = next;
  });

  if (current) chunks.push(current);
  return chunks;
};

const splitIntoReportParagraphs = (text: string, targetCharacters = 640): ReportParagraph[] => {
  const sentences = splitIntoSentences(text);
  const paragraphs: ReportParagraph[] = [];
  let current = '';

  sentences.forEach((sentence) => {
    if (sentence.length > targetCharacters * 1.65) {
      if (current) {
        paragraphs.push({
          label: paragraphLabel(paragraphs.length),
          text: current,
        });
        current = '';
      }

      splitLongReportText(sentence, targetCharacters).forEach((chunk) => {
        paragraphs.push({
          label: paragraphLabel(paragraphs.length),
          text: chunk,
        });
      });
      return;
    }

    const next = current ? `${current} ${sentence}` : sentence;
    if (current && next.length > targetCharacters) {
      paragraphs.push({
        label: paragraphLabel(paragraphs.length),
        text: current,
      });
      current = sentence;
      return;
    }

    current = next;
  });

  if (current) {
    paragraphs.push({
      label: paragraphLabel(paragraphs.length),
      text: current,
    });
  }

  return paragraphs;
};

const reportParagraphsFromSourceBlocks = (blocks: SourceJudgmentBlock[]) =>
  splitIntoReportParagraphs(
    blocks
      .filter((block) => !block.isHeading)
      .map((block) => normalizeReportParagraphText(block.sourceText ?? block.text))
      .filter(Boolean)
      .join(' '),
  );

const leadingJudgmentHeadingFromBlocks = (blocks: SourceJudgmentBlock[]) =>
  blocks
    .map((block) => extractLeadingJudgmentHeading(block.sourceText ?? block.text))
    .find(Boolean);

const leadingJudgmentHeadingFromStructuredPage = (
  paragraphs: string[],
  hasSourceLabels: boolean,
) =>
  paragraphs
    .map((paragraph) => {
      const sourceParagraph = parseSourceParagraph(paragraph);
      return extractLeadingJudgmentHeading(hasSourceLabels ? sourceParagraph.text : paragraph);
    })
    .find(Boolean);

const reportParagraphsFromStructuredPage = (
  paragraphs: string[],
  hasSourceLabels: boolean,
) =>
  splitIntoReportParagraphs(
    paragraphs
      .map((paragraph) => {
        const sourceParagraph = parseSourceParagraph(paragraph);
        return normalizeReportParagraphText(hasSourceLabels ? sourceParagraph.text : paragraph);
      })
      .filter(Boolean)
      .join(' '),
  );

const citationTargetsFromLabelledSegments = (
  pageNumber: number,
  entries: Array<{ label?: string; text: string; isHeading?: boolean }>,
) => {
  const targets: ReportCitationTarget[] = [];
  let current: ReportCitationTarget | undefined;

  entries.forEach((entry) => {
    const text = entry.text.trim();
    if (!text || entry.isHeading) return;

    if (entry.label) {
      current = {
        pageNumber,
        label: entry.label.toUpperCase(),
        text,
      };
      targets.push(current);
      return;
    }

    if (current) {
      current.text = `${current.text} ${text}`;
    }
  });

  return targets;
};

const citationTargetsFromReportParagraphs = (pageNumber: number, paragraphs: ReportParagraph[]) =>
  paragraphs.map((paragraph) => ({
    pageNumber,
    label: paragraph.label,
    text: paragraph.text,
  }));

const sourceLeadingJudgmentPageIndex = (pages: { blocks: SourceJudgmentBlock[] }[]) => {
  const index = pages.findIndex((page) => page.blocks.some((block) => block.startsLeadingJudgment));
  return index > -1 ? index : Number.POSITIVE_INFINITY;
};

const structuredLeadingJudgmentPageIndex = (
  pages: NonNullable<CaseLaw['judgmentPages']>,
) => {
  const index = pages.findIndex((page) =>
    page.paragraphs.some((paragraph) => isLeadingJudgmentStart(parseSourceParagraph(paragraph).text ?? paragraph)),
  );
  return index > -1 ? index : Number.POSITIVE_INFINITY;
};

const currentReportCitationTargets = (judgment: CaseLaw): ReportCitationTarget[] => {
  if (judgment.verbatimWholeCase || judgment.preserveSourceFormatting) {
    const bodyText = getSourceCaseBodyText(judgment.fullJudgmentText ?? '');
    const sourcePages = paginateJudgmentSourceText(judgment, bodyText);
    const leadPageIndex = sourceLeadingJudgmentPageIndex(sourcePages);

    return sourcePages.flatMap((page, pageIndex) => {
      const pageNumber = pageIndex + 2;
      const isLeadPage = pageIndex >= leadPageIndex;

      if (!isLeadPage) return [];

      const labelledTargets = citationTargetsFromLabelledSegments(
        pageNumber,
        page.blocks.map((block) => ({
          label: block.sourceLabel,
          text: normalizeReportParagraphText(block.sourceText ?? block.text),
          isHeading: block.isHeading,
        })),
      );

      if (labelledTargets.length) return labelledTargets;

      return citationTargetsFromReportParagraphs(pageNumber, reportParagraphsFromSourceBlocks(page.blocks));
    });
  }

  const pages = getJudgmentBodyPages(judgment);
  const hasSourceLabels = usesSourceParagraphLabels(pages);
  const leadPageIndex = structuredLeadingJudgmentPageIndex(pages);

  return pages.flatMap((page, pageIndex) => {
    const pageNumber = pageIndex + 2;
    const isLeadPage = pageIndex >= leadPageIndex;

    if (!isLeadPage) return [];

    if (hasSourceLabels) {
      const labelledTargets = citationTargetsFromLabelledSegments(
        pageNumber,
        page.paragraphs.map((paragraph) => {
          const sourceParagraph = parseSourceParagraph(paragraph);

          return {
            label: sourceParagraph.label,
            text: normalizeReportParagraphText(sourceParagraph.text),
          };
        }),
      );

      if (labelledTargets.length) return labelledTargets;
    }

    return citationTargetsFromReportParagraphs(
      pageNumber,
      reportParagraphsFromStructuredPage(page.paragraphs, hasSourceLabels),
    );
  });
};

const pageBandCitationTargets = (pageNumber: number, text: string): ReportCitationTarget[] => {
  const words = normalizeCitationLookupText(text).split(' ').filter(Boolean);
  if (!words.length) return [];

  return PARAGRAPH_LABELS.map((label, index) => {
    const start = Math.floor((index / PARAGRAPH_LABELS.length) * words.length);
    const end = index === PARAGRAPH_LABELS.length - 1
      ? words.length
      : Math.floor(((index + 1) / PARAGRAPH_LABELS.length) * words.length);

    return {
      pageNumber,
      label,
      text: words.slice(start, Math.max(end, start + 1)).join(' '),
    };
  }).filter((target) => target.text);
};

const targetForNormalizedOffset = (
  ranges: Array<{ start: number; end: number; target: ReportCitationTarget }>,
  offset: number,
) => {
  const containingTarget = ranges.find((range) => offset >= range.start && offset < range.end);
  if (containingTarget) return containingTarget.target;

  return ranges.find((range) => offset < range.end)?.target ?? ranges[ranges.length - 1]?.target;
};

const findCurrentReportCitation = (judgment: CaseLaw, sourceText: string): ReportCitationSpan | undefined => {
  const needles = relevantLookupNeedles(sourceText);
  const startNeedle = needles[0];
  const endNeedle = needles[1] ?? startNeedle;
  if (!startNeedle) return undefined;

  const targets = currentReportCitationTargets(judgment);
  let flatText = '';
  const ranges: Array<{ start: number; end: number; target: ReportCitationTarget }> = [];

  targets.forEach((target) => {
    const normalized = normalizeCitationLookupText(target.text);
    if (!normalized) return;

    if (flatText) flatText += ' ';
    const start = flatText.length;
    flatText += normalized;
    ranges.push({ start, end: flatText.length, target });
  });

  const startOffset = flatText.indexOf(startNeedle);
  if (startOffset > -1) {
    const endOffset = flatText.indexOf(endNeedle, startOffset);
    const start = targetForNormalizedOffset(ranges, startOffset);
    const end = targetForNormalizedOffset(
      ranges,
      endOffset > -1 ? endOffset + endNeedle.length - 1 : startOffset + startNeedle.length - 1,
    );

    if (start && end) return { start, end };
  }

  const fallbackNeedle = needles.find((needle) => flatText.includes(needle));
  if (!fallbackNeedle) return undefined;

  const fallbackOffset = flatText.indexOf(fallbackNeedle);
  const fallbackTarget = targetForNormalizedOffset(ranges, fallbackOffset);
  return fallbackTarget ? { start: fallbackTarget, end: fallbackTarget } : undefined;
};

const withCurrentReportCitations = (judgment: CaseLaw, items: string[]) => {
  let previousQuote = '';
  let activeRatioHeading = '';
  let activeRatioBody = '';

  return items.map((item) => {
    const clean = item.trim();
    if (isRatioPointHeading(clean)) {
      activeRatioHeading = clean;
      activeRatioBody = '';
      previousQuote = '';
      return item;
    }

    PAGE_CITATION_PATTERN.lastIndex = 0;
    const hasCitation = PAGE_CITATION_PATTERN.test(item);
    PAGE_CITATION_PATTERN.lastIndex = 0;

    if (!hasCitation) {
      if (activeRatioHeading && clean) activeRatioBody = activeRatioBody ? `${activeRatioBody}\n\n${item}` : item;
      if (normalizeCitationText(item).length > 24) previousQuote = item;
      return item;
    }

    if (activeRatioHeading && /^Per\b/i.test(clean)) {
      const ratioPoint = withCurrentRatioCitation(judgment, {
        heading: activeRatioHeading,
        body: activeRatioBody,
        attribution: item,
        fullText: [activeRatioHeading, activeRatioBody, item].filter(Boolean).join('\n\n'),
      });

      return ratioPoint.attribution ?? item;
    }

    const target = findCurrentReportCitation(judgment, item) ?? findCurrentReportCitation(judgment, previousQuote);
    if (!target) return normalizeRawReportCitationGrammar(item);

    return item.replace(PAGE_CITATION_PATTERN, reportCitationText(target));
  });
};

const withCurrentSourcePageCitations = (
  judgment: CaseLaw,
  pages: { blocks: SourceJudgmentBlock[] }[],
) => {
  const correctedTexts = withCurrentReportCitations(
    judgment,
    pages.flatMap((page) => page.blocks.map((block) => block.text)),
  );
  let cursor = 0;

  return pages.map((page) => ({
    ...page,
    blocks: page.blocks.map((block) => ({
      ...block,
      text: correctedTexts[cursor++] ?? block.text,
    })),
  }));
};

const withCurrentRatioCitation = (judgment: CaseLaw, point: RatioPoint): RatioPoint => {
  const manualCitation = manualRatioCitation(judgment, point);
  const target =
    findCurrentReportCitation(judgment, point.body || point.fullText) ??
    findCurrentReportCitation(judgment, point.fullText);
  if (!manualCitation && !target) {
    const attribution = normalizeRawReportCitationGrammar(point.attribution ?? '');

    return {
      ...point,
      attribution,
      fullText: [point.heading, point.body, attribution].filter(Boolean).join('\n\n'),
    };
  }

  const currentCitation = manualCitation ?? (target ? reportCitationText(target) : undefined);
  const replaceCitation = (text?: string) => {
    if (!text) return text;
    PAGE_CITATION_PATTERN.lastIndex = 0;
    return PAGE_CITATION_PATTERN.test(text)
      ? text.replace(PAGE_CITATION_PATTERN, currentCitation)
      : `${text} ${currentCitation}`;
  };

  const attribution = replaceCitation(point.attribution);
  const fullText = [point.heading, point.body, attribution].filter(Boolean).join('\n\n');

  return {
    ...point,
    attribution,
    fullText,
  };
};

const WholeCasePanel: React.FC<{
  judgment: CaseLaw;
  status?: 'idle' | 'loading' | 'ready' | 'error';
}> = ({ judgment, status = 'ready' }) => {
  const citation = `${judgment.title} ${judgment.citation}`;
  const judgmentText = getJudgmentTextForCopy(judgment);
  const isLoading = status === 'idle' || status === 'loading';
  const bodyPages = getJudgmentBodyPages(judgment);
  const hasSourceLabels = usesSourceParagraphLabels(bodyPages);
  const sourceCaseBodyText = getSourceCaseBodyText(judgment.fullJudgmentText ?? '');
  const sourcePages =
    (judgment.verbatimWholeCase || judgment.preserveSourceFormatting) && judgment.fullJudgmentText
      ? paginateJudgmentSourceText(judgment, sourceCaseBodyText)
      : [];
  const sourcePagesWithCurrentCitations = withCurrentSourcePageCitations(judgment, sourcePages);
  const sourceLeadPageIndex = sourceLeadingJudgmentPageIndex(sourcePages);
  const bodyLeadPageIndex = structuredLeadingJudgmentPageIndex(bodyPages);
  const totalPages = sourcePages.length
    ? sourcePages.length + 1
    : bodyPages.length
      ? bodyPages.length + 1
      : judgment.fullJudgmentText
        ? 2
        : 1;
  const [activeReportPage, setActiveReportPage] = useState(1);

  useEffect(() => {
    setActiveReportPage(1);
  }, [judgment.id, totalPages]);

  useEffect(() => {
    if (isLoading || status === 'error') return undefined;

    const container = document.querySelector<HTMLElement>(`[data-case-report-id="${judgment.id}"]`);
    if (!container) return undefined;

    const pages = Array.from(container.querySelectorAll<HTMLElement>('[data-report-page-number]'));
    if (!pages.length) return undefined;

    const updateActivePage = () => {
      const tracker = container.querySelector<HTMLElement>('[data-report-page-tracker]');
      const trackerBottom = tracker?.getBoundingClientRect().bottom ?? 0;
      const viewportBottom = window.innerHeight;
      const visiblePage = pages.reduce(
        (best, page) => {
          const box = page.getBoundingClientRect();
          const visibleHeight = Math.max(0, Math.min(box.bottom, viewportBottom) - Math.max(box.top, trackerBottom));
          const distanceFromTracker = Math.abs(box.top - trackerBottom);

          if (visibleHeight > best.visibleHeight) return { visibleHeight, distanceFromTracker, page };
          if (visibleHeight === best.visibleHeight && distanceFromTracker < best.distanceFromTracker) {
            return { visibleHeight, distanceFromTracker, page };
          }

          return best;
        },
        { visibleHeight: -1, distanceFromTracker: Number.POSITIVE_INFINITY, page: pages[0] },
      ).page;

      const pageNumber = Number(visiblePage.dataset.reportPageNumber);
      if (Number.isFinite(pageNumber)) setActiveReportPage(pageNumber);
    };

    updateActivePage();
    window.addEventListener('scroll', updateActivePage, { passive: true });
    window.addEventListener('resize', updateActivePage);

    return () => {
      window.removeEventListener('scroll', updateActivePage);
      window.removeEventListener('resize', updateActivePage);
    };
  }, [isLoading, judgment.id, status, totalPages]);

  return (
    <div className="space-y-5">
      <div className="border-b border-amber-100 pb-4">
        <h2 className="text-lg font-black tracking-tight text-neutral-950 sm:text-xl">The whole case</h2>
        <p className="mt-1.5 max-w-3xl text-[12px] leading-5 text-neutral-600 sm:text-sm sm:leading-6">
          The judgment as delivered, paragraphed and page-numbered where the report provides it.
        </p>
      </div>

        {isLoading ? (
          <div className="rounded-2xl border border-amber-200 bg-white p-6 text-base font-semibold text-neutral-700">
            Loading the full judgment...
          </div>
        ) : status === 'error' ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-base font-semibold text-red-800">
            The full judgment could not be loaded. Please refresh and try again.
          </div>
        ) : (judgment.verbatimWholeCase || judgment.preserveSourceFormatting) && judgment.fullJudgmentText ? (
          <div className="overflow-visible bg-white" data-case-report-id={judgment.id}>
            <ReportPageTracker judgment={judgment} pageNumber={activeReportPage} totalPages={totalPages} />
            <CaseOpeningPage judgment={judgment} />
            {sourcePagesWithCurrentCitations.map((page, pageIndex) => {
              const shouldReparagraph = pageIndex >= sourceLeadPageIndex;

              return (
                <CaseReportPage
                  key={`source-page-${pageIndex + 2}`}
                  judgment={judgment}
                  pageNumber={pageIndex + 2}
                  showMarkers={shouldReparagraph}
                >
                  <SourceJudgmentText
                    judgment={judgment}
                    blocks={page.blocks}
                    reparagraph={shouldReparagraph}
                  />
                </CaseReportPage>
              );
            })}
          </div>
        ) : bodyPages.length ? (
          <div className="overflow-visible bg-white" data-case-report-id={judgment.id}>
            <ReportPageTracker judgment={judgment} pageNumber={activeReportPage} totalPages={totalPages} />
            <CaseOpeningPage judgment={judgment} />
            {bodyPages.map((page, pageIndex) => {
              const shouldReparagraph = pageIndex >= bodyLeadPageIndex;
              const displayParagraphs = shouldReparagraph
                ? page.paragraphs
                : withCurrentReportCitations(judgment, page.paragraphs);

              return (
                <CaseReportPage
                  key={page.page}
                  judgment={judgment}
                  pageNumber={pageIndex + 2}
                  showMarkers={shouldReparagraph}
                >
                  <div
                    className={
                      shouldReparagraph
                        ? 'mx-auto w-full max-w-[76rem] space-y-3 font-[Georgia,ui-serif,serif] text-base leading-8 text-neutral-900 sm:text-lg sm:leading-9'
                        : 'mx-auto w-full max-w-[76rem] space-y-4 font-[Georgia,ui-serif,serif] text-[15px] leading-8 text-neutral-900 sm:text-[17px] sm:leading-9'
                    }
                  >
                    {shouldReparagraph ? (
                    <>
                      {leadingJudgmentHeadingFromStructuredPage(displayParagraphs, hasSourceLabels) && (
                        <p className="font-[Georgia,ui-serif,serif] text-base font-bold leading-8 text-neutral-950 sm:text-lg sm:leading-9">
                          {leadingJudgmentHeadingFromStructuredPage(displayParagraphs, hasSourceLabels)}
                        </p>
                      )}
                      {reportParagraphsFromStructuredPage(displayParagraphs, hasSourceLabels).map((paragraph, index) => (
                        <ReportParagraphRow
                          key={`${page.page}-report-${index}`}
                          label={paragraph.label}
                          text={paragraph.text}
                          hideLabel
                        />
                      ))}
                    </>
                    ) : displayParagraphs.map((paragraph, index) => {
                      const sourceParagraph = parseSourceParagraph(paragraph);
                      const label = sourceParagraph.label;
                      const text = hasSourceLabels ? sourceParagraph.text : paragraph;

                      return label && shouldReparagraph ? (
                        <ReportParagraphRow key={`${page.page}-${index}`} label={label} text={text} hideLabel />
                      ) : (
                        <p
                          key={`${page.page}-${index}`}
                          className={
                            shouldReparagraph
                              ? 'pl-[calc(2.25rem+0.625rem)] sm:pl-[calc(3.25rem+1rem)]'
                              : 'whitespace-pre-wrap break-words'
                          }
                        >
                          {text}
                        </p>
                      );
                    })}
                  </div>
                </CaseReportPage>
              );
            })}
          </div>
        ) : (
          <div className="overflow-visible bg-white" data-case-report-id={judgment.id}>
            <ReportPageTracker judgment={judgment} pageNumber={activeReportPage} totalPages={totalPages} />
            <CaseOpeningPage judgment={judgment} />
            {judgment.fullJudgmentText ? (
              <CaseReportPage judgment={judgment} pageNumber={2}>
                <pre className="block w-full max-w-none overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-7 text-neutral-800 sm:text-base sm:leading-8">
                  {judgment.fullJudgmentText}
                </pre>
              </CaseReportPage>
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

    </div>
  );
};

const ReportPageTracker: React.FC<{
  judgment: CaseLaw;
  pageNumber: number;
  totalPages: number;
}> = ({ judgment, pageNumber, totalPages }) => (
  <div
    className="sticky top-16 z-30 border-b-2 border-neutral-300 bg-white/95 px-3 py-2 backdrop-blur sm:px-8"
    data-report-page-tracker
  >
    <div className="grid gap-1 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
      <span className="hidden sm:block" />
      <p className="min-w-0 text-center font-[Georgia,ui-serif,serif] text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-600 sm:truncate sm:text-xs">
        {reportTitle(judgment)}
      </p>
      <p className="shrink-0 text-center font-[Georgia,ui-serif,serif] text-[12px] font-semibold text-neutral-700 sm:text-right sm:text-sm">
        Page{' '}
        <span className="mx-1 inline-flex min-w-7 justify-center rounded-sm border border-neutral-300 bg-white px-1.5 py-0.5 font-sans text-[11px] font-bold leading-none text-neutral-800 sm:text-xs">
          {pageNumber}
        </span>{' '}
        of {totalPages}
      </p>
    </div>
  </div>
);

const CaseReportPage: React.FC<{
  judgment: CaseLaw;
  pageNumber: number;
  showMarkers?: boolean;
  children: React.ReactNode;
}> = ({ pageNumber, showMarkers = false, children }) => (
  <article
    className="lawpex-report-page relative flex min-h-[34rem] w-full flex-col border-b-4 border-amber-400 bg-white p-3.5 last:border-b-0 sm:min-h-[42rem] sm:p-8 lg:px-10 lg:py-8 xl:px-12"
    data-report-page-number={pageNumber}
  >
    {showMarkers && <ReportPageMarkers />}
    <div className={`min-w-0 flex-1 ${showMarkers ? 'pl-8 sm:pl-10 lg:pl-12' : ''}`}>{children}</div>
    <p className="mt-8 text-center font-mono text-base font-bold text-neutral-700 sm:text-lg">
      {pageNumber}
    </p>
  </article>
);

const reportTitle = (judgment: CaseLaw) =>
  `${judgment.title.toUpperCase()} • ${judgment.citation.replace(/\bpt\b/i, 'Pt.')}`;

const ReportPageMarkers: React.FC = () => (
  <div className="pointer-events-none absolute bottom-20 left-3 top-8 block w-7 select-none lg:left-6 lg:top-8">
    {PARAGRAPH_LABELS.map((label, index) => (
      <span
        key={label}
        className="absolute left-0 -translate-y-1 font-sans text-[20px] font-black leading-none text-[#1F4E79] sm:text-[22px]"
        style={{ top: `${(index / PARAGRAPH_LABELS.length) * 100}%` }}
      >
        {label}
      </span>
    ))}
  </div>
);

const ReportParagraphRow: React.FC<{ label: string; text: string; hideLabel?: boolean }> = ({ label, text, hideLabel }) => (
  <p className={hideLabel ? 'w-full min-w-0 whitespace-normal break-normal text-justify' : 'grid w-full grid-cols-[2.35rem_minmax(0,1fr)] gap-2.5 sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:gap-4'}>
    {!hideLabel && (
      <span className="pt-0.5 font-sans text-xl font-black leading-7 text-[#1F4E79] sm:text-2xl sm:leading-8">
        {label}
      </span>
    )}
    <span className="min-w-0 whitespace-normal break-normal">{text}</span>
  </p>
);

const SourceJudgmentText: React.FC<{
  judgment: CaseLaw;
  blocks: SourceJudgmentBlock[];
  reparagraph?: boolean;
}> = ({ judgment, blocks, reparagraph = false }) => {
  const leadingHeading = reparagraph ? leadingJudgmentHeadingFromBlocks(blocks) : undefined;
  const reportParagraphs = reparagraph ? reportParagraphsFromSourceBlocks(blocks) : [];
  const displayBlocks = blocks;

  return (
    <div
      className={
        reparagraph
          ? 'mx-auto w-full max-w-[76rem] space-y-3 font-[Georgia,ui-serif,serif] text-base leading-8 text-neutral-900 sm:text-lg sm:leading-9'
          : 'mx-auto w-full max-w-[76rem] space-y-4 font-[Georgia,ui-serif,serif] text-[15px] leading-8 text-neutral-900 sm:text-[17px] sm:leading-9'
      }
    >
      {reparagraph ? (
        <>
          {leadingHeading && (
            <p className="font-sans text-base font-black uppercase tracking-[0.08em] text-neutral-950 sm:text-lg">
              {leadingHeading}
            </p>
          )}
          {reportParagraphs.map((paragraph, index) => (
            <ReportParagraphRow key={`report-${paragraph.label}-${index}`} label={paragraph.label} text={paragraph.text} hideLabel />
          ))}
        </>
      ) : displayBlocks.map((block, index) => {
        if (block.sourceLabel && reparagraph) {
          return <ReportParagraphRow key={`${block.text.slice(0, 28)}-${index}`} label={block.sourceLabel} text={block.sourceText ?? ''} hideLabel />;
        }

        return (
          <p
            key={`${block.text.slice(0, 28)}-${index}`}
            className={block.isHeading
              ? 'text-center font-sans text-sm font-black uppercase tracking-[0.08em] text-neutral-950 sm:text-base'
              : 'whitespace-pre-wrap break-words'}
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
};

const CaseOpeningPage: React.FC<{ judgment: CaseLaw }> = ({ judgment }) => {
  const parties = getFormalCaseParties(judgment);
  const role = judgeRole(judgment.court);

  return (
    <article
      className="w-full border-b-4 border-amber-400 bg-white px-4 py-7 font-[Georgia,ui-serif,serif] text-neutral-950 sm:px-10 sm:py-10 lg:px-12 xl:px-16"
      data-report-page-number={1}
    >
      <div className="mx-auto w-full max-w-[76rem]">
        <header className="text-center text-sm leading-7 sm:text-[17px] sm:leading-8">
          <img src="/nigeria-coat-of-arms.svg" alt="Nigeria coat of arms" className="mx-auto h-14 w-14 sm:h-16 sm:w-16" />
          <h1 className="mt-4 text-xl font-black uppercase leading-tight tracking-[0.03em] sm:text-3xl">
            {judgment.title}
          </h1>
          <p className="mt-2 text-base font-bold sm:text-xl">{judgment.citation.replace(/\bpt\b/i, 'Pt.')}</p>
          <p className="mt-7 font-black uppercase">{formatCourtHeading(judgment.court)}</p>
          {judgment.judicialDivision && (
            <p className="mt-1 font-semibold">{formatDivision(judgment.judicialDivision)}</p>
          )}
          {judgment.dateDelivered && <p className="mt-5">{judgment.dateDelivered}</p>}
          <p className="mt-3 font-semibold text-red-700">Suit No: {judgment.suitNumber}</p>
          <p className="mt-5 font-semibold uppercase tracking-[0.04em]">Before Their Lordships</p>
        </header>

        <div className="mt-7 space-y-6 text-sm sm:mt-10 sm:space-y-9 sm:text-[17px]">
          {judgment.presidingJudges.map((judge) => (
            <div key={judge} className="grid gap-1.5 rounded-xl border border-amber-100 bg-[#fffdf6] p-3 sm:grid-cols-[1.05fr_0.95fr] sm:gap-16 sm:border-0 sm:bg-transparent sm:p-0">
              <p className="font-black leading-7">{cleanJudgeName(judge)}</p>
              <p className="font-black leading-7">{role}</p>
            </div>
          ))}
        </div>

        <div className="mt-9 space-y-7 text-sm sm:mt-12 sm:space-y-9 sm:text-base">
          <p>BETWEEN</p>

          <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto] sm:gap-16">
            <div className="space-y-1 break-words text-center leading-7 sm:pl-24">
              {parties.appellants.map((party) => (
                <p key={party}>{party}</p>
              ))}
            </div>
            <p className="font-semibold">APPELLANT(S)</p>
          </div>

          <p>And</p>

          <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto] sm:gap-16">
            <div className="space-y-1 break-words text-center leading-7 sm:pl-24">
              {parties.respondents.map((party) => (
                <p key={party}>{party}</p>
              ))}
            </div>
            <p className="font-semibold">RESPONDENT(S)</p>
          </div>
        </div>

        <p className="mt-12 text-center font-mono text-base font-bold text-neutral-700 sm:text-lg">
          1
        </p>
      </div>
    </article>
  );
};

const TabButton: React.FC<{
  active: boolean;
  icon: React.ElementType;
  label: string;
  description?: string;
  onClick: () => void;
}> = ({ active, icon: Icon, label, description, onClick }) => (
  <button
    onClick={onClick}
    className={`flex min-h-14 min-w-[13rem] shrink-0 snap-start items-center gap-3 rounded-xl px-3.5 py-3 text-left transition active:scale-[0.99] sm:min-w-[14rem] lg:w-full lg:min-w-0 ${
      active
        ? 'bg-[#facc15] text-neutral-950 shadow-[0_12px_30px_-20px_rgba(180,126,18,0.9)]'
        : 'border border-amber-200 bg-white text-neutral-700 hover:border-amber-400 hover:bg-amber-50'
    }`}
  >
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
        active ? 'bg-white/55 text-neutral-950' : 'bg-amber-50 text-amber-700'
      }`}
    >
      <Icon className="h-4 w-4" />
    </span>
    <span className="min-w-0">
      <span className="block truncate text-xs font-black leading-5 sm:text-[13px]">{label}</span>
      {description && (
        <span className={`block truncate text-[10px] font-bold leading-4 ${active ? 'text-neutral-800' : 'text-neutral-500'}`}>
          {description}
        </span>
      )}
    </span>
  </button>
);

const MetaCard: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="min-h-0 rounded-lg border border-amber-100 bg-[#fffdf6] px-3 py-2.5">
    <div className="flex min-w-0 flex-col gap-1 text-yellow-700 lg:flex-row lg:items-center lg:gap-2">
      <span className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      </span>
      <span className="min-w-0 break-words text-xs font-semibold leading-snug text-neutral-950 lg:truncate">{value}</span>
    </div>
  </div>
);

const MiniHeading: React.FC<{ icon: React.ElementType; label: string }> = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 text-amber-700">
    <Icon className="h-[18px] w-[18px]" />
    <span className="text-xs font-black uppercase tracking-[0.14em]">{label}</span>
  </div>
);

const DigestBlock: React.FC<{ title: string; body: string; tone?: 'strong' }> = ({ title, body, tone }) => (
  <div
    className={`rounded-2xl border p-6 sm:p-7 lg:p-8 ${
      tone === 'strong' ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-amber-100 text-neutral-800'
    }`}
  >
    <h3 className={`text-xs font-black uppercase tracking-wider ${tone === 'strong' ? 'text-yellow-300' : 'text-yellow-700'}`}>
      {title}
    </h3>
    <p className={`mt-4 text-base leading-8 sm:text-[18px] sm:leading-9 ${tone === 'strong' ? 'text-neutral-100' : 'text-neutral-700'}`}>
      {body}
    </p>
  </div>
);

const NumberedList: React.FC<{ items: string[]; italic?: boolean }> = ({ items, italic }) => (
  <ol className="space-y-5">
    {items.map((item, index) => (
      <li
        key={`${item}-${index}`}
        className={`flex min-w-0 gap-3 rounded-xl border border-amber-100 bg-white p-5 text-base leading-8 text-neutral-800 sm:gap-4 sm:rounded-2xl sm:p-7 sm:text-[18px] sm:leading-9 ${
          italic ? 'italic' : ''
        }`}
      >
        <span className="shrink-0 text-base font-black text-amber-700 not-italic sm:text-[18px]">{index + 1}.</span>
        <span className="min-w-0 whitespace-pre-wrap break-words">{item}</span>
      </li>
    ))}
  </ol>
);

const SimpleList: React.FC<{ items: string[]; italic?: boolean }> = ({ items, italic }) => (
  <ul className="space-y-5">
    {items.map((item, index) => (
      <li
        key={`${item}-${index}`}
        className={`min-w-0 rounded-xl border border-amber-100 bg-white p-5 text-base leading-8 text-neutral-800 sm:rounded-2xl sm:p-7 sm:text-[18px] sm:leading-9 ${
          italic ? 'italic' : ''
        }`}
      >
        <span className="whitespace-pre-wrap break-words">{item}</span>
      </li>
    ))}
  </ul>
);

const Section: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => (
  <div className="rounded-[1.15rem] border border-amber-200 bg-[#fffdf6] p-5 shadow-[0_18px_55px_-44px_rgba(24,20,17,0.72)] sm:rounded-[1.5rem] sm:p-7 lg:p-9">
    <div className="mb-6 border-b border-amber-100 pb-5 sm:mb-7 sm:pb-6">
      <h2 className="text-2xl font-black tracking-tight text-neutral-950 sm:text-[28px]">{title}</h2>
      <p className="mt-2 max-w-6xl text-base leading-7 text-neutral-600 sm:text-[17px] sm:leading-8">{subtitle}</p>
    </div>
    {children}
  </div>
);
