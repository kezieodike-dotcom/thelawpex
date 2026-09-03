import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Scale,
  FileText,
  Search,
  ChevronRight,
  Video,
  Mail,
  ShieldAlert,
  Newspaper,
  ArrowLeft,
} from 'lucide-react';
import { AREAS_OF_LAW, LANDMARK_CASES } from '../../data/legalData';
import { resourcesForArea } from '../../data/areaResources';
import { AreaResourceBundle } from '../../types';
import { DraftResourceCard } from '../DraftResourceCard';
import { DocumentActions } from '../DocumentActions';
import { ProseView } from '../ProseView';
import { buildWordList, buildWordSection } from '../../lib/copyToWord';
import { proseToWordHtml } from '../../lib/prose';

interface AreasOfLawViewProps {
  /** Practice area taken from the URL (`/areas-of-law/:areaId`). */
  selectedAreaId?: string;
  onSelectArea: (areaId: string) => void;
  setActiveTab: (tab: string) => void;
}

type FeatureKey =
  | 'demand'
  | 'initiating'
  | 'responding'
  | 'objections'
  | 'laws'
  | 'articles'
  | 'cases'
  | 'practicals';

/**
 * The eight features every area of law exposes, in the order a practitioner meets them:
 * the letter before action, the initiating processes, the response, the objections,
 * then the law, the commentary, the authorities and the courtroom procedure.
 */
const FEATURES: {
  key: FeatureKey;
  icon: React.ElementType;
  /** `%s` is replaced by the area title; `%p` by the initiating party label. */
  label: string;
}[] = [
  { key: 'demand', icon: Mail, label: 'Draft demand letters / memorandum of claim' },
  { key: 'initiating', icon: FileText, label: 'Draft & sample processes for %s (%p)' },
  { key: 'responding', icon: FileText, label: 'Draft & sample processes for %s (%r)' },
  { key: 'objections', icon: ShieldAlert, label: 'Likely preliminary objections & counter affidavit' },
  { key: 'laws', icon: BookOpen, label: 'Acts, rules and laws governing %s' },
  { key: 'articles', icon: Newspaper, label: 'Read article on %s' },
  { key: 'cases', icon: Scale, label: 'Case laws governing %s' },
  { key: 'practicals', icon: Video, label: 'Watch the courtroom practical procedure of %s' },
];

const featureLabel = (template: string, areaTitle: string, bundle: AreaResourceBundle): string =>
  template
    .replace('%s', areaTitle.toLowerCase())
    .replace('%p', bundle.partyLabels.initiating)
    .replace('%r', bundle.partyLabels.responding);

export const AreasOfLawView: React.FC<AreasOfLawViewProps> = ({
  selectedAreaId,
  onSelectArea,
  setActiveTab,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [activeFeature, setActiveFeature] = useState<FeatureKey>('demand');

  const query = filterQuery.trim().toLowerCase();
  const filteredAreas = useMemo(
    () =>
      AREAS_OF_LAW.filter(
        (area) =>
          !query ||
          area.title.toLowerCase().includes(query) ||
          area.description.toLowerCase().includes(query) ||
          area.popularTopics.some((topic) => topic.toLowerCase().includes(query)) ||
          area.applicableStatutes.some((statute) => statute.toLowerCase().includes(query)),
      ),
    [query],
  );

  const currentArea = selectedAreaId
    ? AREAS_OF_LAW.find((area) => area.id === selectedAreaId)
    : undefined;

  // No area chosen yet: the page is the search space and the list of areas of law.
  if (!currentArea) {
    return (
      <AreaDirectory
        areas={filteredAreas}
        query={filterQuery}
        onQueryChange={setFilterQuery}
        onSelectArea={onSelectArea}
      />
    );
  }

  const bundle = resourcesForArea(currentArea.id);
  if (!bundle) {
    return (
      <AreaDirectory
        areas={filteredAreas}
        query={filterQuery}
        onQueryChange={setFilterQuery}
        onSelectArea={onSelectArea}
      />
    );
  }

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <Link
            to="/areas-of-law"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-yellow-700 hover:text-yellow-800 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All forms and precedents
          </Link>

          <h1 className="text-2xl sm:text-4xl font-black font-serif text-neutral-900 mt-2">
            {currentArea.title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-700 max-w-3xl mt-1 leading-relaxed">
            {currentArea.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {currentArea.popularTopics.slice(0, 6).map((topic) => (
              <span
                key={topic}
                className="bg-white border border-neutral-200 text-neutral-700 text-[11px] px-2.5 py-1 rounded-lg"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* The eight features of this area */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2">
              What you can do in this area
            </h2>

            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              const isActive = activeFeature === feature.key;
              return (
                <button
                  key={feature.key}
                  onClick={() => setActiveFeature(feature.key)}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 ${
                    isActive
                      ? 'bg-yellow-400 text-neutral-950 border-yellow-400 font-bold shadow-lg shadow-yellow-500/25'
                      : 'bg-yellow-100 text-neutral-700 border-neutral-200 hover:border-yellow-500/80'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-neutral-950' : 'text-yellow-700'}`}
                  />
                  <span className="text-xs leading-snug">
                    {featureLabel(feature.label, currentArea.title, bundle)}
                  </span>
                </button>
              );
            })}

            <div className="pt-4">
              <button
                onClick={() => setActiveTab('ai-assistant')}
                className="w-full bg-yellow-100 hover:bg-yellow-200 border border-yellow-400/70 text-neutral-900 text-xs font-bold px-4 py-3 rounded-xl transition"
              >
                Open Ai Draft Wizard for {currentArea.title.toLowerCase()}
              </button>
            </div>
          </div>

          {/* The selected feature */}
          <div className="lg:col-span-2">
            <FeaturePanel
              feature={activeFeature}
              areaTitle={currentArea.title}
              bundle={bundle}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Directory — the search space and the list of areas of law
// ---------------------------------------------------------------------------

const AreaDirectory: React.FC<{
  areas: typeof AREAS_OF_LAW;
  query: string;
  onQueryChange: (value: string) => void;
  onSelectArea: (areaId: string) => void;
}> = ({ areas, query, onQueryChange, onSelectArea }) => (
  <div className="bg-white text-neutral-900 min-h-screen py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
        <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
          Module 1
        </span>
        <h1 className="text-2xl sm:text-4xl font-black font-serif text-neutral-900 mt-2">Forms and Precedents</h1>
        <p className="text-xs sm:text-sm text-neutral-700 max-w-3xl mt-1 leading-relaxed">
          Choose a practice area. Every forms and precedents space opens with the same eight tools — demand letters,
          sample processes for both sides, likely preliminary objections and counter affidavits, the
          governing Acts and rules, an article, the case laws and the courtroom procedure.
        </p>

        <div className="mt-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-700" />
          <input
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search forms and precedents e.g. Matrimonial Causes, Land, Criminal, CAMA, Tax..."
            className="w-full bg-white text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-yellow-400"
          />
        </div>
      </div>

      {areas.length === 0 ? (
        <p className="text-sm text-neutral-600">No form or precedent area matches “{query}”.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {areas.map((area) => (
            <button
              key={area.id}
              onClick={() => onSelectArea(area.id)}
              className="text-left bg-yellow-100 border border-neutral-200 hover:border-yellow-500/50 rounded-2xl p-5 transition shadow-lg group flex flex-col justify-between"
            >
              <div>
                <h2 className="text-base font-black font-serif text-neutral-900 group-hover:text-yellow-700 transition">
                  {area.title}
                </h2>
                <p className="text-[11px] text-neutral-600 mt-1.5 leading-relaxed line-clamp-3">
                  {area.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
                <span className="text-[11px] text-neutral-500">
                  {area.draftCount}+ drafts • {area.caseCount}+ judgments
                </span>
                <ChevronRight className="w-4 h-4 text-yellow-700" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Feature panels
// ---------------------------------------------------------------------------

const PanelShell: React.FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <div className="bg-yellow-100 border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
    <div className="border-b border-neutral-200 pb-4">
      <h2 className="text-xl font-black font-serif text-neutral-900">{title}</h2>
      <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{subtitle}</p>
    </div>
    {children}
  </div>
);

const FeaturePanel: React.FC<{
  feature: FeatureKey;
  areaTitle: string;
  bundle: AreaResourceBundle;
  setActiveTab: (tab: string) => void;
}> = ({ feature, areaTitle, bundle, setActiveTab }) => {
  const { initiating, responding } = bundle.partyLabels;

  if (feature === 'demand') {
    return (
      <PanelShell
        title="Demand letters & memorandum of claim"
        subtitle={`The letter before action in ${areaTitle.toLowerCase()} matters. Send it, and the time it gives, before the originating process is filed.`}
      >
        {bundle.demandLetters.map((draft) => (
          <DraftResourceCard
            key={draft.id}
            draft={draft}
            eyebrow="Pre-action correspondence"
            wordSubtitle={areaTitle}
            defaultOpen={bundle.demandLetters.length === 1}
          />
        ))}
      </PanelShell>
    );
  }

  if (feature === 'initiating' || feature === 'responding') {
    const isInitiating = feature === 'initiating';
    // The initiating side is capped at two sample processes, as specified for the module.
    const drafts = isInitiating
      ? bundle.initiatingProcesses.slice(0, 2)
      : bundle.respondingProcesses;
    const party = isInitiating ? initiating : responding;

    return (
      <PanelShell
        title={`Sample processes for ${areaTitle.toLowerCase()} (${party})`}
        subtitle={
          isInitiating
            ? `The two processes that open a ${areaTitle.toLowerCase()} matter for the ${party.toLowerCase()}, court-ready and ready to be taken into MS Word.`
            : `What the ${party.toLowerCase()} files in answer, court-ready and ready to be taken into MS Word.`
        }
      >
        {drafts.map((draft, index) => (
          <DraftResourceCard
            key={draft.id}
            draft={draft}
            eyebrow={`${party} — sample process ${index + 1}`}
            wordSubtitle={`${areaTitle} — ${party}`}
          />
        ))}
      </PanelShell>
    );
  }

  if (feature === 'objections') {
    return (
      <PanelShell
        title="Likely preliminary objections & counter affidavit"
        subtitle={`The objections most often taken in limine in ${areaTitle.toLowerCase()} matters, and the counter affidavit that answers the application on the facts.`}
      >
        {bundle.preliminaryObjections.map((draft) => (
          <DraftResourceCard
            key={draft.id}
            draft={draft}
            eyebrow="Objection / counter affidavit"
            wordSubtitle={areaTitle}
          />
        ))}
      </PanelShell>
    );
  }

  if (feature === 'laws') {
    return (
      <PanelShell
        title={`Acts, rules and laws governing ${areaTitle.toLowerCase()}`}
        subtitle="The statutes, rules of court and constitutional provisions the court applies in this area."
      >
        <div className="space-y-3">
          {bundle.governingLaws.map((law, index) => (
            <div key={`${law.title}-${index}`} className="bg-white border border-neutral-200 rounded-xl p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider">
                    {law.kind}
                  </span>
                  <h4 className="text-sm font-bold font-serif text-neutral-900">{law.title}</h4>
                  <p className="text-[11px] text-neutral-500 font-mono mt-0.5">{law.citation}</p>
                </div>

                <button
                  onClick={() => setActiveTab(law.kind === 'Rules' ? 'court-rules' : 'laws')}
                  className="text-[11px] font-bold text-yellow-700 hover:underline shrink-0"
                >
                  {law.kind === 'Rules' ? 'Search the rules' : 'Open the law'}
                </button>
              </div>

              <p className="text-[11px] text-neutral-600 mt-2 leading-relaxed">{law.note}</p>
            </div>
          ))}
        </div>

        <DocumentActions
          html={buildWordList(
            `Acts, rules and laws governing ${areaTitle}`,
            'LAWPEX — governing law',
            bundle.governingLaws.map((law) => `<strong>${law.title}</strong> (${law.citation}) — ${law.note}`),
          )}
          filename={`${areaTitle} - governing law`}
          hint="Copy the full list of governing law to MS Word."
        />
      </PanelShell>
    );
  }

  if (feature === 'articles') {
    return (
      <PanelShell
        title={`Article on ${areaTitle.toLowerCase()}`}
        subtitle="Practice commentary on how these matters are actually run, from filing through to judgment."
      >
        <div className="space-y-6">
          {bundle.articles.map((article) => (
            <article key={article.id} className="bg-white border border-neutral-200 rounded-xl p-5 space-y-4">
              <header>
                <h3 className="text-base font-black font-serif text-neutral-900">{article.title}</h3>
                <p className="text-[11px] text-neutral-500 mt-1">
                  {article.author} • {article.readTimeMinutes} min read
                </p>
              </header>

              <ProseView body={article.body} />

              <DocumentActions
                html={proseToWordHtml(article.title, `${article.author} — LAWPEX`, article.body)}
                filename={article.title}
                hint="Copy the article to MS Word."
              />
            </article>
          ))}
        </div>
      </PanelShell>
    );
  }

  if (feature === 'cases') {
    const cases = bundle.caseIds
      .map((id) => LANDMARK_CASES.find((judgment) => judgment.id === id))
      .filter((judgment): judgment is (typeof LANDMARK_CASES)[number] => Boolean(judgment));

    return (
      <PanelShell
        title={`Case laws governing ${areaTitle.toLowerCase()}`}
        subtitle="The authorities the court is bound by. Open a case for its principles of law and the whole judgment."
      >
        {cases.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <p className="text-xs text-neutral-600 leading-relaxed">
              No judgment in the library is yet indexed to this area. Search the full case laws
              library for authorities on {areaTitle.toLowerCase()}.
            </p>
            <button
              onClick={() => setActiveTab('case-law')}
              className="mt-3 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs px-4 py-2 rounded-lg transition"
            >
              Search case laws
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {cases.map((judgment) => (
              <Link
                key={judgment.id}
                to={`/case-law/case/${judgment.id}`}
                className="block bg-white border border-neutral-200 hover:border-yellow-500/50 rounded-xl p-4 transition group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider">
                      {judgment.court} • {judgment.year}
                    </span>
                    <h4 className="text-sm font-bold font-serif text-neutral-900 group-hover:text-yellow-700 transition">
                      {judgment.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500 font-mono mt-0.5">{judgment.citation}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-yellow-700 shrink-0 mt-1" />
                </div>

                <p className="text-[11px] text-neutral-600 mt-2 leading-relaxed line-clamp-2 italic">
                  “{judgment.ratioDecidendi[0]}”
                </p>
              </Link>
            ))}
          </div>
        )}
      </PanelShell>
    );
  }

  return (
    <PanelShell
      title={`Courtroom practical procedure — ${areaTitle.toLowerCase()}`}
      subtitle="What actually happens in court, in the order it happens, from announcing appearances to adopting the written address."
    >
      <div className="space-y-6">
        {bundle.practicals.map((practical) => (
          <div key={practical.id} className="bg-white border border-neutral-200 rounded-xl p-5 space-y-4">
            <header className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-black font-serif text-neutral-900">{practical.title}</h3>
                <p className="text-[11px] text-neutral-500 mt-1">
                  {practical.instructor} • {practical.duration}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('practicals')}
                className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-[11px] px-3 py-1.5 rounded-lg transition"
              >
                <Video className="w-3.5 h-3.5" />
                Watch the demonstration
              </button>
            </header>

            <p className="text-xs text-neutral-700 leading-relaxed">{practical.summary}</p>

            <ol className="space-y-2">
              {practical.steps.map((step, index) => (
                <li
                  key={index}
                  className="flex gap-2.5 text-xs text-neutral-700 bg-yellow-100 border border-neutral-200 rounded-lg p-3 leading-relaxed"
                >
                  <span className="text-yellow-700 font-bold shrink-0">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <DocumentActions
              html={buildWordSection(practical.title, practical.summary, practical.steps)}
              filename={practical.title}
              hint="Copy the procedure to MS Word as a bench note."
            />
          </div>
        ))}
      </div>
    </PanelShell>
  );
};
