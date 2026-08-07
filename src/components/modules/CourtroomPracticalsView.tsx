import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ChevronRight,
  ArrowLeft,
  Play,
  BookOpen,
  Clock,
  Gavel,
  MessageSquareQuote,
  AlertTriangle,
  Video,
  ListOrdered,
} from 'lucide-react';
import { COURTROOM_VIDEOS } from '../../data/legalData';
import {
  COURTROOM_PROCEDURES,
  PROCEDURE_TRACKS,
  procedureById,
  proceduresInTrack,
  searchProcedures,
} from '../../data/procedures';
import { CourtroomProcedure } from '../../types';
import { DocumentActions } from '../DocumentActions';
import { buildWordList, buildWordSection } from '../../lib/copyToWord';

interface CourtroomPracticalsViewProps {
  /** Procedure taken from the URL (`/courtroom-practicals/:procedureId`). */
  procedureId?: string;
}

export const CourtroomPracticalsView: React.FC<CourtroomPracticalsViewProps> = ({ procedureId }) => {
  const procedure = procedureId ? procedureById(procedureId) : undefined;
  if (procedure) return <ProcedureDetail procedure={procedure} />;
  return <PracticalsHome />;
};

// ---------------------------------------------------------------------------
// The module home — procedures first, demonstrations second
// ---------------------------------------------------------------------------

const PracticalsHome: React.FC = () => {
  const [tab, setTab] = useState<'procedures' | 'videos'>('procedures');

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl">
          <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            Module 7
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-neutral-900 mt-2">
            Different Court Room Procedures
          </h1>
          <p className="text-xs sm:text-sm text-neutral-700 max-w-3xl mt-1 leading-relaxed">
            What actually happens in court, in the order it happens — civil trials, criminal trials,
            motions, witnesses and exhibits, matrimonial causes, fundamental rights, garnishee,
            election petitions and appeals. Each procedure carries the rules that govern it, the
            words counsel says, and the places where matters go wrong.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setTab('procedures')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              tab === 'procedures'
                ? 'bg-yellow-400 text-neutral-950 shadow-lg shadow-yellow-500/25'
                : 'bg-yellow-100 text-neutral-700 border border-neutral-200 hover:border-yellow-500/80'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            Court room procedures
          </button>

          <button
            onClick={() => setTab('videos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              tab === 'videos'
                ? 'bg-yellow-400 text-neutral-950 shadow-lg shadow-yellow-500/25'
                : 'bg-yellow-100 text-neutral-700 border border-neutral-200 hover:border-yellow-500/80'
            }`}
          >
            <Video className="w-4 h-4" />
            Video demonstrations
          </button>
        </div>

        {tab === 'procedures' ? <ProcedureDirectory /> : <VideoLibrary />}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// The procedures, with the search banner on top
// ---------------------------------------------------------------------------

const ProcedureDirectory: React.FC = () => {
  const [query, setQuery] = useState('');
  const [track, setTrack] = useState<string>('all');

  const needle = query.trim();
  const results = useMemo(() => {
    const matched = searchProcedures(needle);
    return track === 'all' ? matched : matched.filter((procedure) => procedure.track === track);
  }, [needle, track]);

  return (
    <div className="space-y-6">
      <div className="bg-yellow-100 border border-neutral-200 rounded-2xl p-6 shadow-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-700" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search procedures e.g. 'arraignment', 'tendering exhibits', 'garnishee', 'decree nisi', 'no case submission'..."
            className="w-full bg-white text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-yellow-400"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <TrackChip
            label="All proceedings"
            isActive={track === 'all'}
            onClick={() => setTrack('all')}
            count={COURTROOM_PROCEDURES.length}
          />
          {PROCEDURE_TRACKS.map((item) => (
            <TrackChip
              key={item.id}
              label={item.label}
              isActive={track === item.id}
              onClick={() => setTrack(item.id)}
              count={proceduresInTrack(item.id).length}
            />
          ))}
        </div>

        <p className="text-[11px] text-neutral-500 mt-4">
          Showing {results.length} of {COURTROOM_PROCEDURES.length} procedures — search runs across
          every stage, every step and every pitfall.
        </p>
      </div>

      {results.length === 0 ? (
        <p className="text-sm text-neutral-600">No procedure matches “{query}”.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {results.map((procedure) => {
            const trackLabel =
              PROCEDURE_TRACKS.find((item) => item.id === procedure.track)?.label ?? procedure.track;
            const stepCount = procedure.stages.reduce(
              (count, stage) => count + stage.steps.length,
              0,
            );

            return (
              <Link
                key={procedure.id}
                to={`/courtroom-practicals/${procedure.id}`}
                className="bg-yellow-100 border border-neutral-200 hover:border-yellow-500/50 rounded-2xl p-6 transition shadow-lg group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Gavel className="w-4 h-4 text-yellow-700" />
                    <span className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider">
                      {trackLabel}
                    </span>
                  </div>

                  <h2 className="text-base font-black font-serif text-neutral-900 group-hover:text-yellow-700 transition leading-snug">
                    {procedure.title}
                  </h2>
                  <p className="text-[11px] text-neutral-500 mt-1">{procedure.court}</p>
                  <p className="text-[11px] text-neutral-600 mt-2 leading-relaxed">
                    {procedure.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500">
                    {procedure.stages.length} stages • {stepCount} steps
                  </span>
                  <ChevronRight className="w-4 h-4 text-yellow-700" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const TrackChip: React.FC<{
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
      isActive
        ? 'bg-yellow-400 text-neutral-950 border-yellow-400 font-bold'
        : 'bg-white text-neutral-700 border-neutral-200 hover:border-yellow-500/80'
    }`}
  >
    {label} ({count})
  </button>
);

// ---------------------------------------------------------------------------
// One procedure, stage by stage
// ---------------------------------------------------------------------------

const ProcedureDetail: React.FC<{ procedure: CourtroomProcedure }> = ({ procedure }) => {
  const trackLabel =
    PROCEDURE_TRACKS.find((item) => item.id === procedure.track)?.label ?? procedure.track;

  const wordDocument = [
    buildWordSection(procedure.title, `${procedure.court} — ${trackLabel}`, [procedure.summary]),
    ...procedure.stages.map((stage) => buildWordList(stage.heading, '', stage.steps)),
    buildWordList('What counsel says in court', '', procedure.saidInCourt),
    buildWordList('Common pitfalls', '', procedure.pitfalls),
    buildWordList('Governing rules', '', procedure.governingRules),
  ].join('');

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl">
          <Link
            to="/courtroom-practicals"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-yellow-700 hover:text-yellow-800 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All court room procedures
          </Link>

          <h1 className="text-xl sm:text-3xl font-black font-serif text-neutral-900 mt-2 leading-snug">
            {procedure.title}
          </h1>
          <p className="text-xs text-yellow-700 font-mono mt-1">{procedure.court}</p>
          <p className="text-xs sm:text-sm text-neutral-700 mt-2 leading-relaxed">
            {procedure.summary}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-white border border-neutral-200 text-neutral-700 text-[11px] px-2.5 py-1 rounded-lg">
              {trackLabel}
            </span>
            <span className="bg-white border border-neutral-200 text-neutral-700 text-[11px] px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-yellow-700" />
              {procedure.typicalDuration}
            </span>
          </div>
        </div>

        <div className="space-y-5">
          {/* The stages */}
          {procedure.stages.map((stage, stageIndex) => (
            <div
              key={stageIndex}
              className="bg-yellow-100 border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xl"
            >
              <h2 className="text-lg font-black font-serif text-neutral-900 border-b border-neutral-200 pb-3 mb-4">
                {stage.heading}
              </h2>

              <ol className="space-y-2">
                {stage.steps.map((step, stepIndex) => (
                  <li
                    key={stepIndex}
                    className="bg-white border border-neutral-200 rounded-xl p-3.5 flex gap-2.5 text-xs text-neutral-800 leading-relaxed"
                  >
                    <span className="text-yellow-700 font-black shrink-0">{stepIndex + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}

          <Panel
            title="What counsel actually says"
            subtitle="The register the court expects, in the order the words are used."
            icon={MessageSquareQuote}
          >
            <ul className="space-y-2.5">
              {procedure.saidInCourt.map((line, index) => (
                <li
                  key={index}
                  className="bg-white border border-neutral-200 rounded-xl p-4 text-xs text-neutral-800 leading-relaxed italic"
                >
                  {line}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="Where it goes wrong"
            subtitle="The defects that cost practitioners the application, the trial or the appeal."
            icon={AlertTriangle}
          >
            <ul className="space-y-2">
              {procedure.pitfalls.map((pitfall, index) => (
                <li
                  key={index}
                  className="bg-white border border-neutral-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-neutral-700 leading-relaxed"
                >
                  <AlertTriangle className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
                  <span>{pitfall}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="Governing rules"
            subtitle="Confirm the Order and Rule numbers against the edition currently in force in your court."
            icon={BookOpen}
          >
            <ul className="space-y-2">
              {procedure.governingRules.map((rule, index) => (
                <li
                  key={index}
                  className="bg-white border border-neutral-200 rounded-xl p-3 text-xs text-neutral-800 leading-relaxed"
                >
                  {rule}
                </li>
              ))}
            </ul>

            <DocumentActions
              className="mt-5"
              html={wordDocument}
              filename={procedure.title}
              hint="Copy the whole procedure to MS Word as a bench note."
            />
          </Panel>
        </div>
      </div>
    </div>
  );
};

const Panel: React.FC<{
  title: string;
  subtitle: string;
  icon: React.ElementType;
  children: React.ReactNode;
}> = ({ title, subtitle, icon: Icon, children }) => (
  <div className="bg-yellow-100 border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xl">
    <div className="border-b border-neutral-200 pb-3 mb-4 flex items-start gap-3">
      <Icon className="w-5 h-5 text-yellow-700 shrink-0 mt-0.5" />
      <div>
        <h2 className="text-lg font-black font-serif text-neutral-900">{title}</h2>
        <p className="text-[11px] text-neutral-600 mt-0.5">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// The video demonstrations
// ---------------------------------------------------------------------------

const VideoLibrary: React.FC = () => {
  const [selected, setSelected] = useState(COURTROOM_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const select = (video: (typeof COURTROOM_VIDEOS)[number]) => {
    setSelected(video);
    setIsPlaying(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="relative aspect-video bg-yellow-100 border border-neutral-200 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center group">
          {isPlaying ? (
            <iframe
              src={selected.videoUrl}
              title={selected.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <>
              <img
                src={selected.thumbnailUrl}
                alt={selected.title}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />

              <button
                onClick={() => setIsPlaying(true)}
                aria-label={`Play ${selected.title}`}
                className="relative z-10 w-16 h-16 rounded-full bg-yellow-400 text-neutral-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform"
              >
                <Play className="w-8 h-8 fill-neutral-950 ml-1" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end">
                <div>
                  <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    {selected.topic}
                  </span>
                  <h2 className="text-lg font-bold font-serif text-neutral-900 mt-1">{selected.title}</h2>
                </div>
                <span className="text-xs bg-white/90 text-yellow-700 font-mono px-2.5 py-1 rounded border border-neutral-300">
                  {selected.duration}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="bg-yellow-100 border border-neutral-200 p-6 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-yellow-700 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Instructor lecture notes
          </h3>
          <p className="text-[11px] text-neutral-500">
            {selected.instructorName} • {selected.instructorTitle}
          </p>
          <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap">
            {selected.summaryNotes}
          </p>

          <DocumentActions
            className="pt-3 border-t border-neutral-200"
            html={buildWordSection(
              selected.title,
              `${selected.instructorName} — ${selected.instructorTitle}`,
              selected.summaryNotes.split('\n').filter(Boolean),
            )}
            filename={selected.title}
            hint="Copy the lecture notes to MS Word."
          />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2">
          Practical masterclass modules
        </h2>

        {COURTROOM_VIDEOS.map((video) => (
          <button
            key={video.id}
            onClick={() => select(video)}
            className={`w-full text-left p-4 rounded-2xl border transition flex gap-3 ${
              selected.id === video.id
                ? 'bg-yellow-100 border-yellow-400 shadow-xl'
                : 'bg-white border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="w-20 h-14 rounded-lg bg-yellow-100 overflow-hidden relative shrink-0">
              <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Play className="w-4 h-4 text-yellow-700 fill-yellow-400" />
              </div>
            </div>

            <div className="flex-1">
              <span className="text-[10px] text-yellow-700 font-bold uppercase">{video.topic}</span>
              <h3 className="text-xs font-bold font-serif text-neutral-900 line-clamp-2 mt-0.5">
                {video.title}
              </h3>
              <span className="text-[10px] text-neutral-500 block mt-1">{video.instructorName}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
