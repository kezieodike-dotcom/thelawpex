import React, { useState } from 'react';
import { BookOpen, Scale, FileText, ArrowRight, Search, CheckCircle2, ShieldCheck, ChevronRight, Gavel, ListChecks, Video } from 'lucide-react';
import { AREAS_OF_LAW } from '../../data/legalData';

interface AreasOfLawViewProps {
  onSelectArea: (areaId: string) => void;
  setActiveTab: (tab: string) => void;
}

export const AreasOfLawView: React.FC<AreasOfLawViewProps> = ({ onSelectArea, setActiveTab }) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState<string>(AREAS_OF_LAW[0].id);

  const filteredAreas = AREAS_OF_LAW.filter(a =>
    a.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const currentArea = AREAS_OF_LAW.find(a => a.id === selectedAreaId) || AREAS_OF_LAW[0];

  return (
    <div className="bg-neutral-950 text-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-neutral-900 border border-yellow-500/30 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            MODULE 1
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-white mt-2">Areas of Law Ecosystem</h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl mt-1">
            20+ specialized Nigerian legal fields equipped with Draft Templates, Applicable LFN Statutes, Court Rules, Legal Principles, Case Laws, and Practical Checklists.
          </p>

          <div className="mt-4 relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search Areas of Law e.g. Criminal, CAMA, Tax, Land..."
              className="w-full bg-neutral-950 text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-neutral-800 text-white focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Areas List Column */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Select Legal Practice Area</h2>
            {filteredAreas.map((area) => (
              <button
                key={area.id}
                onClick={() => setSelectedAreaId(area.id)}
                className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between group ${
                  selectedAreaId === area.id
                    ? 'bg-yellow-400 text-neutral-950 border-yellow-400 font-bold shadow-lg shadow-yellow-500/20'
                    : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-yellow-500/40'
                }`}
              >
                <div>
                  <h3 className="text-sm font-bold font-serif">{area.title}</h3>
                  <p className={`text-[11px] line-clamp-1 mt-0.5 ${selectedAreaId === area.id ? 'text-neutral-900 font-medium' : 'text-neutral-400'}`}>
                    {area.description}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${selectedAreaId === area.id ? 'text-neutral-950' : 'text-neutral-500'}`} />
              </button>
            ))}
          </div>

          {/* Selected Area Detail View */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="border-b border-neutral-800 pb-4">
                <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">Practice Area Deep Dive</span>
                <h2 className="text-2xl font-black font-serif text-white mt-1">{currentArea.title}</h2>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">{currentArea.description}</p>
              </div>

              {/* Popular Topics */}
              <div>
                <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                  Key Litigation Topics & Principles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentArea.popularTopics.map((topic, idx) => (
                    <span key={idx} className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs px-3 py-1.5 rounded-lg">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Applicable Statutes */}
              <div>
                <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-yellow-400" />
                  Primary Applicable Statutes
                </h3>
                <ul className="space-y-2 text-xs text-neutral-300">
                  {currentArea.applicableStatutes.map((statute, idx) => (
                    <li key={idx} className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 flex items-center justify-between">
                      <span>{statute}</span>
                      <button onClick={() => setActiveTab('laws')} className="text-yellow-400 font-bold hover:underline">
                        View Law
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Court Rules */}
              <div>
                <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-yellow-400" />
                  Relevant Court Rules
                </h3>
                <div className="space-y-2 text-xs text-neutral-300">
                  {currentArea.keyRules.map((rule, idx) => (
                    <div key={idx} className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 flex items-center justify-between">
                      <span>{rule}</span>
                      <button onClick={() => setActiveTab('court-rules')} className="text-yellow-400 font-bold hover:underline">
                        Search Rules
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Principles of Law */}
              <div>
                <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-yellow-400" />
                  Principles of Law
                </h3>
                <ul className="space-y-2 text-xs text-neutral-300">
                  {currentArea.principlesOfLaw.map((principle, idx) => (
                    <li key={idx} className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 flex gap-2">
                      <span className="text-yellow-400 font-bold shrink-0">{idx + 1}.</span>
                      <span className="leading-relaxed">{principle}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Litigation Checklist */}
              <div>
                <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-yellow-400" />
                  Step-by-Step Litigation Checklist
                </h3>
                <ul className="space-y-2 text-xs text-neutral-300">
                  {currentArea.checklists.map((step, idx) => (
                    <li key={idx} className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-800 flex flex-wrap gap-4">
                <button
                  onClick={() => setActiveTab('drafts')}
                  className="bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Browse {currentArea.draftCount}+ Draft Processes</span>
                </button>

                <button
                  onClick={() => setActiveTab('case-law')}
                  className="bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs px-5 py-3 rounded-xl border border-neutral-800 transition flex items-center gap-2"
                >
                  <Scale className="w-4 h-4 text-yellow-400" />
                  <span>View {currentArea.caseCount}+ Judgments</span>
                </button>

                <button
                  onClick={() => setActiveTab('practicals')}
                  className="bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs px-5 py-3 rounded-xl border border-neutral-800 transition flex items-center gap-2"
                >
                  <Video className="w-4 h-4 text-yellow-400" />
                  <span>Practical Videos</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
