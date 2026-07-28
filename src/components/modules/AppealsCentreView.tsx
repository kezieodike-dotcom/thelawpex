import React, { useState } from 'react';
import { Scale, Clock, CheckCircle2, FileText, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { APPEALS_RESOURCES } from '../../data/legalData';

interface AppealsCentreViewProps {
  setActiveTab: (tab: string) => void;
}

export const AppealsCentreView: React.FC<AppealsCentreViewProps> = ({ setActiveTab }) => {
  const [selectedResId, setSelectedResId] = useState(APPEALS_RESOURCES[0].id);

  const selectedRes = APPEALS_RESOURCES.find(a => a.id === selectedResId) || APPEALS_RESOURCES[0];

  return (
    <div className="bg-neutral-950 text-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-neutral-900 border border-yellow-500/30 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            MODULE 5
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-white mt-2">Appeals Centre & Practice Guide</h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl mt-1">
            Comprehensive appellate litigation tool covering Appeals as of Right, Applications for Leave to Appeal, Grounds of Appeal, Statutory Timelines, and Court of Appeal Practice Directions.
          </p>
        </div>

        {/* Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories Column */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Appellate Resource Modules</h2>
            {APPEALS_RESOURCES.map((res) => (
              <button
                key={res.id}
                onClick={() => setSelectedResId(res.id)}
                className={`w-full text-left p-4 rounded-xl border transition ${
                  selectedResId === res.id
                    ? 'bg-yellow-400 text-neutral-950 border-yellow-400 font-bold shadow-lg shadow-yellow-500/20'
                    : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-yellow-500/40'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${selectedResId === res.id ? 'bg-neutral-950 text-yellow-400' : 'bg-neutral-800 text-neutral-400'}`}>
                    {res.courtLevel}
                  </span>
                </div>
                <h3 className="text-sm font-bold font-serif mt-2">{res.title}</h3>
                <p className={`text-[11px] line-clamp-2 mt-1 ${selectedResId === res.id ? 'text-neutral-900' : 'text-neutral-400'}`}>
                  {res.description}
                </p>
              </button>
            ))}
          </div>

          {/* Details Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div>
                <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">
                  {selectedRes.relevantRules}
                </span>
                <h2 className="text-2xl font-black font-serif text-white mt-1">{selectedRes.title}</h2>
                <p className="text-xs text-neutral-300 mt-2 leading-relaxed">{selectedRes.description}</p>
              </div>

              {/* Timeframe Banner */}
              <div className="bg-neutral-950 border-2 border-yellow-500/40 p-4 rounded-xl flex items-center gap-3">
                <Clock className="w-6 h-6 text-yellow-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-yellow-400 uppercase">Statutory Timeframe & Deadline</h4>
                  <p className="text-xs text-white font-mono mt-0.5">{selectedRes.statutoryTimeframe}</p>
                </div>
              </div>

              {/* Procedural Checklist */}
              <div>
                <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-3">Appellate Step-by-Step Checklist</h3>
                <div className="space-y-2">
                  {selectedRes.checklists.map((step, idx) => (
                    <div key={idx} className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-start gap-2.5 text-xs text-neutral-200">
                      <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-neutral-800 flex gap-4">
                <button
                  onClick={() => setActiveTab('drafts')}
                  className="bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Customize Notice of Appeal Draft</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
