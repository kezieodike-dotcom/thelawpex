import React, { useState } from 'react';
import { Clock, CheckCircle2, Scale, FileText, Info, ArrowRight } from 'lucide-react';
import { APPEAL_LADDERS, APPEAL_RIGHTS } from '../../data/appeals';
import { DraftResourceCard } from '../DraftResourceCard';
import { DocumentActions } from '../DocumentActions';
import { buildWordList, buildWordSection } from '../../lib/copyToWord';

interface AppealsCentreViewProps {
  setActiveTab: (tab: string) => void;
}

type Selection = { kind: 'right'; id: string } | { kind: 'ladder'; id: string };

export const AppealsCentreView: React.FC<AppealsCentreViewProps> = ({ setActiveTab }) => {
  const [selection, setSelection] = useState<Selection>({ kind: 'right', id: APPEAL_RIGHTS[0].id });

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            Module 5
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-neutral-900 mt-2">Appeals</h1>
          <p className="text-xs sm:text-sm text-neutral-700 max-w-3xl mt-1 leading-relaxed">
            Where the right of appeal comes from, when it is exercisable as of right and when leave
            must first be obtained — with sample appeal processes for every rung of the ladder, from
            the Magistrate Court to the Supreme Court.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Navigation */}
          <div className="space-y-5">
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2">
                The right to appeal
              </h2>
              {APPEAL_RIGHTS.map((right) => {
                const isActive = selection.kind === 'right' && selection.id === right.id;
                return (
                  <button
                    key={right.id}
                    onClick={() => setSelection({ kind: 'right', id: right.id })}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 ${
                      isActive
                        ? 'bg-yellow-400 text-neutral-950 border-yellow-400 font-bold shadow-lg shadow-yellow-500/25'
                        : 'bg-yellow-100 text-neutral-700 border-neutral-200 hover:border-yellow-500/80'
                    }`}
                  >
                    <Scale
                      className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-neutral-950' : 'text-yellow-700'}`}
                    />
                    <span className="text-xs leading-snug">{right.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <h2 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2">
                Sample appeal drafts
              </h2>
              {APPEAL_LADDERS.map((ladder) => {
                const isActive = selection.kind === 'ladder' && selection.id === ladder.id;
                return (
                  <button
                    key={ladder.id}
                    onClick={() => setSelection({ kind: 'ladder', id: ladder.id })}
                    className={`w-full text-left p-3.5 rounded-xl border transition ${
                      isActive
                        ? 'bg-yellow-400 text-neutral-950 border-yellow-400 font-bold shadow-lg shadow-yellow-500/25'
                        : 'bg-yellow-100 text-neutral-700 border-neutral-200 hover:border-yellow-500/80'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] leading-snug">
                      <span>{ladder.fromCourt}</span>
                      <ArrowRight
                        className={`w-3 h-3 shrink-0 ${isActive ? 'text-neutral-950' : 'text-yellow-700'}`}
                      />
                      <span>{ladder.toCourt}</span>
                    </div>
                    <p
                      className={`text-[10px] mt-1 ${isActive ? 'text-neutral-800' : 'text-neutral-500'}`}
                    >
                      {ladder.drafts.length} sample processes
                    </p>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setActiveTab('drafts')}
              className="w-full bg-yellow-100 hover:bg-yellow-200 border border-yellow-400/70 text-neutral-900 text-xs font-bold px-4 py-3 rounded-xl transition"
            >
              Open the full draft library
            </button>
          </div>

          {/* Detail */}
          <div className="lg:col-span-2">
            {selection.kind === 'right' ? (
              <RightPanel id={selection.id} />
            ) : (
              <LadderPanel id={selection.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const RightPanel: React.FC<{ id: string }> = ({ id }) => {
  const right = APPEAL_RIGHTS.find((item) => item.id === id) ?? APPEAL_RIGHTS[0];

  return (
    <div className="bg-yellow-100 border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="border-b border-neutral-200 pb-4">
        <span className="text-[10px] text-yellow-700 font-bold uppercase tracking-wider">
          {right.constitutionalBasis}
        </span>
        <h2 className="text-2xl font-black font-serif text-neutral-900 mt-1">{right.title}</h2>
        <p className="text-xs text-neutral-700 mt-2 leading-relaxed">{right.summary}</p>
      </div>

      <div className="bg-white border-2 border-yellow-500/70 p-4 rounded-xl flex items-start gap-3">
        <Clock className="w-5 h-5 text-yellow-700 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-xs font-bold text-yellow-700 uppercase">Time</h3>
          <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed">{right.timeframe}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-3">
          When it applies
        </h3>
        <ul className="space-y-2">
          {right.whenItApplies.map((item, index) => (
            <li
              key={index}
              className="bg-white border border-neutral-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-neutral-800 leading-relaxed"
            >
              <CheckCircle2 className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-3">
          Practice notes
        </h3>
        <ul className="space-y-2">
          {right.practiceNotes.map((note, index) => (
            <li
              key={index}
              className="bg-white border border-neutral-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-neutral-700 leading-relaxed"
            >
              <Info className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>

      <DocumentActions
        html={[
          buildWordSection(right.title, right.constitutionalBasis, [right.summary, right.timeframe]),
          buildWordList('When it applies', '', right.whenItApplies),
          buildWordList('Practice notes', '', right.practiceNotes),
        ].join('')}
        filename={right.title}
        hint="Copy this note on the right of appeal to MS Word."
      />
    </div>
  );
};

const LadderPanel: React.FC<{ id: string }> = ({ id }) => {
  const ladder = APPEAL_LADDERS.find((item) => item.id === id) ?? APPEAL_LADDERS[0];

  return (
    <div className="bg-yellow-100 border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="border-b border-neutral-200 pb-4">
        <span className="text-[10px] text-yellow-700 font-bold uppercase tracking-wider">
          {ladder.fromCourt} → {ladder.toCourt}
        </span>
        <h2 className="text-2xl font-black font-serif text-neutral-900 mt-1">{ladder.title}</h2>
        <p className="text-xs text-neutral-700 mt-2 leading-relaxed">{ladder.summary}</p>
      </div>

      {ladder.note && (
        <div className="bg-yellow-400/20 border border-yellow-500/70 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-100 leading-relaxed">{ladder.note}</p>
        </div>
      )}

      <div className="bg-white border-2 border-yellow-500/70 p-4 rounded-xl flex items-start gap-3">
        <Clock className="w-5 h-5 text-yellow-700 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-xs font-bold text-yellow-700 uppercase">Statutory timeframe</h3>
          <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed">{ladder.timeframe}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-3">
          What this appeal requires
        </h3>
        <ul className="space-y-2">
          {ladder.requirements.map((item, index) => (
            <li
              key={index}
              className="bg-white border border-neutral-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-neutral-800 leading-relaxed"
            >
              <CheckCircle2 className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Sample appeal drafts
        </h3>
        <div className="space-y-3">
          {ladder.drafts.map((draft) => (
            <DraftResourceCard
              key={draft.id}
              draft={draft}
              eyebrow={`${ladder.fromCourt} → ${ladder.toCourt}`}
              wordSubtitle={ladder.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
